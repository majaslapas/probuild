"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header5() {
  return (
    <section className="relative px-[5%] scheme-1 alternate logo-alt">
      <div className="relative z-10 container">
        <div className="flex max-h-[60rem] min-h-svh items-center py-16 md:py-24 lg:py-28">
          <div className="max-w-md">
            <h1 className="mb-5 text-h1 font-bold text-white md:mb-6">
              Rennovation & building services
            </h1>
            <p className="text-medium text-white">
              We handle construction, renovation, and equipment rental from
              Salaspils. You get solid work and the right tools for the job.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Learn more" variant="alternate">
                Learn more
              </Button>
              <Button title="Get information" variant="secondary-alt">
                Get information
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://imagedelivery.net/RAP5LnVUMDfmG3LRL4kHtw/759080f7-535a-4306-5239-93daf02a6601/2560?exp=1793232000&sig=bb65b59b178c5a8b908ca12dd1b25915119ac44150921d6f71c43cbed600c418"
          className="size-full object-cover"
          alt="Relume placeholder background image"
        />
        <div className="absolute inset-0 bg-neutral-darkest/50" />
      </div>
    </section>
  );
}
