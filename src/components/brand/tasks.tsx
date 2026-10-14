import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { categories, taskSchema, overdue } from "@/lib/business";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DatePicker } from "./date-picker";
import { Plus, Search, Pencil, Trash2, ListChecks } from "lucide-react";
import { toast } from "sonner";
type Task = Database["public"]["Tables"]["tasks"]["Row"];
export const tasksQuery = {
  queryKey: ["tasks"],
  queryFn: async () => {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at");
    if (error) throw error;
    return data;
  },
};
export function TaskEditor({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    category: task?.category || categories[0],
    due_date: task?.due_date || "",
    priority: task?.priority || "Medium",
    status: task?.status || "Pending",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add a Task"}</DialogTitle>
        </DialogHeader>
        <form
          className="modal-body space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const p = taskSchema.safeParse({ ...form, due_date: form.due_date || null });
            if (!p.success) {
              toast.error(p.error.issues[0]?.message);
              return;
            }
            setBusy(true);
            const result = task
              ? await supabase.from("tasks").update(p.data).eq("id", task.id)
              : await supabase.from("tasks").insert(p.data);
            setBusy(false);
            if (result.error) {
              toast.error(result.error.message);
              return;
            }
            qc.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Task saved");
            onClose();
          }}
        >
          <label className="field">
            Task title
            <input
              autoFocus
              required
              maxLength={150}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>
          <label className="field">
            Description
            <textarea
              maxLength={2000}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="field">
            Category
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="field">
            Due date
            <DatePicker value={form.due_date} onChange={(v) => set("due_date", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="field">
              Priority
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                {["High", "Medium", "Low"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label className="field">
              Status
              <select value={form.status} onChange={(e) => set("status", e.target.value)}>
                {["Pending", "In Progress", "Completed"].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
          </div>
          <Button disabled={busy} className="w-full">
            {busy ? "Saving…" : "Save Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function Tasks({ compact = false }: { compact?: boolean }) {
  const { data: tasks = [], error, isPending } = useQuery(tasksQuery);
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Task | null | undefined>();
  const [remove, setRemove] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("due");
  const counts = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status !== "Completed").length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    overdue: tasks.filter(overdue).length,
  };
  const rows = tasks
    .filter(
      (t) =>
        (!compact || t.status !== "Completed") &&
        t.title.toLowerCase().includes(search.toLowerCase()) &&
        (status === "All" || t.status === status) &&
        (category === "All" || t.category === category),
    )
    .sort((a, b) =>
      sort === "priority"
        ? ["High", "Medium", "Low"].indexOf(a.priority) -
          ["High", "Medium", "Low"].indexOf(b.priority)
        : sort === "created"
          ? b.created_at.localeCompare(a.created_at)
          : (a.due_date || "9999").localeCompare(b.due_date || "9999"),
    );
  const pct = Math.round((counts.completed / (counts.total || 1)) * 100);
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className={compact ? "text-lg font-semibold mb-0" : "script text-4xl mb-0"}>
          {compact ? "Your to-do list" : "My Business Tasks"}
        </h2>
        <Button onClick={() => setEdit(null)}>
          <Plus />
          Add Task
        </Button>
      </div>
      {!compact && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {Object.entries(counts).map(([k, v]) => (
              <div key={k} className="stat">
                <span className="capitalize text-sm text-muted-foreground">{k} tasks</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <div className="mb-7">
            <p className="text-sm flex justify-between">
              Your progress <strong>{pct}% completed</strong>
            </p>
            <div className="progress-track">
              <progress value={pct} max={100} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
            <label className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <input
                aria-label="Search tasks"
                className="control pl-9!"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter task status"
              className="control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {["All", "Pending", "In Progress", "Completed"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select
              className="control"
              aria-label="Filter task category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
            <select
              className="control"
              aria-label="Sort tasks"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="due">Due date</option>
              <option value="priority">Priority</option>
              <option value="created">Creation date</option>
            </select>
          </div>
        </>
      )}
      {isPending ? (
        <p>Loading tasks…</p>
      ) : error ? (
        <p role="alert">Unable to load tasks.</p>
      ) : rows.length === 0 ? (
        <div className="py-12 text-center">
          <ListChecks className="size-10 mx-auto text-rose mb-4" />
          <h3>Nothing on your list</h3>
          <p className="text-sm text-muted-foreground">
            A little breathing room for your next good hair day.
          </p>
        </div>
      ) : (
        <div>
          {(compact ? rows.slice(0, 4) : rows).map((t) => (
            <div className={`task-row ${t.status === "Completed" ? "task-done" : ""}`} key={t.id}>
              <input
                type="checkbox"
                className="size-4 accent-primary"
                aria-label={`Complete ${t.title}`}
                checked={t.status === "Completed"}
                onChange={async (e) => {
                  const { error } = await supabase
                    .from("tasks")
                    .update({ status: e.target.checked ? "Completed" : "Pending" })
                    .eq("id", t.id);
                  if (error) toast.error(error.message);
                  else qc.invalidateQueries({ queryKey: ["tasks"] });
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="task-title text-sm font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-2">
                  <span>{t.category}</span>
                  {t.due_date && (
                    <span className={overdue(t) ? "text-destructive" : ""}>
                      {overdue(t) ? "Overdue · " : ""}
                      {t.due_date}
                    </span>
                  )}
                  {t.sample && <span className="text-rose">Example task</span>}
                </div>
              </div>
              <span className="pill hidden sm:block">{t.priority}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${t.title}`}
                onClick={() => setEdit(t)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete ${t.title}`}
                onClick={() => setRemove(t)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
      {edit !== undefined && <TaskEditor task={edit} onClose={() => setEdit(undefined)} />}
      <Dialog open={!!remove} onOpenChange={() => setRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this task?</DialogTitle>
          </DialogHeader>
          <p>{remove?.title}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setRemove(null)}>
              Keep Task
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!remove) return;
                const { error } = await supabase.from("tasks").delete().eq("id", remove.id);
                if (error) toast.error(error.message);
                else {
                  setRemove(null);
                  qc.invalidateQueries({ queryKey: ["tasks"] });
                  toast.success("Task deleted");
                }
              }}
            >
              Delete Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
