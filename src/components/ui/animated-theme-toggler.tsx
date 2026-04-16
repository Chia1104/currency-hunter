import { useCallback, useRef, startTransition } from "react";

import { Button } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

import { Theme } from "@/enums/theme.enum";
import { cn } from "@/lib/utils/cn";

import { useTheme } from "../theme-provider";

interface AnimatedThemeTogglerProps extends ButtonProps {
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { isDark, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    startTransition(() => {
      flushSync(() => {
        setTheme(isDark ? Theme.Light : Theme.Dark);
      });
    });

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [duration, isDark, setTheme]);

  return (
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      ref={buttonRef}
      onPress={toggleTheme}
      className={cn(className)}
      {...props}>
      {isDark ? (
        <Sun strokeWidth={1} className="size-6" />
      ) : (
        <Moon strokeWidth={1} className="size-6" />
      )}
    </Button>
  );
};
