import { Surface } from "@heroui/react";
import { FolderOpenIcon } from "lucide-react";

interface Props {
  hasProjects: boolean;
}

export function ProjectEmptyState({ hasProjects }: Props) {
  return (
    <div className="text-foreground flex flex-1 items-center justify-center p-8">
      <Surface
        className="flex max-w-md flex-col items-center gap-3 rounded-2xl p-10 text-center"
        variant="default">
        <FolderOpenIcon className="text-muted-foreground size-12" />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">No project selected</h1>
          <p className="text-muted-foreground text-sm">
            {hasProjects
              ? "Pick a project from the sidebar to manage participants and expenses."
              : "Create your first project from the sidebar to get started."}
          </p>
        </div>
      </Surface>
    </div>
  );
}
