import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

// Touch-aware Tooltip that toggles on tap and disables hover on mobile
const TooltipProvider = TooltipPrimitive.Provider;

type RootProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

type TooltipCtx = {
  isTouch: boolean;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const TooltipContext = React.createContext<TooltipCtx | null>(null);

const Tooltip: React.FC<RootProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  ...props
}) => {
  const [isTouch, setIsTouch] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (isTouch) setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <TooltipContext.Provider value={{ isTouch, open: isTouch ? open : Boolean(controlledOpen), setOpen }}>
      <TooltipPrimitive.Root
        open={isTouch ? open : controlledOpen}
        onOpenChange={handleOpenChange}
        delayDuration={isTouch ? 0 : delayDuration}
        disableHoverableContent={isTouch ? true : disableHoverableContent}
        {...props}
      >
        {children}
      </TooltipPrimitive.Root>
    </TooltipContext.Provider>
  );
};

type TriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  TriggerProps
>(({ onClick, ...props }, ref) => {
  const ctx = React.useContext(TooltipContext);

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    onClick?.(e as any);
    if (ctx?.isTouch) {
      e.preventDefault();
      e.stopPropagation();
      ctx.setOpen(!ctx.open);
    }
  };

  return (
    <TooltipPrimitive.Trigger ref={ref} onClick={handleClick as any} {...props} />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, side, sideOffset = 8, align = "start", collisionPadding = 16, ...props }, ref) => {
  const ctx = React.useContext(TooltipContext);
  const resolvedSide = side ?? (ctx?.isTouch ? "bottom" : "top");
  return (
    <TooltipPrimitive.Content
      ref={ref}
      side={resolvedSide}
      sideOffset={sideOffset}
      align={align}
      collisionPadding={collisionPadding}
      className={cn(
        "z-50 overflow-hidden rounded-xl border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-w-[280px] sm:max-w-xs whitespace-normal break-words leading-snug",
        className,
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
