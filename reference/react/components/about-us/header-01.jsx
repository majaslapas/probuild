"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Header1() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 md:gap-y-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="mb-5 text-h1 font-bold md:mb-6">
              Builders who finish what they start
            </h1>
            <p className="text-medium">
              Construction and renovation in Salaspils and across Latvia. We
              bring the tools, the crew, and the grit.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="Contact">Contact</Button>
              <Button title="Services" variant="secondary">
                Services
              </Button>
            </div>
          </div>
          <div>
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
              className="w-full rounded-image object-cover"
              alt="Relume placeholder image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
