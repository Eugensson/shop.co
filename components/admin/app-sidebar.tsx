import Link from "next/link";
import { BellRing, Calendar } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

import { cn } from "@/lib/utils";
import { ADMIN_NAV_LINKS } from "@/constants";

interface AppSidebarProps {
  notificationsUnreadCount: number;
  ordersUnreadCount: number;
}

export const AppSidebar = ({
  notificationsUnreadCount,
  ordersUnreadCount,
}: AppSidebarProps) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <Logo />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV_LINKS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem key="orders">
                <SidebarMenuButton asChild>
                  <Link
                    href="/orders"
                    className={cn(
                      "flex items-center gap-2",
                      ordersUnreadCount > 0 && "font-semibold"
                    )}
                  >
                    <Calendar
                      className={cn(
                        "text-2xl",
                        ordersUnreadCount > 0 &&
                          "text-primary animate-caret-blink"
                      )}
                    />
                    <span className="text-sm">
                      Orders&nbsp;(
                      {ordersUnreadCount ?? 0})
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key="notifications">
                <SidebarMenuButton asChild>
                  <Link
                    href="/notifications"
                    className={cn(
                      "flex items-center gap-2",
                      notificationsUnreadCount > 0 && "font-semibold"
                    )}
                  >
                    <BellRing
                      className={cn(
                        "text-2xl",
                        notificationsUnreadCount > 0 &&
                          "text-primary animate-caret-blink"
                      )}
                    />
                    <span className="text-sm">
                      Notifications&nbsp;(
                      {notificationsUnreadCount ?? 0})
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
