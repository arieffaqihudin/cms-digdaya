import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={toggleTheme}
      title={theme === "dark" ? "Mode terang" : "Mode gelap"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
      )}
    </Button>
  );
}
