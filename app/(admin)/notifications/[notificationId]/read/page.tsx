import { AtSign, List, MessageSquareText, User } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

import { prisma } from "@/prisma/prisma";

interface NotificationDetailPageProps {
  params: Promise<{
    notificationId: string;
  }>;
}

const NotificationDetailPage = async ({
  params,
}: NotificationDetailPageProps) => {
  const id = (await params).notificationId;

  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification) {
    return <p>Не вдалося знайти повідомлення з таким {id}</p>;
  }

  return (
    <section className="p-20 h-full">
      <Card className="h-full p-10">
        <CardContent className="grid grid-cols-[1fr_12fr] gap-x-10 gap-y-5">
          <User className="text-muted-foreground" />
          <p>{notification?.name}</p>
          <List className="text-muted-foreground" />
          <p>{notification?.subject}</p>
          <AtSign className="text-muted-foreground" />
          <p>{notification?.email}</p>
          <MessageSquareText className="text-muted-foreground" />
          <Textarea
            value={notification?.message}
            className="disabled:opacity-100 h-50"
            readOnly
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default NotificationDetailPage;
