import { FaGooglePay, FaApplePay } from "react-icons/fa6";
import { RiMastercardFill, RiPaypalFill, RiVisaLine } from "react-icons/ri";

import { Logo } from "@/components/logo";
import { Socials } from "@/components/socials";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const navLinks = [
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Features", href: "#" },
      { name: "Works", href: "#" },
      { name: "Career", href: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Customer Support", href: "#" },
      { name: "Delivery Details", href: "#" },
      { name: "Terms & Conditions", href: "#" },
      { name: "Privacy Policy", href: "#" },
    ],
  },
  {
    title: "F.A.Q.",
    links: [
      { name: "Account", href: "#" },
      { name: "Manage Deliveries", href: "#" },
      { name: "Orders", href: "#" },
      { name: "Payments", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Free eBooks", href: "#" },
      { name: "Development Tutorial", href: "#" },
      { name: "How to - Blog", href: "#" },
      { name: "Youtube Playlist", href: "#" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-[#f0f0f0] pt-48 lg:pt-30 pb-10 px-4 xl:px-0">
      <nav className="container mx-auto max-w-310 flex flex-col md:flex-row justify-center md:justify-between gap-4">
        <div className="flex flex-col">
          <Logo className="mb-3.5 lg:mb-6" />
          <p className="mb-5 lg:mb-9 max-w-65 text-muted-foreground font-secondary text-sm lg:text-base">
            We have clothes that suits your style and which you&apos;re proud to
            wear. From women to men.
          </p>
          <Socials />
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-x-25">
          {navLinks.map(({ title, links }) => (
            <li key={title}>
              <h3 className="mb-3.5 lg:mb-6 font-semibold text-muted-foreground font-secondary text-sm lg:text-base uppercase tracking-wider">
                {title}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-xs lg:text-sm font-secondary text-muted-foreground"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      <Separator className="container max-w-310 mx-auto mt-12 mb-6" />
      <div className="container mx-auto max-w-310 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
        <p className="text-xs lg:text-sm font-secondary text-muted-foreground">
          Shop.co &copy;2025. All Rights Reserved
        </p>
        <ul className="flex items-center gap-3">
          <li className="w-12 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
            <FaApplePay size={30} />
          </li>
          <li className="w-12 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
            <RiVisaLine size={30} />
          </li>
          <li className="w-12 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
            <RiMastercardFill size={28} />
          </li>
          <li className="w-12 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
            <RiPaypalFill size={26} />
          </li>
          <li className="w-12 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
            <FaGooglePay size={32} />
          </li>
        </ul>
      </div>
    </footer>
  );
};
