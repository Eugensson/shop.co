import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { currentRole } from "@/lib/auth";
import { prisma } from "@/prisma/prisma";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const [role, notificationsUnreadCount, ordersUnreadCount] = await Promise.all(
    [
      currentRole(),
      prisma.notification.count({ where: { isRead: false } }),
      prisma.order.count({ where: { isRead: false } }),
    ]
  );

  if (!role || role !== UserRole.ADMIN) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        notificationsUnreadCount={notificationsUnreadCount}
        ordersUnreadCount={ordersUnreadCount}
      />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
