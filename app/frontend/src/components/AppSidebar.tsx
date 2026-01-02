"use client";

import Link from "next/link";
import {
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  Sidebar,
} from "./ui/sidebar";
import { Plus, Search } from "lucide-react";
import clsx from "clsx";

const menuItems = [
  { title: "ค้นหาของหาย", url: "/main", icon: Search },
  { title: "แจ้งพบของ", url: "/main/create", icon: Plus },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarHeader
        className={`p-4 border-b border-sidebar-border ${
          collapsed ? "flex items-center" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-bold text-lg text-sidebar-foreground">
                KU Lost&Found
              </h2>
            </div>
          )}
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent rounded-md p-1.5 transition-colors" />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={clsx({ "flex items-center": collapsed })}>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
