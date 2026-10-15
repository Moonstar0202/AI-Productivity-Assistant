import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { bookingSchema } from "@/lib/business";
import { useBusinessInformation, WhatsAppButton } from "./business-information";
import { houseCallDescription } from "@/lib/business-settings";
import { servicesQuery } from "./services";
import { DatePicker } from "./date-picker";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";
export function BookingForm({
  style = "",
  existing,
  onSaved,
}: {
  style?: string;
  existing?: Database["public"]["Tables"]["appointments"]["Row"] | undefined;
  onSaved?: () => void;
}) {
  const { details } = useBusinessInformation();
  const { data: services } = useQuery(servicesQuery);
  const qc = useQueryClient();
  const [form, setForm] = useState({
    customer_name: existing?.customer_name || "",
    phone: existing?.phone || "",
    service_id: existing?.service_id || style,
    appointment_date: existing?.appointment_date || "",
    appointment_time: existing?.appointment_time?.slice(0, 5) || "",
    hair_length: existing?.hair_length || "Normal",
    requirements: existing?.requirements || "",
    notes: existing?.notes || "",
    house_call: existing?.house_call || false,
  });
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const message = `Hi ${details.business_name || "there"}! I'd like ${services?.find((s) => s.id === form.service_id)?.name || "a braiding appointment"} on ${form.appointment_date || "[date]"} at ${form.appointment_time || "[time]"}. Hair length: ${form.hair_length}. ${form.house_call ? "House call requested." : ""} ${id ? "Request reference: " + id.slice(0, 8) : ""}`;
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = bookingSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Please check your details");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (existing) {
        const { error } = await supabase
          .from("appointments")
          .update(parsed.data)
          .eq("id", existing.id);
        if (error) throw error;
        toast.success("Appointment saved");
        onSaved?.();
      } else {
        const f = parsed.data;
        const { data, error } = await supabase.rpc("request_booking", {
          p_name: f.customer_name,
          p_phone: f.phone,
          p_service: f.service_id,
          p_date: f.appointment_date,
          p_time: f.appointment_time,
          p_length: f.hair_length,
          p_requirements: f.requirements,
          p_notes: f.notes,
          p_house: f.house_call,
        });
        if (error) throw error;
        setId(data);
        onSaved?.();
      }
      qc.invalidateQueries({ queryKey: ["appointments"] });
    } catch (e) {
      setError(e && typeof e === 'object' && 'message' in e ? String(e.message) : "Unable to save the request. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  if (id)
    return (
      <div className="text-center py-8">
        <CheckCircle className="size-12 text-primary mx-auto mb-5" />
        <h2 className="script text-4xl">Your request is saved ♡</h2>
        <p className="text-sm leading-7">
          Status: Pending. This is not yet a confirmed appointment.
          <br />
          We'll discuss availability and any additional charges with you.
        </p>
        <p className="text-xs text-muted-foreground">Reference: {id.slice(0, 8)}</p>
        <WhatsAppButton message={message}>Follow up on WhatsApp</WhatsAppButton>
      </div>
    );
  return (
    <form onSubmit={save} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="field">
          Your name
          <input
            required
            maxLength={100}
            value={form.customer_name}
            onChange={(e) => set("customer_name", e.target.value)}
          />
        </label>
        <label className="field">
          Contact number
          <input
            required
            type="tel"
            placeholder="Your contact number"
            maxLength={16}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </label>
      </div>
      <label className="field">
        Your hairstyle
        <select
          required
          value={form.service_id}
          onChange={(e) => set("service_id", e.target.value)}
        >
          <option value="">Choose your style</option>
          {services?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — R{s.price}
            </option>
          ))}
        </select>
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="field">
          Preferred date
          <DatePicker
            future
            value={form.appointment_date}
            onChange={(v) => set("appointment_date", v)}
          />
        </div>
        <label className="field">
          Preferred time
          <input
            required
            type="time"
            value={form.appointment_time}
            onChange={(e) => set("appointment_time", e.target.value)}
          />
        </label>
      </div>
      <label className="field">
        Hair length
        <select value={form.hair_length} onChange={(e) => set("hair_length", e.target.value)}>
          {["Short", "Normal", "Extra long"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={form.house_call}
          onChange={(e) => set("house_call", e.target.checked)}
        />
        House call request — {houseCallDescription(details)}
      </label>
      <label className="field">
        Additional requirements
        <input
          maxLength={2000}
          value={form.requirements}
          onChange={(e) => set("requirements", e.target.value)}
          placeholder="Hair colour, extensions, accessibility…"
        />
      </label>
      <label className="field">
        Notes (optional)
        <textarea
          maxLength={2000}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </label>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Extra lengths may incur additional charges. Your details are kept private.
      </p>
      <Button disabled={saving} type="submit" className="w-full">
        {saving ? "Saving…" : existing ? "Save Appointment" : "Save Booking Request"}
      </Button>
      <WhatsAppButton message={message} variant="outline" className="w-full">Request via WhatsApp instead</WhatsAppButton>
    </form>
  );
}
