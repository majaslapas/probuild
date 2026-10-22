"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Cta27() {
  return (
    <section className="relative px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="relative z-10 container max-w-lg text-center">
        <h2 className="mb-5 text-h2 font-bold text-white md:mb-6">
          Start your project today
        </h2>
        <p className="text-medium text-white">
          Tell us what you need built, renovated, or rented. We will give you a
          straight answer.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
          <Button title="Contact" variant="alternate">
            Contact
          </Button>
          <Button title="Rent" variant="secondary-alt">
            Rent
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 z-0">
        <img
          src="https://imagedelivery.net/RAP5LnVUMDfmG3LRL4kHtw/d157519a-dcee-4157-9569-2ec3a76bf101/2560?exp=1793232000&sig=8d6edec3b880d02a1576b3b53c8bd422f438151e53ae65ab34eb0e71da5338a6"
          className="size-full object-cover"
          alt="Relume placeholder background image"
        />
        <div className="absolute inset-0 bg-neutral-darkest/50" />
      </div>
    </section>
  );
}
