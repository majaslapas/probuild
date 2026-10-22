import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-badge px-2 py-1 text-sm font-semibold focus:outline-none", {
    variants: {
        variant: {
            default: "bg-neutral-darkest-5 text-neutral-darkest backdrop-blur-[10px] badge-alt:border-white-10 badge-alt:bg-white-10 badge-alt:text-white",
            outline: "border border-scheme-border text-scheme-text",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? Slot : "span";
    return (<Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}/>);
}
export { Badge, badgeVariants };
