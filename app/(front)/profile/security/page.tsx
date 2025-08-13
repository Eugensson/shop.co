import { Nav } from "@/components/nav";
import { SecurityProfileForm } from "@/components/security-profile-form";

import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/next-auth";

const SecurityProfilePage = async () => {
  const user = await currentUser();

  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav
        segments={[
          { label: "Profile", href: "/profile" },
          { label: "Security", href: "" },
        ]}
      />
      <SecurityProfileForm user={user as ExtendedUser} />
    </section>
  );
};

export default SecurityProfilePage;
