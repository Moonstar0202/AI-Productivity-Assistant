import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  CalendarDays,
  Scissors,
  ListChecks,
  Sparkles,
  MessageCircle,
  Settings,
  LogOut,
  ArrowUpRight,
  Heart,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./public-shell";
import { ThemeToggle } from "./theme";
import { Tasks, tasksQuery, TaskEditor } from "./tasks";
import { Appointments, appointmentsQuery } from "./appointments";
import { AdminServices } from "./admin-services";
import { Assistant } from "./assistant";
import { today } from "@/lib/business";
import { BusinessInformationEditor, useBusinessInformation } from "./business-information";
const items = [
  ["overview", "Overview", LayoutDashboard],
  ["appointments", "Appointments", CalendarDays],
  ["services", "Services & Prices", Scissors],
  ["tasks", "My Business Tasks", ListChecks],
  ["assistant", "AI Assistant", Sparkles],
  ["enquiries", "Customer Enquiries", MessageCircle],
  ["settings", "Settings", Settings],
] as const;
export function Dashboard() {
  const { details } = useBusinessInformation();
  const [tab, setTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [add, setAdd] = useState(false);
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data: owner, isPending } = useQuery({
    queryKey: ["owner"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_owner");
      if (error) throw error;
      return data;
    },
  });
  const { data: tasks = [] } = useQuery({ ...tasksQuery, enabled: owner === true });
  const { data: appointments = [] } = useQuery({ ...appointmentsQuery, enabled: owner === true });
  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }
  if (isPending) return <main className="wrap section">Opening your business space…</main>;
  if (!owner)
    return (
      <main className="wrap section">
        <Brand />
        <h1 className="script text-4xl mt-8">This space is owner-only</h1>
        <p>The verified owner account is required to manage appointments and tasks.</p>
        <Button onClick={logout}>Sign out and switch account</Button>
      </main>
    );
  const pending = tasks.filter((t) => t.status !== "Completed").length;
  const completed = tasks.length - pending;
  const day = appointments.filter(
    (a) => a.appointment_date === today() && a.status !== "Cancelled",
  );
  const monthly = appointments.filter(
    (a) => a.appointment_date.slice(0, 7) === today().slice(0, 7) && a.status !== "Cancelled",
  ).length;
  return (
    <div className="flex min-h-screen">
      <aside className={`dashboard-sidebar ${collapsed ? "w-18!" : ""}`}>
        <div className={collapsed ? "hidden" : "sidebar-brand"}>
          <Link to="/">
            <Brand />
          </Link>
          <div className="eyebrow text-muted-foreground mt-5 mb-10">My business space</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mb-5"
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
        <nav>
          {items.map(([id, label, Icon]) => (
            <Button
              key={id}
              className="nav-item"
              variant={tab === id ? "secondary" : "ghost"}
              title={label}
              onClick={() => setTab(id)}
            >
              <Icon />
              {!collapsed && <span className="nav-label text-xs">{label}</span>}
            </Button>
          ))}
        </nav>
        <div className="mt-14 sidebar-foot">
          <p className="script text-3xl text-rose">Good hair, good mood ♡</p>
          <Button asChild variant="link" className="px-0">
            <Link to="/">
              View website <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <Button variant="ghost" className="nav-item mt-8" title="Sign out" onClick={logout}>
          <LogOut />
          {!collapsed && <span className="nav-label">Sign Out</span>}
        </Button>
      </aside>
      <main className="dashboard-main">
        <header className="flex justify-between items-center border-b pb-6 mb-7">
          <div className="text-xs text-muted-foreground">
            My Business <span className="mx-2">/</span>
            <span className="text-foreground">{items.find((i) => i[0] === tab)?.[1]}</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="flex items-center justify-center size-9 rounded-full bg-secondary text-primary text-sm font-semibold">
              {details.business_name ? details.business_name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("") : <Heart className="size-4" />}
            </span>
          </div>
        </header>
        {tab === "overview" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <div className="eyebrow text-rose mb-3">A beautiful day to build your business</div>
                <h1 className="script text-5xl mb-2">Hello, {details.owner_name || "beautiful"} ♡</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-ZA", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  · Let's make today a good hair day.
                </p>
              </div>
              <Button onClick={() => setAdd(true)}>
                <Plus />
                Add Task
              </Button>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {(
                [
                  [CalendarDays, "Today's appointments", day.length],
                  [ListChecks, "Pending tasks", pending],
                  [Heart, "Completed tasks", completed],
                  [Scissors, "Appointments this month", monthly],
                ] as const
              ).map(([Icon, label, value]) => (
                <div className="stat" key={String(label)}>
                  {typeof Icon !== "string" && typeof Icon !== "number" && (
                    <Icon className="size-5 text-rose mb-4" />
                  )}
                  <span className="text-xs text-muted-foreground">{String(label)}</span>
                  <strong>{Number(value)}</strong>
                </div>
              ))}
            </div>
            <div className="grid xl:grid-cols-2 gap-8">
              <section className="min-w-0">
                <Appointments compact />
              </section>
              <section className="min-w-0">
                <Tasks compact />
              </section>
            </div>
            <section className="bg-secondary p-6 rounded-lg mt-8 flex flex-wrap justify-between gap-4 items-center">
              <div>
                <h2 className="script text-3xl mb-1">A little less admin. A little more you.</h2>
                <p className="text-xs text-muted-foreground mb-0">
                  Your business, one thoughtful step at a time.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setTab("appointments")}>
                  <CalendarDays />
                  Create Booking
                </Button>
                <Button variant="outline" onClick={() => setTab("services")}>
                  <Scissors />
                  Update a Service
                </Button>
                <Button onClick={() => setTab("assistant")}>
                  <Sparkles />
                  Open Assistant
                </Button>
              </div>
            </section>
          </>
        ) : tab === "tasks" ? (
          <Tasks />
        ) : tab === "appointments" ? (
          <Appointments />
        ) : tab === "services" ? (
          <AdminServices />
        ) : tab === "assistant" ? (
          <Assistant />
        ) : tab === "enquiries" ? (
          <Appointments enquiries />
        ) : (
          <SettingsView />
        )}
        {add && <TaskEditor task={null} onClose={() => setAdd(false)} />}
      </main>
    </div>
  );
}
function SettingsView() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  return (
    <section className="max-w-lg">
      <h2 className="script text-4xl">Settings</h2>
      <div className="flex justify-between items-center border-b py-5">
        <div>
          <strong className="text-sm">Appearance</strong>
          <p className="text-sm text-muted-foreground mb-0">Light or dark, make it yours.</p>
        </div>
        <ThemeToggle />
      </div>
      <BusinessInformationEditor />
      <form
        className="space-y-4 mt-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await supabase.auth.updateUser({ password, current_password: current });
          if (error) alert(error.message);
          else {
            alert("Password updated");
            setCurrent("");
            setPassword("");
          }
        }}
      >
        <h3 className="text-sm">Change password</h3>
        <label className="field">
          Current password
          <input
            required
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>
        <label className="field">
          New password
          <input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <Button>Update Password</Button>
      </form>
    </section>
  );
}
