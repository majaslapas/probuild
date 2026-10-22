"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header36() {
  return (
    <section className="grid grid-cols-1 items-center gap-y-16 pt-16 md:pt-24 lg:grid-cols-2 lg:pt-0 scheme-3 alternate logo-alt">
      <div className="mx-[5%] sm:max-w-md md:justify-self-start lg:mr-20 lg:ml-[5vw] lg:justify-self-end">
        <h1 className="mb-5 text-h1 font-bold md:mb-6">
          Work done right (+calculator)
        </h1>
        <p className="text-medium">
          Construction, renovation, and maintenance from a team that shows up on
          time. We build it clean and we build it to last.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
          <Button title="Services">Services</Button>
          <Button title="Estimate" variant="secondary">
            Estimate
          </Button>
        </div>
      </div>
      <div>
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          alt="Relume placeholder image"
          className="w-full object-cover lg:h-screen lg:max-h-[60rem]"
        />
      </div>
    </section>
  );
}
