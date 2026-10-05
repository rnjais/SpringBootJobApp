import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("button", { variants: { variant: { default: "button-dark", outline: "button-outline", quiet: "button-quiet", destructive: "button-danger" }, size: { default: "", sm: "button-compact", icon: "button-icon" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, type = "button", ...props }, ref) => <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}/>);
Button.displayName = "Button";
