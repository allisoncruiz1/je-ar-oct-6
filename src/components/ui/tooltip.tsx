import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Popover as RPopover, PopoverTrigger as RPopoverTrigger, PopoverContent as RPopoverContent } from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

type TooltipCtx = { isTouch: boolean };
const TooltipContext = React.createContext<TooltipCtx | null>(null);

function useMobileTooltip() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqNoHover = window.matchMedia("(hover: none)");
    const compute = () => setIsMobile(mqCoarse.matches || mqNoHover.matches || window.innerWidth < 768);
    compute();
    const onResize = () => compute();
    const onChange = () => compute();
    window.addEventListener("resize", onResize);
    if (mqCoarse.addEventListener) {
      mqCoarse.addEventListener("change", onChange);
      mqNoHover.addEventListener("change", onChange);
    } else {
      // Safari fallback
      mqCoarse.addListener(onChange);
      mqNoHover.addListener(onChange);
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (mqCoarse.removeEventListener) {
        mqCoarse.removeEventListener("change", onChange);
        mqNoHover.removeEventListener("change", onChange);
      } else {
        mqCoarse.removeListener(onChange);
        mqNoHover.removeListener(onChange);
      }
    };
  }, []);
  return isMobile;
}

const Tooltip: React.FC<React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>> = ({ children, ...props }) => {
  const isTouch = useMobileTooltip();
  return (
    <TooltipContext.Provider value={{ isTouch }}>
      {isTouch ? (
        <RPopover>{children}</RPopover>
      ) : (
        <TooltipPrimitive.Root delayDuration={200} {...props}>
          {children}
        </TooltipPrimitive.Root>
      )}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
  const ctx = React.useContext(TooltipContext);
  if (ctx?.isTouch) {
    return <RPopoverTrigger ref={ref as any} {...props} />;
  }
  return <TooltipPrimitive.Trigger ref={ref} {...props} />;
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, side = "top", sideOffset = 8, align = "start", collisionPadding = 12, ...props }, ref) => {
  const ctx = React.useContext(TooltipContext);
  const bubbleClasses = cn(
    "z-50 overflow-hidden rounded-xl border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-lg whitespace-normal break-words leading-snug max-w-[280px] sm:max-w-xs",
    className,
  );

  if (ctx?.isTouch) {
    return (
      <RPopoverContent ref={ref as any} sideOffset={sideOffset} align={align} className={bubbleClasses}>
        {props.children as React.ReactNode}
      </RPopoverContent>
    );
  }
  return (
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      sideOffset={sideOffset}
      align={align}
      collisionPadding={collisionPadding}
      className={cn(
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        bubbleClasses,
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
