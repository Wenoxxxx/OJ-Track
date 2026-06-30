import { Plus, Archive } from "lucide-react";

interface ClientsToolbarActionsProps {
  showArchived: boolean;
  archivedCount: number;
  onToggleArchived: () => void;
  onNewProject: () => void;
}

export function ClientsToolbarActions({
  showArchived,
  archivedCount,
  onToggleArchived,
  onNewProject,
}: ClientsToolbarActionsProps) {
  return (
    <div className="flex gap-2 sm:ml-auto flex-shrink-0">
      <button
        onClick={onToggleArchived}
        className={`
          flex items-center gap-1.5 px-3 py-2 text-xs border font-medium transition-colors
          ${showArchived
            ? "bg-muted text-foreground border-foreground/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"}
        `}
      >
        <Archive size={13} />
        {showArchived ? "Hide Archived" : "Show Archived"}
        {!showArchived && archivedCount > 0 && (
          <span className="ml-1 bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 font-bold">
            {archivedCount}
          </span>
        )}
      </button>

      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 px-3 py-2 text-xs bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
      >
        <Plus size={13} />
        New Project
      </button>
    </div>
  );
}