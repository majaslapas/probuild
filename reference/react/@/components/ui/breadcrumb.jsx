import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHoriz } from "relume-icons";
import { cn } from "@/lib/utils";
function Breadcrumb({ ...props }) {
    return <nav data-slot="breadcrumb" aria-label="breadcrumb" {...props}/>;
}
function BreadcrumbList({ className, ...props }) {
    return (<ol data-slot="breadcrumb-list" className={cn("flex flex-wrap items-center gap-1.5 break-words text-scheme-text sm:gap-2", className)} {...props}/>);
}
function BreadcrumbItem({ className, ...props }) {
    return (<li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1.5", className)} {...props}/>);
}
function BreadcrumbLink({ asChild, className, ...props }) {
    const Comp = asChild ? Slot : "a";
    return <Comp data-slot="breadcrumb-link" className={cn(className)} {...props}/>;
}
function BreadcrumbPage({ className, ...props }) {
    return (<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" className={cn("text-scheme-text", className)} {...props}/>);
}
function BreadcrumbSeparator({ children, className, ...props }) {
    return (<li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" className={cn("text-scheme-text [&>svg]:size-4", className)} {...props}>
      {children ?? <ChevronRight />}
    </li>);
}
function BreadcrumbEllipsis({ className, ...props }) {
    return (<span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" className={cn("flex size-9 items-center justify-center", className)} {...props}>
      <MoreHoriz className="size-4"/>
      <span className="sr-only">More</span>
    </span>);
}
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, };
