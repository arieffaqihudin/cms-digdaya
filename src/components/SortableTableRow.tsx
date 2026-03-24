import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableTableRowProps {
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableRow({ id, disabled, children, className }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? "relative" as const : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-border/30 hover:bg-accent/30 transition-colors duration-150",
        isDragging && "bg-accent/50 shadow-md opacity-90",
        className
      )}
    >
      <td className="px-2 py-4 w-8">
        {!disabled ? (
          <button
            {...attributes}
            {...listeners}
            className="flex items-center justify-center h-6 w-6 rounded cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            tabIndex={-1}
          >
            <GripVertical className="h-4 w-4" strokeWidth={1.5} />
          </button>
        ) : (
          <div className="h-6 w-6" />
        )}
      </td>
      {children}
    </tr>
  );
}

interface SortableMobileCardProps {
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SortableMobileCard({ id, disabled, children, className }: SortableMobileCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? "relative" as const : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 hover:bg-accent/30 transition-colors",
        isDragging && "bg-accent/50 shadow-md opacity-90",
        className
      )}
    >
      <div className="flex items-start gap-2">
        {!disabled ? (
          <button
            {...attributes}
            {...listeners}
            className="flex items-center justify-center h-6 w-6 rounded cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors shrink-0 mt-0.5"
            tabIndex={-1}
          >
            <GripVertical className="h-4 w-4" strokeWidth={1.5} />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
