import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { businessSettingsSchema, emptyBusinessSettings, whatsappLink, type BusinessSettings } from "@/lib/business-settings";

export const businessSettingsQuery = {
  queryKey: ["business-settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("business_settings").select("*").eq("id", true).maybeSingle();
    if (error) throw error;
    return data ? businessSettingsSchema.parse(data) : emptyBusinessSettings;
  },
};
export function useBusinessInformation() {
  const query = useQuery(businessSettingsQuery);
  return { ...query, details: query.data ?? emptyBusinessSettings, name: query.data?.business_name || "Business name coming soon" };
}
export function WhatsAppButton({ message, children, variant = "default", className }: {
  message: string; children: React.ReactNode; variant?: "default" | "outline"; className?: string;
}) {
  const { details } = useBusinessInformation();
  const href = whatsappLink(details.whatsapp_number, message);
  if (!href) return <Button disabled variant={variant} className={className} title="WhatsApp number not provided"><MessageCircle />WhatsApp unavailable</Button>;
  return <Button asChild variant={variant} className={className}><a href={href} target="_blank" rel="noreferrer"><MessageCircle />{children}</a></Button>;
}
export function BusinessInformationEditor() {
  const { data, isPending, error, refetch } = useQuery(businessSettingsQuery);
  if (isPending) return <p>Loading business information…</p>;
  if (error) return <div role="alert"><p>Unable to load business information.</p><Button variant="outline" onClick={() => refetch()}>Try again</Button></div>;
  return <BusinessInformationForm initial={data ?? emptyBusinessSettings} />;
}
function BusinessInformationForm({ initial }: { initial: BusinessSettings }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const qc = useQueryClient();
  const fields = [
    ["business_name", "Business name", "text"], ["owner_name", "Owner's name", "text"],
    ["phone", "Business phone number", "tel"], ["whatsapp_number", "WhatsApp number", "tel"],
    ["email", "Business email", "email"], ["location", "Business location", "text"],
    ["house_call_fee", "House-call fee", "text"], ["instagram_url", "Instagram link", "url"], ["facebook_url", "Facebook link", "url"],
  ] as const;
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const parsed = businessSettingsSchema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message || "Check your details"); return; }
    setSaving(true); setError("");
    try {
      const { data, error } = await supabase.from("business_settings").upsert({ id: true, ...parsed.data }).select("*").single();
      if (error) throw error;
      const saved = businessSettingsSchema.parse(data);
      setForm(saved); qc.setQueryData(businessSettingsQuery.queryKey, saved);
      await qc.invalidateQueries({ queryKey: businessSettingsQuery.queryKey });
      toast.success("Business information saved");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save business information. Please try again."); }
    finally { setSaving(false); }
  }
  return <form onSubmit={save} className="space-y-4 py-6 border-b">
    <h3 className="text-sm font-semibold">Business information</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map(([key, label, type]) => <label className="field min-w-0" key={key}>{label}<input type={type} maxLength={key === "location" ? 500 : 150} value={form[key]} placeholder="Not provided" onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></label>)}
      <label className="field">House calls<select value={form.house_calls === null ? "" : String(form.house_calls)} onChange={(e) => setForm({ ...form, house_calls: e.target.value === "" ? null : e.target.value === "true" })}><option value="">Not provided</option><option value="true">Yes</option><option value="false">No</option></select></label>
    </div>
    <label className="field">Business hours<textarea maxLength={1000} value={form.business_hours} placeholder="Not provided" onChange={(e) => setForm({ ...form, business_hours: e.target.value })} /></label>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button disabled={saving} type="submit"><Save />{saving ? "Saving…" : "Save Business Information"}</Button>
  </form>;
}