import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export const Card = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => <article ref={ref} className={cn("ui-card", className)} {...props}/>);
Card.displayName = "Card";
