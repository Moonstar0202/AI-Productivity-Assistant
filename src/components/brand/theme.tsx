import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update=()=>setDark(document.documentElement.classList.contains('dark'));
    window.addEventListener('braiding-theme-change',update);
    try {
      const d = localStorage.getItem("braiding-theme") === "dark";
      setDark(d);
      document.documentElement.classList.toggle("dark", d);
    } catch {}
    return ()=>window.removeEventListener('braiding-theme-change',update);
  }, []);
  return (
    <Button
      variant="ghost"
      size="icon"
      title={dark ? "Use light mode" : "Use dark mode"}
      aria-label={dark ? "Use light mode" : "Use dark mode"}
      onClick={() => {
        const d = !dark;
        setDark(d);
        document.documentElement.classList.toggle("dark", d);
        window.dispatchEvent(new Event('braiding-theme-change'));
        try {
          localStorage.setItem("braiding-theme", d ? "dark" : "light");
        } catch {}
      }}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
