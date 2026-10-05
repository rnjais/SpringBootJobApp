import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(({ className, invalid, ...props }, ref) => <input ref={ref} aria-invalid={invalid || undefined} className={cn("ui-input", className)} {...props}/>);
Input.displayName = "Input";
