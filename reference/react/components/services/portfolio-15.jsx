"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

export function Portfolio15() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-h2 font-bold md:mb-6">Work that speaks</h2>
          <p className="text-medium">
            A few projects from around the Salaspils area
          </p>
        </div>
        <div>
          <article className="grid grid-cols-1 items-center gap-x-12 gap-y-6 border-t border-scheme-border py-8 md:grid-cols-2 md:gap-y-0 lg:gap-x-[4.9rem] lg:py-12">
            <div>
              <h3 className="mb-2 text-h4 font-bold">
                <a href="#">Charred wood facade</a>
              </h3>
              <p>
                Full exterior renovation with thermowood and charred wood
                cladding. Full exterior renovation with thermowood and charred
                wood cladding. Full exterior renovation with thermowood and
                charred wood cladding. $100 per sq.m. $100 a day
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <Badge>
                  <a href="#">Facade</a>
                </Badge>
                <Badge>
                  <a href="#">Renovation</a>
                </Badge>
                <Badge>
                  <a href="#">Exterior</a>
                </Badge>
              </div>
            </div>
            <div>
              <a href="#" className="flex aspect-[4/3] w-full">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="w-full rounded-image object-cover"
                />
              </a>
            </div>
          </article>
          <article className="grid grid-cols-1 items-center gap-x-12 gap-y-6 border-t border-scheme-border py-8 md:grid-cols-2 md:gap-y-0 lg:gap-x-[4.9rem] lg:py-12">
            <div>
              <h3 className="mb-2 text-h4 font-bold">
                <a href="#">Timber frame house</a>
              </h3>
              <p>
                Full exterior renovation with thermowood and charred wood
                cladding. Full exterior renovation with thermowood and charred
                wood cladding. Full exterior renovation with thermowood and
                charred wood cladding. $100 per sq.m. $100 a day
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <Badge>
                  <a href="#">Timber frame</a>
                </Badge>
                <Badge>
                  <a href="#">Foundations</a>
                </Badge>
                <Badge>
                  <a href="#">Electrical</a>
                </Badge>
              </div>
            </div>
            <div>
              <a href="#" className="flex aspect-[4/3] w-full">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="w-full rounded-image object-cover"
                />
              </a>
            </div>
          </article>
          <article className="grid grid-cols-1 items-center gap-x-12 gap-y-6 border-t border-scheme-border py-8 md:grid-cols-2 md:gap-y-0 lg:gap-x-[4.9rem] lg:py-12">
            <div>
              <h3 className="mb-2 text-h4 font-bold">
                <a href="#">Property maintenance</a>
              </h3>
              <p>
                Full exterior renovation with thermowood and charred wood
                cladding. Full exterior renovation with thermowood and charred
                wood cladding. Full exterior renovation with thermowood and
                charred wood cladding. $100 per sq.m. $100 a day
              </p>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <Badge>
                  <a href="#">Maintenance</a>
                </Badge>
                <Badge>
                  <a href="#">Contract</a>
                </Badge>
                <Badge>
                  <a href="#">Residential</a>
                </Badge>
              </div>
            </div>
            <div>
              <a href="#" className="flex aspect-[4/3] w-full">
                <img
                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                  alt="Relume placeholder image"
                  className="w-full rounded-image object-cover"
                />
              </a>
            </div>
          </article>
        </div>
        <div className="mt-12 flex justify-center md:mt-18 lg:mt-20" />
      </div>
    </section>
  );
}
