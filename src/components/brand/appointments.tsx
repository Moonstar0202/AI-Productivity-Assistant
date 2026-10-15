import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { servicesQuery } from "./services";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { BookingForm } from "./booking-form";
import { Plus, Pencil, CalendarDays, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { today } from "@/lib/business";
import type { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";
type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export const appointmentsQuery = {
  queryKey: ["appointments"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date")
      .order("appointment_time");
    if (error) throw error;
    return data;
  },
};
export function Appointments({
  compact = false,
  enquiries = false,
}: {
  compact?: boolean;
  enquiries?: boolean;
}) {
  const { data: all = [], isPending, error } = useQuery(appointmentsQuery);
  const { data: services = [] } = useQuery(servicesQuery);
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Appointment | null | undefined>();
  const [calendar, setCalendar] = useState(false);
  const [date, setDate] = useState<Date>();
  const [remove, setRemove] = useState<Appointment | null>(null);
  let rows = all.filter(
    (a) => !compact || (a.appointment_date >= today() && a.status !== "Cancelled"),
  );
  if (enquiries) rows = rows.filter((a) => a.status === "Pending");
  if (date && calendar)
    rows = rows.filter((a) => a.appointment_date === format(date, "yyyy-MM-dd"));
  return (
    <>
      <div className="flex justify-between items-center mb-6 gap-3">
        <h2 className="text-lg font-semibold mb-0">
          {enquiries
            ? "Customer booking enquiries"
            : compact
              ? "Upcoming appointments"
              : "Appointments"}
        </h2>
        <div className="flex gap-2">
          {!compact && (
            <Button
              variant="outline"
              size="icon"
              title="Toggle calendar"
              onClick={() => setCalendar(!calendar)}
            >
              <CalendarDays />
            </Button>
          )}
          <Button onClick={() => setEdit(null)}>
            <Plus />
            <span className="hidden sm:inline">New Booking</span>
          </Button>
        </div>
      </div>
      {calendar && (
        <div className="mb-5 flex flex-wrap gap-5 items-start">
          <Calendar
            className="pointer-events-auto"
            mode="single"
            selected={date}
            onSelect={setDate}
          />
          <Button variant="link" onClick={() => setDate(undefined)}>
            Show all dates
          </Button>
        </div>
      )}
      {isPending ? (
        <p>Loading appointments…</p>
      ) : error ? (
        <p>Unable to load bookings.</p>
      ) : rows.length === 0 ? (
        <div className="text-center py-12">
          <CalendarDays className="mx-auto text-rose size-10 mb-4" />
          <h3>No appointments yet</h3>
          <p className="text-muted-foreground text-sm">Your next beautiful style starts here.</p>
        </div>
      ) : (
        <div>
          {(compact ? rows.slice(0, 4) : rows).map((a) => (
            <article className="task-row" key={a.id}>
              <div className="hidden sm:block text-center bg-secondary rounded-md p-3 text-xs w-18 shrink-0">
                <strong className="block text-lg">{a.appointment_date.slice(8)}</strong>
                {new Date(a.appointment_date + "T12:00:00").toLocaleDateString("en-ZA", {
                  month: "short",
                })}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold mb-1">{a.customer_name}</h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {services.find((s) => s.id === a.service_id)?.name || "Braiding service"}
                </p>
                <p className="text-xs mb-0">
                  {a.appointment_date} · {a.appointment_time.slice(0, 5)} · {a.phone}
                </p>
              </div>
              {compact ? (
                <span className="pill">{a.status}</span>
              ) : (
                <div className="flex flex-wrap justify-end gap-1 max-w-40">
                  <select
                    className="control text-xs! p-2!"
                    aria-label={`Status for ${a.customer_name}`}
                    value={a.status}
                    onChange={async (e) => {
                      const { error } = await supabase
                        .from("appointments")
                        .update({ status: e.target.value })
                        .eq("id", a.id);
                      if (error) toast.error(error.message);
                      else {
                        toast.success("Status updated");
                        qc.invalidateQueries({ queryKey: ["appointments"] });
                      }
                    }}
                  >
                    {["Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit appointment for ${a.customer_name}`}
                    onClick={() => setEdit(a)}
                  >
                    <Pencil />
                  </Button>
                  <Button asChild size="icon" variant="ghost">
                    <a
                      title="Contact customer"
                      href={`https://wa.me/${a.phone.startsWith("0") ? "27" + a.phone.slice(1) : a.phone.replace("+", "")}?text=${encodeURIComponent(`Hi ${a.customer_name}, regarding your braiding request for ${a.appointment_date} at ${a.appointment_time.slice(0, 5)}…`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle />
                    </a>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete appointment for ${a.customer_name}`}
                    onClick={() => setRemove(a)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {edit !== undefined && (
        <Dialog
          open
          onOpenChange={(v) => {
            if (!v) setEdit(undefined);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {edit ? "Edit / Reschedule Appointment" : "Create Booking Request"}
              </DialogTitle>
            </DialogHeader>
            <div className="modal-body">
              <BookingForm existing={edit || undefined} onSaved={() => setEdit(undefined)} />
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={!!remove} onOpenChange={() => setRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this appointment?</DialogTitle>
          </DialogHeader>
          <p>This permanently removes {remove?.customer_name}'s booking.</p>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!remove) return;
              const { error } = await supabase.from("appointments").delete().eq("id", remove.id);
              if (error) toast.error(error.message);
              else {
                setRemove(null);
                qc.invalidateQueries({ queryKey: ["appointments"] });
              }
            }}
          >
            Delete Appointment
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
