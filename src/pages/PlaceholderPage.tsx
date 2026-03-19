import { Construction } from "lucide-react";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Construction className="h-12 w-12 mb-4 text-border" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm mt-1">This section is under development.</p>
    </div>
  );
}
