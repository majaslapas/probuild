"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
function Tabs({ children, className, ...props }) {
    return (<TabsPrimitive.Root data-slot="tabs" className={cn(className)} {...props}>
      {children}
    </TabsPrimitive.Root>);
}
function TabsList({ children, className, ...props }) {
    return (<TabsPrimitive.List data-slot="tabs-list" className={cn("flex", className)} {...props}>
      {children}
    </TabsPrimitive.List>);
}
function TabsTrigger({ children, className, onClick, ...props }) {
    return (<TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn("inline-flex items-center justify-center rounded-button px-6 py-2.5 whitespace-nowrap focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", "data-[state=active]:bg-scheme-background data-[state=inactive]:border-transparent", className)} {...props}>
      {children}
    </TabsPrimitive.Trigger>);
}
function TabsContent({ children, className, ...props }) {
    return (<TabsPrimitive.Content data-slot="tabs-content" className={cn("focus-visible:outline-none", className)} {...props}>
      {children}
    </TabsPrimitive.Content>);
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
