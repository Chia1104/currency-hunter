import { createFileRoute } from "@tanstack/react-router";

import { ProjectEmptyState } from "@/components/app/project-empty-state";
import { ProjectMainWorkspace } from "@/components/app/project-main-workspace";
import { ProjectSidebar } from "@/components/app/project-sidebar";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const activeProjectId = useCurrencyHunterStore((s) => s.activeProjectId);
  const activeProject = useCurrencyHunterStore((s) =>
    activeProjectId ? s.projects[activeProjectId] : undefined
  );
  const hasProjects = useCurrencyHunterStore(
    (s) => Object.keys(s.projects).length > 0
  );

  return (
    <div className="flex h-screen overflow-hidden" key={activeProjectId}>
      <ProjectSidebar />
      <main className="bg-background flex flex-1 flex-col overflow-y-auto">
        {!activeProjectId || !activeProject ? (
          <ProjectEmptyState hasProjects={hasProjects} />
        ) : (
          <ProjectMainWorkspace projectId={activeProject.id} />
        )}
      </main>
    </div>
  );
}
