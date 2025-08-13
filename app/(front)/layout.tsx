import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Newsletter } from "@/components/newsletter";
import { SignupBaner } from "@/components/signup-baner";

const FrontLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section>
      <SignupBaner />
      <Header />
      <main className="min-h-[50vh]">{children}</main>
      <Newsletter />
      <Footer />
    </section>
  );
};

export default FrontLayout;
