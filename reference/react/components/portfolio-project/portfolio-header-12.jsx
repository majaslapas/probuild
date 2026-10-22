"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

export function PortfolioHeader12() {
  return (
    <section className="relative px-[5%] scheme-3 alternate logo-alt">
      <div className="absolute inset-0 z-0">
        <img
          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
          alt="Relume placeholder image 1"
          className="size-full object-cover"
        />
        <span className="absolute inset-0 z-10 bg-neutral-darkest/50" />
      </div>
      <div className="relative z-10 flex min-h-svh items-end justify-center">
        <div className="container">
          <div className="grid grid-cols-1 items-start gap-6 py-16 md:grid-cols-2 md:gap-x-12 md:py-24 lg:gap-20 lg:py-28">
            <div>
              <h1 className="mb-5 text-h1 font-bold text-white md:mb-6">
                Riga timber house
              </h1>
              <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
                <Badge variant="alternate">
                  <a href="#">Timber frame</a>
                </Badge>
                <Badge variant="alternate">
                  <a href="#">120 m²</a>
                </Badge>
                <Badge variant="alternate">
                  <a href="#">€85/m²</a>
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-medium text-white">
                A full renovation of a tired old house into a warm, modern home.
                We handled everything from the new timber frame to the final
                coat of paint.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
