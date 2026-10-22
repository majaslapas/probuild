import * as React from "react";
import { cn } from "@/lib/utils";
function Textarea({ className, ...props }) {
    return (<textarea data-slot="textarea" className={cn("tansition-all flex w-full rounded-form duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50", "border border-transparent bg-neutral-darkest-5 text-scheme-text backdrop-blur-[10px] placeholder:text-neutral-darkest-60 hover:bg-neutral-darkest-15 alternate:border-transparent alternate:bg-white-10 alternate:text-white alternate:placeholder:text-white-60 alternate:hover:bg-white-20", "min-h-11 p-3", className)} {...props}/>);
}
export { Textarea };
