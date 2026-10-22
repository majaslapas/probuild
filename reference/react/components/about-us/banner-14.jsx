"use client";

import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";

const useBannerScroll = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const headingTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    ["-25%", "0%"],
  );

  return { sectionRef, headingTranslate };
};

export function Banner14() {
  const bannerScrollState = useBannerScroll();
  return (
    <section
      ref={bannerScrollState.sectionRef}
      className="overflow-hidden scheme-3 alternate logo-alt"
    >
      <div className="flex border-t border-b border-scheme-border whitespace-nowrap">
        <div className="flex w-full items-center overflow-hidden py-4 whitespace-nowrap">
          <motion.div
            className="ml-12 grid auto-cols-max grid-flow-col grid-cols-[max-content] gap-12"
            style={{ x: bannerScrollState.headingTranslate }}
          >
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
          </motion.div>
          <motion.div
            className="ml-12 grid auto-cols-max grid-flow-col grid-cols-[max-content] gap-12"
            style={{ x: bannerScrollState.headingTranslate }}
          >
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
            <h1 className="text-large font-bold">Renovation</h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
