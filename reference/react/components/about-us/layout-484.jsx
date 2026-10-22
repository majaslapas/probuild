"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight } from "relume-icons";

export function Layout484() {
  return (
    <section className="overflow-hidden px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container max-w-xl">
        <p className="mb-3 font-semibold md:mb-4">Story</p>
        <p className="text-h2 font-bold">
          We built our first wall in Salaspils. We have been building trust ever
          since. We started with a tractor and a promise. The work grew from
          there. We started with a tractor and a promise. The work grew from
          there.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-8">
          <Button title="Contact" variant="secondary">
            Contact
          </Button>
          <Button
            title="Portfolio"
            variant="link"
            size="link"
            iconRight={<ChevronRight className="text-scheme-text" />}
          >
            Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}
