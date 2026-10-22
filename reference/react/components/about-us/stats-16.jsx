"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Stats16() {
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="relative z-10 container">
        <div className="grid grid-cols-1 items-center gap-y-12 lg:grid-cols-2 lg:gap-x-20">
          <div>
            <p className="mb-3 font-semibold text-white md:mb-4">Numbers</p>
            <h2 className="mb-5 text-h2 font-bold text-white md:mb-6">
              The work speaks in years and meters
            </h2>
            <p className="text-medium text-white">
              We count what matters. Finished projects, square meters, and the
              trust that comes from both.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
              <Button variant="secondary-alt">Contact</Button>
              <Button
                variant="link-alt"
                size="link"
                iconRight={<ChevronRight className="text-white" />}
              >
                Portfolio
              </Button>
            </div>
          </div>
          <div className="grid gap-y-8 py-2 md:gap-y-12">
            <div className="border-l border-white pl-8">
              <p className="mb-2 text-[3.5rem] leading-[1.3] font-bold text-white md:text-[4rem] lg:text-[5rem]">
                120+
              </p>
              <h3 className="text-h6 font-bold text-white">
                Projects completed
              </h3>
              <p className="mt-2 text-white">
                From small repairs to full renovations across Latvia
              </p>
            </div>
            <div className="border-l border-white pl-8">
              <p className="mb-2 text-[3.5rem] leading-[1.3] font-bold text-white md:text-[4rem] lg:text-[5rem]">
                15
              </p>
              <h3 className="text-h6 font-bold text-white">
                Years in the trade
              </h3>
              <p className="mt-2 text-white">
                Building through Latvian winters and long summers
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          className="size-full object-cover"
          alt="Relume placeholder background image"
        />
        <div className="absolute inset-0 bg-neutral-darkest/50" />
      </div>
    </section>
  );
}
