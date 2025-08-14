import type { Metadata } from "next";
import { UserCog } from "lucide-react";
import { UserRole } from "@prisma/client";

import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Profile info",
  robots: {
    index: false,
    follow: true,
  },
};

const ProfileInfoPage = async () => {
  const user = await currentUser();

  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav
        segments={[
          { label: "Profile", href: "/profile" },
          { label: "Profile info", href: "" },
        ]}
      />
      <Card className="w-full p-5 max-w-2xl shadow-md mx-auto">
        <CardHeader className="relative flex items-center justify-between">
          <CardTitle className="mx-auto flex items-center gap-2 text-xl text-center">
            <UserCog />
            Profile info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">ID</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.id}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Username</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.name}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Email address</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.email}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Role</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {user?.role === UserRole.ADMIN ? "Admin" : "User"}
            </p>
          </div>
          <div className="flex flex-row justify-between items-center rounded-md border p-3 shadow-sm">
            <p className="text-sm font-medium">Two factor authentication</p>
            <Badge
              variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
            >
              {user?.isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ProfileInfoPage;
