import Link from "next/link";
import { RiTwitterXLine } from "react-icons/ri";
import { RiFacebookFill } from "react-icons/ri";
import { RiLinkedinFill } from "react-icons/ri";
import { RiInstagramLine } from "react-icons/ri";

const socials = [
  {
    name: "twitterX",
    icon: RiTwitterXLine,
    href: "https://x.com",
  },
  {
    name: "facebook",
    icon: RiFacebookFill,
    href: "https://facebook.com",
  },
  {
    name: "linkedin",
    icon: RiLinkedinFill,
    href: "https://linkedin.com",
  },
  {
    name: "instagram",
    icon: RiInstagramLine,
    href: "https://instagram.com",
  },
];

export const Socials = () => {
  return (
    <ul className="flex items-center gap-3">
      {socials.map(({ name, icon: Icon, href }) => (
        <li key={name}>
          <Link
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center size-10 rounded-full border bg-white text-black hover:bg-black hover:text-white transition-colors"
          >
            <Icon size={22} />
          </Link>
        </li>
      ))}
    </ul>
  );
};
