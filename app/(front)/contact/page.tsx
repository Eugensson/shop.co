import Image from "next/image";
import type { Metadata } from "next";

import { Map } from "@/components/map";
import { Nav } from "@/components/nav";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
};

const ContactPage = () => {
  return (
    <section className="container mx-auto max-w-310 pt-5 lg:pt-6 pb-12 px-4 xl:px-0 space-y-2 lg:space-y-6">
      <Nav segments={[{ label: "Contact", href: "" }]} />
      <div>
        <Map />
        <section className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_3fr] gap-5">
          <Image
            src={"/contact.jpg"}
            width={500}
            height={500}
            alt="contact image"
            className="rounded-md"
          />
          <div className="border rounded-md p-5">
            <h2 className="mb-10 text-3xl lg:text-5xl text-left uppercase font-black tracking-tight font-secondary">
              Get in touch
            </h2>
            <ContactForm />
          </div>
        </section>
      </div>
    </section>
  );
};

export default ContactPage;
