import { z } from "zod";

const contactNumber = z.string().trim().refine(
  (value) => !value || /^\+?[\d\s()-]+$/.test(value) && /^\d{10,15}$/.test(value.replace(/\D/g, "")),
  "Enter 10–15 digits, with an optional country code",
);
const socialUrl = z.string().trim().refine(
  (value) => !value || /^https:\/\//i.test(value) && z.string().url().safeParse(value).success,
  "Enter a full https:// link or leave blank",
);
export const businessSettingsSchema = z.object({
  business_name: z.string().trim().max(150),
  owner_name: z.string().trim().max(150),
  phone: contactNumber,
  whatsapp_number: contactNumber,
  email: z.string().trim().refine((v) => !v || z.string().email().safeParse(v).success, "Enter a valid email or leave blank"),
  location: z.string().trim().max(500),
  house_calls: z.boolean().nullable(),
  house_call_fee: z.string().trim().max(150),
  business_hours: z.string().trim().max(1000),
  instagram_url: socialUrl,
  facebook_url: socialUrl,
});
export type BusinessSettings = z.infer<typeof businessSettingsSchema>;
export const emptyBusinessSettings: BusinessSettings = {
  business_name: "", owner_name: "", phone: "", whatsapp_number: "", email: "", location: "",
  house_calls: null, house_call_fee: "", business_hours: "", instagram_url: "", facebook_url: "",
};
export function whatsappLink(number: string, message: string) {
  if (!number.trim()) return undefined;
  let digits = number.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) digits = `27${digits.slice(1)}`;
  if (!/^[1-9]\d{9,14}$/.test(digits)) return undefined;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message.slice(0, 4000))}`;
}
export function houseCallDescription(settings: BusinessSettings) {
  if (settings.house_calls === null) return "House-call availability to be confirmed.";
  if (!settings.house_calls) return "House calls are not available.";
  return settings.house_call_fee ? `House calls available — ${settings.house_call_fee}.` : "House calls available — fee to be confirmed.";
}