"use client";

import Link from "next/link";
import Image from "next/image";
import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";

import { DRESS_STYLE_LIST } from "@/constants";

const staggeredVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const BrowseByDressStyle = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
          }, 100);
        } else {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container pt-10 pb-4 lg:pb-19 px-6 lg:px-16 mx-auto max-w-310 rounded-2xl overflow-y-hidden bg-[#f0f0f0]"
    >
      <h2 className="mb-7 lg:mb-16 text-3xl lg:text-5xl text-center uppercase font-black tracking-tight font-secondary">
        browse by dress style
      </h2>

      <motion.ul
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={{
          visible: { transition: { staggerChildren: 0.3 } },
          hidden: {
            transition: { staggerChildren: 0.1, staggerDirection: -1 },
          },
        }}
      >
        {DRESS_STYLE_LIST.map(({ name, value, thumb }) => {
          const isWide = name === "formal" || name === "party";
          const className = isWide ? "lg:col-span-2" : "";

          return (
            <motion.li
              key={name}
              variants={staggeredVariants}
              className={`relative w-full h-48 lg:h-72 rounded-2xl overflow-hidden ${className}`}
            >
              <Link href={`/shop?dressStyle=${value}`}>
                <Image
                  src={thumb}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="w-full h-full object-cover"
                />
                <h2 className="absolute top-4 left-6 lg:top-6 lg:left-9 text-2xl lg:text-4xl font-bold font-secondary capitalize">
                  {name}
                </h2>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
};
