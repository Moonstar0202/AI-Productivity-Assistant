import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksQuery } from "./tasks";
import { Button } from "@/components/ui/button";
import { CalendarCheck, MessageCircle, NotebookPen, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
export function Assistant() {
  const [mode, setMode] = useState("plan");
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [tone, setTone] = useState("Warm");
  const [kind, setKind] = useState("Reminder");
  const [applied, setApplied] = useState(false);
  const qc = useQueryClient();
  const { data: tasks = [] } = useQuery(tasksQuery);
  function generate() {
    setApplied(false);
    if (mode === "plan") {
      setOutput(
        tasks
          .filter((t) => t.status !== "Completed")
          .sort(
            (a, b) =>
              (a.due_date || "9999").localeCompare(b.due_date || "9999") ||
              ["High", "Medium", "Low"].indexOf(a.priority) -
                ["High", "Medium", "Low"].indexOf(b.priority),
          )
          .map(
            (t, i) =>
              `${i + 1}. ${t.title}${t.due_date ? " — due " + t.due_date : ""} (${t.priority})`,
          )
          .join("\n") || "No pending tasks.",
      );
    } else if (mode === "message") {
      setOutput(
        `${tone === "Friendly" ? "Hey there! ♡" : tone === "Professional" ? "Hello," : "Hi lovely!"}\n\n${kind === "Confirmation" ? "Please review the appointment details below before confirming." : kind === "Reminder" ? "A gentle reminder about your braiding appointment." : kind === "Reschedule" ? "Could we arrange a new time for your appointment?" : kind === "Cancellation" ? "I’m sorry that we need to cancel this appointment." : "Just checking in about your braiding request."}\n\n${text || "[Add the agreed service, date and time here]"}\n\n${tone === "Professional" ? "Kind regards," : "With care, ♡"}\nBraiding By Me`,
      );
    } else {
      const lines = text
        .split(/[\n.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      setOutput(
        lines.length
          ? "Key points\n" +
              lines.map((s) => "• " + s).join("\n") +
              "\n\nDecisions: review your notes for agreed decisions.\nFollow-up: select an action from your notes before adding a task."
          : "Enter your notes first.",
      );
    }
  }
  return (
    <>
      <div className="eyebrow text-rose">A little help for your busy day</div>
      <h2 className="script text-4xl mt-3">AI Productivity Assistant</h2>
      <p className="notice mb-7">
        AI isn't connected yet. These working tools use task sorting and editable message templates,
        not AI generation. Nothing is sent automatically.
      </p>
      <div className="grid sm:grid-cols-3 gap-3 mb-7">
        {(
          [
            ["plan", "Task Planner", CalendarCheck],
            ["message", "Client Messages", MessageCircle],
            ["notes", "Business Notes", NotebookPen],
          ] as const
        ).map(([id, label, Icon]) => (
          <Button
            key={String(id)}
            variant={mode === id ? "default" : "outline"}
            onClick={() => {
              setMode(String(id));
              setOutput("");
            }}
          >
            {typeof Icon !== "string" && <Icon />}
            {String(label)}
          </Button>
        ))}
      </div>
      {mode === "message" && (
        <div className="grid grid-cols-2 gap-4 mb-5">
          <label className="field">
            Message type
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              {["Confirmation", "Reminder", "Reschedule", "Cancellation", "Follow-up"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Tone
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              {["Friendly", "Professional", "Warm"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      {mode !== "plan" && (
        <label className="field mb-5">
          {mode === "message"
            ? "Appointment details (only facts you provide)"
            : "Your business notes"}
          <textarea
            maxLength={4000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
        </label>
      )}
      <Button onClick={generate}>
        <Sparkles />
        {mode === "plan"
          ? "Organise Pending Tasks"
          : mode === "message"
            ? "Create Message Draft"
            : "Organise Notes"}
      </Button>
      {output && (
        <div className="mt-7">
          <label className="field">
            Template-based draft — review and edit
            <textarea
              className="min-h-60!"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </label>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(output);
                  toast.success("Copied");
                } catch {
                  toast.error("Copy is unavailable. Select the draft to copy it.");
                }
              }}
            >
              <Copy />
              Copy Draft
            </Button>
            {mode === "plan" && (
              <Button
                disabled={applied}
                onClick={async () => {
                  const { error } = await supabase
                    .from("tasks")
                    .insert({
                      title: "Reviewed daily plan",
                      description: output.slice(0, 2000),
                      category: "Personal Tasks",
                    });
                  if (error) toast.error(error.message);
                  else {
                    setApplied(true);
                    qc.invalidateQueries({ queryKey: ["tasks"] });
                    toast.success("Reviewed plan saved as a task");
                  }
                }}
              >
                <Check />
                {applied ? "Saved" : "Save Reviewed Plan"}
              </Button>
            )}
            {mode === "notes" && (
              <Button
                disabled={applied || !text.trim()}
                onClick={async () => {
                  const title = window.prompt("Which follow-up task should be added?", "");
                  if (!title?.trim()) return;
                  const { error } = await supabase
                    .from("tasks")
                    .insert({
                      title: title.trim().slice(0, 150),
                      description: output.slice(0, 2000),
                      category: "Personal Tasks",
                    });
                  if (error) toast.error(error.message);
                  else {
                    setApplied(true);
                    qc.invalidateQueries({ queryKey: ["tasks"] });
                    toast.success("Follow-up task saved");
                  }
                }}
              >
                Add Reviewed Follow-up
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
