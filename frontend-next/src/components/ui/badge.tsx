import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("ui-badge", { variants: { variant: { default: "ui-badge-default", success: "ui-badge-success", subtle: "ui-badge-subtle", warning: "ui-badge-warning" } }, defaultVariants: { variant: "default" } });
export function Badge({ className, variant, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) { return <span className={cn(badgeVariants({ variant }), className)} {...props}/>; }
