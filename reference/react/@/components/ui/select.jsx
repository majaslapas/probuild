"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { KeyboardArrowDown, KeyboardArrowUp, Check } from "relume-icons";
import { cn } from "@/lib/utils";
function Select({ ...props }) {
    return <SelectPrimitive.Root data-slot="select" {...props}/>;
}
function SelectGroup({ ...props }) {
    return <SelectPrimitive.Group data-slot="select-group" {...props}/>;
}
function SelectValue({ ...props }) {
    return <SelectPrimitive.Value data-slot="select-value" {...props}/>;
}
function SelectTrigger({ children, className, ...props }) {
    return (<SelectPrimitive.Trigger data-slot="select-trigger" className={cn("flex w-full items-center justify-between gap-1 rounded-form whitespace-nowrap transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&[data-state=open]>svg]:rotate-180", "border border-transparent bg-neutral-darkest-5 text-scheme-text backdrop-blur-[10px] placeholder:text-neutral-darkest-60 hover:bg-neutral-darkest-15 alternate:border-transparent alternate:bg-white-10 alternate:text-white alternate:placeholder:text-white-60 alternate:hover:bg-white-20", "min-h-11 px-3 py-2", className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <KeyboardArrowDown className="size-5 text-scheme-text transition-transform duration-300"/>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>);
}
function SelectContent({ className, children, position = "popper", ...props }) {
    return (<SelectPrimitive.Portal>
      <SelectPrimitive.Content data-slot="select-content" className={cn("relative z-50 overflow-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "border border-scheme-border bg-scheme-background text-scheme-text", "max-h-96 min-w-32", position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)} position={position} {...props}>
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={cn("p-1", position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1")}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>);
}
function SelectLabel({ className, ...props }) {
    return (<SelectPrimitive.Label data-slot="select-label" className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props}/>);
}
function SelectItem({ className, children, ...props }) {
    return (<SelectPrimitive.Item data-slot="select-item" className={cn("relative flex w-full cursor-default items-center px-3 py-2 outline-none select-none focus:bg-scheme-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-5"/>
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>);
}
function SelectSeparator({ className, ...props }) {
    return (<SelectPrimitive.Separator data-slot="select-separator" className={cn("-mx-1 my-1 h-px bg-scheme-foreground", className)} {...props}/>);
}
function SelectScrollUpButton({ className, ...props }) {
    return (<SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
      <KeyboardArrowUp className="size-6 text-scheme-text"/>
    </SelectPrimitive.ScrollUpButton>);
}
function SelectScrollDownButton({ className, ...props }) {
    return (<SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
      <KeyboardArrowDown className="size-6 text-scheme-text"/>
    </SelectPrimitive.ScrollDownButton>);
}
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton, };
