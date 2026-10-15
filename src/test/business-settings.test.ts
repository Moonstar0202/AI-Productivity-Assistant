import { describe, expect, it } from "vitest";
import { businessSettingsSchema, emptyBusinessSettings, whatsappLink } from "@/lib/business-settings";

describe("Business information", () => {
  it("leaves unspecified details empty rather than using the old contacts", () => {
    expect(businessSettingsSchema.parse(emptyBusinessSettings)).toEqual({
      business_name: "", owner_name: "", phone: "", whatsapp_number: "", email: "", location: "",
      house_calls: null, house_call_fee: "", business_hours: "", instagram_url: "", facebook_url: "",
    });
  });
  it("does not open a chat when no WhatsApp number is supplied", () => {
    expect(whatsappLink("", "Booking request")).toBeUndefined();
  });
  it("opens the supplied WhatsApp number, not a fixed business number", () => {
    expect(whatsappLink("+27 82 123 4567", "Hi & hello")).toBe("https://wa.me/27821234567?text=Hi%20%26%20hello");
    expect(whatsappLink("+44 7700 900123", "Hi")).toBe("https://wa.me/447700900123?text=Hi");
  });
  it("normalises local South African numbers and rejects invalid destinations", () => {
    expect(whatsappLink("082 123 4567", "Hi")).toBe("https://wa.me/27821234567?text=Hi");
    expect(whatsappLink("123", "Hi")).toBeUndefined();
  });
  it("rejects unsafe social links while accepting blank links", () => {
    expect(businessSettingsSchema.safeParse({ ...emptyBusinessSettings, instagram_url: "javascript:alert(1)" }).success).toBe(false);
    expect(businessSettingsSchema.safeParse({ ...emptyBusinessSettings, instagram_url: "https://www.instagram.com/example" }).success).toBe(true);
  });
});