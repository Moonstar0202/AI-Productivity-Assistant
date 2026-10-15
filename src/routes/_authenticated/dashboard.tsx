import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/brand/dashboard";
import { meta } from "@/lib/business";
export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () =>
    meta(
      "My Business Dashboard",
      "Private appointments, tasks, services and productivity tools for your braiding business.",
    ),
  component: Dashboard,
});
