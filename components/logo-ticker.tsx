import Image from "next/image";
import { Fragment } from "react";
import * as motion from "motion/react-client";

import { LOGO_LIST } from "@/constants";

export const LogoTicker = () => {
  return (
    <section className="py-10 overflow-x-clip bg-black">
      <div className="container max-w-310 mx-auto flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          animate={{ x: "-50%" }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex flex-none gap-24 pr-24"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <Fragment key={i}>
              {LOGO_LIST.map(({ name, image }) => (
                <Image key={name} src={image} alt={`${name} logo`} />
              ))}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
