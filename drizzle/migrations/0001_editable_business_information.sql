CREATE TABLE public.business_settings (
 id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
 business_name text NOT NULL DEFAULT '',
 owner_name text NOT NULL DEFAULT '',
 phone text NOT NULL DEFAULT '',
 whatsapp_number text NOT NULL DEFAULT '',
 email text NOT NULL DEFAULT '',
 location text NOT NULL DEFAULT '',
 house_calls boolean DEFAULT NULL,
 house_call_fee text NOT NULL DEFAULT '',
 business_hours text NOT NULL DEFAULT '',
 instagram_url text NOT NULL DEFAULT '',
 facebook_url text NOT NULL DEFAULT ''
);
GRANT SELECT ON public.business_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.business_settings TO authenticated;
GRANT ALL ON public.business_settings TO service_role;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public business details" ON public.business_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Owner inserts business details" ON public.business_settings FOR INSERT TO authenticated WITH CHECK (public.is_owner());
CREATE POLICY "Owner updates business details" ON public.business_settings FOR UPDATE TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());
COMMENT ON TABLE public.business_settings IS 'Public business contact information only. Public email is independent of owner authentication and never grants access.';