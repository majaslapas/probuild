"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";
import { ChevronRight } from "relume-icons";

const useMotionCard = () => {
  return motion.create(Card);
};

const useAnimation = (projects) => {
  const refs = projects.map(() => useRef(null));
  const computedStyles = refs.map((ref) => {
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
    });
    const scale = useTransform(
      scrollYProgress,
      [0, 0.2, 0.7, 0.9, 1],
      [0.9, 1, 1, 0.95, 0.9],
    );
    const opacity = useTransform(
      scrollYProgress,
      [0, 0.2, 0.7, 0.9, 0.95],
      [0, 1, 1, 0.5, 0],
    );
    const style = {
      scale,
      opacity,
    };
    return style;
  });
  return {
    refs,
    computedStyles,
  };
};

export function Portfolio23() {
  const useActive = useAnimation([
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <ChevronRight className="text-scheme-text" />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image center",
      },
    },
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <ChevronRight className="text-scheme-text" />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image center",
      },
    },
    {
      heading: "Project name",
      tags: ["Tag one", "Tag two", "Tag three"],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
      buttons: [
        { title: "Button", variant: "secondary" },
        {
          title: "Button",
          variant: "link",
          size: "link",
          iconRight: <ChevronRight className="text-scheme-text" />,
        },
      ],
      image: {
        src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg",
        alt: "Relume placeholder image center",
      },
    },
  ]);
  const useMotionCard = useMotionCard();
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <header className="mx-auto mb-12 max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">Portfolio</p>
          <h2 className="mb-5 text-h2 font-bold md:mb-6">
            Selected work we're proud of
          </h2>
          <p className="text-medium">
            Filter by trade to see the craft behind each build.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:gap-12 lg:gap-20">
          <useMotionCard
            ref={useActive.refs[0]}
            style={useActive.computedStyles[0]}
            className="grid grid-cols-1 gap-x-20 gap-y-6 p-6 md:grid-cols-[3fr_4fr] md:gap-y-20 md:p-8 lg:p-12"
          >
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-h3 font-bold">Timber frame house</h3>
                <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                  <Badge>Timber frame</Badge>
                  <Badge>Foundations</Badge>
                  <Badge>120 m²</Badge>
                </div>
              </div>
              <div className="mt-6 text-medium md:mt-8">
                Filter by trade to see the craft behind each build. Electrical
                work, foundations, timber frame, and more.
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="View project" variant="secondary">
                  View project
                </Button>
                <Button
                  title="View project"
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight className="text-scheme-text" />}
                >
                  View project
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image center"
                className="aspect-[3/2] w-full rounded-image object-cover"
              />
            </div>
          </useMotionCard>
          <useMotionCard
            ref={useActive.refs[1]}
            style={useActive.computedStyles[1]}
            className="grid grid-cols-1 gap-x-20 gap-y-6 p-6 md:grid-cols-[3fr_4fr] md:gap-y-20 md:p-8 lg:p-12"
          >
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-h3 font-bold">Facade renovation</h3>
                <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                  <Badge>Facades</Badge>
                  <Badge>Carpentry</Badge>
                  <Badge>85 m²</Badge>
                </div>
              </div>
              <div className="mt-6 text-medium md:mt-8">
                Each card shows the work done, the area in square meters, and
                the price per square meter.
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="View all" variant="secondary">
                  View all
                </Button>
                <Button
                  title="View all"
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight className="text-scheme-text" />}
                >
                  View all
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image center"
                className="aspect-[3/2] w-full rounded-image object-cover"
              />
            </div>
          </useMotionCard>
          <useMotionCard
            ref={useActive.refs[2]}
            style={useActive.computedStyles[2]}
            className="grid grid-cols-1 gap-x-20 gap-y-6 p-6 md:grid-cols-[3fr_4fr] md:gap-y-20 md:p-8 lg:p-12"
          >
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-h3 font-bold">Electrical upgrade</h3>
                <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                  <Badge>Electrical</Badge>
                  <Badge>Renovation</Badge>
                  <Badge>210 m²</Badge>
                </div>
              </div>
              <div className="mt-6 text-medium md:mt-8">
                Look at the before and after. The work speaks for itself.
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
                <Button title="All" variant="secondary">
                  All
                </Button>
                <Button
                  title="All"
                  variant="link"
                  size="link"
                  iconRight={<ChevronRight className="text-scheme-text" />}
                >
                  All
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                alt="Relume placeholder image center"
                className="aspect-[3/2] w-full rounded-image object-cover"
              />
            </div>
          </useMotionCard>
        </div>
      </div>
      <div className="h-screen" />
    </section>
  );
}
