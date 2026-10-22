import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-3 rounded-button whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "border border-transparent bg-christine font-medium text-scheme-btn-text hover:border-christine-dark hover:bg-christine-dark btn-light:border-transparent btn-light:bg-white btn-light:text-neutral-darkest btn-light:hover:border-neutral-lighter btn-light:hover:bg-neutral-lighter",
            alternate: "border border-transparent bg-white font-medium text-neutral-darkest hover:border-neutral-lighter hover:bg-neutral-lighter",
            secondary: "border border-transparent bg-neutral-darkest-5 font-medium backdrop-blur-[10px] hover:border-transparent hover:bg-neutral-darkest-5 alternate:border-transparent alternate:bg-white-20 alternate:hover:border-neutral-lighter alternate:hover:bg-white-20",
            "secondary-alt": "border border-transparent bg-white-20 font-medium text-white backdrop-blur-[10px] hover:border-neutral-lighter hover:bg-white-20",
            link: "gap-2 text-scheme-text",
            "link-alt": "gap-2 text-white",
            ghost: "hover:bg-neutral-darkest hover:text-white",
            none: "",
        },
        size: {
            default: "px-6 py-2.5",
            sm: "px-5 py-2",
            link: "p-0",
            icon: "size-10",
            none: "",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
function Button({ className, variant, size, asChild = false, iconLeft, iconRight, children, ...props }) {
    const Comp = asChild ? Slot : "button";
    return (<Comp data-slot="button" data-variant={variant || "default"} className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {iconLeft && iconLeft}
      <Slottable>{children}</Slottable>
      {iconRight && iconRight}
    </Comp>);
}
export { Button, buttonVariants };
