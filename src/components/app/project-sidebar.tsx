import { useMemo } from "react";

import { Button, ListBox, Surface } from "@heroui/react";
import { TrashIcon, WalletIcon } from "lucide-react";

import dayjs from "@/lib/utils/dayjs";
import { useCurrencyHunterStore } from "@/stores/currency-hunter";

import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

import { CreateProjectModal } from "./create-project-modal";

export const ProjectSidebar = () => {
  const projects = useCurrencyHunterStore((s) => s.projects);
  const activeProjectId = useCurrencyHunterStore((s) => s.activeProjectId);
  const switchProject = useCurrencyHunterStore((s) => s.switchProject);
  const deleteProject = useCurrencyHunterStore((s) => s.deleteProject);

  const projectList = useMemo(
    () =>
      Object.values(projects).sort((a, b) =>
        dayjs(b.createdAt).diff(dayjs(a.createdAt))
      ),
    [projects]
  );

  return (
    <aside className="bg-sidebar border-sidebar-border flex h-full w-64 shrink-0 flex-col gap-4 border-r px-3 py-4">
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <WalletIcon className="size-5 shrink-0" />
          <span className="text-foreground font-semibold">Currency Hunter</span>
        </div>
        <AnimatedThemeToggler />
      </div>

      <CreateProjectModal />

      <Surface className="flex flex-col gap-1 rounded-2xl" variant="default">
        {projectList.length === 0 ? (
          <p className="text-muted-foreground m-4 text-xs">
            No projects yet, please create one
          </p>
        ) : (
          <ListBox
            selectionMode="single"
            selectedKeys={activeProjectId ? [activeProjectId] : []}
            onSelectionChange={(keys) => {
              if (typeof keys === "string") {
                return;
              }
              if (keys.size !== 1) return;
              const key = keys.values().next().value as string;
              switchProject(key);
            }}>
            <ListBox.Section>
              {projectList.map((p) => (
                <ListBox.Item
                  key={p.id}
                  id={p.id}
                  className="flex items-center justify-between">
                  {p.name}
                  <Button
                    variant="danger-soft"
                    size="sm"
                    isIconOnly
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(p.id);
                    }}>
                    <TrashIcon className="size-3.5" />
                  </Button>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox.Section>
          </ListBox>
        )}
      </Surface>
    </aside>
  );
};
