import Link from "next/link";
import type { Metadata } from "next";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Nav } from "@/components/nav";
import { Separator } from "@/components/ui/separator";
import { BrowsingHistory } from "@/components/browsing-history";

import { PROFILE_LIST } from "@/constants";

export const metadata: Metadata = {
  title: "Profile",
  robots: {
    index: false,
    follow: true,
  },
};

const ProfilePage = async () => {
  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-12">
      <Nav segments={[{ label: "Profile", href: "" }]} />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-10">
        {PROFILE_LIST.map(({ label, description, href, icon: Icon }) => (
          <li key={label}>
            <Link href={href}>
              <Card className="flex flex-row p-6 min-h-40">
                <Icon size={50} />
                <CardHeader className="w-full">
                  <CardTitle className="text-2xl">{label}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <Separator className="mt-5 lg:mt-10" />
      <BrowsingHistory />
    </section>
  );
};

export default ProfilePage;
