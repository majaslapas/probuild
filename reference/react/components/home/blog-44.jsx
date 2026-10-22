"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

export function Blog44() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-1 alternate logo-alt">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-start justify-start gap-y-8 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:justify-between md:gap-x-12 md:gap-y-4 lg:mb-20 lg:gap-x-20">
          <div className="w-full max-w-lg">
            <h1 className="mb-3 text-h2 font-bold md:mb-4">
              Services we offer
            </h1>
            <p className="text-medium">
              We build, renovate, and maintain properties across the Salaspils
              area. Our equipment rental keeps your own projects moving without
              buying machines you will use once.
            </p>
          </div>
          <div className="hidden flex-wrap items-center justify-end md:block">
            <Button title="View all" variant="secondary">
              View all
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
          <Card>
            <a
              href="#"
              className="flex size-full flex-col items-center justify-start"
            >
              <div className="relative w-full overflow-hidden pt-[66%]">
                <img
                  src="https://imagedelivery.net/RAP5LnVUMDfmG3LRL4kHtw/6e6c11ba-7e1c-49b1-1716-dfd753a11c01/2560?exp=1793232000&sig=ad1f4e7a3ba2e3f36ee1b74f13be54d98700ae7cf87fd1b2459e6c35e3d03540"
                  alt="Relume placeholder image 1"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="px-5 py-6 md:p-6">
                <a className="mb-2 block" href="#">
                  <h2 className="mb-2 text-h5 font-bold">
                    Facades and exterior cladding
                  </h2>
                </a>
                <p>
                  Thermowood, charred boards, and tongue-and-groove cladding
                  installed to last.
                </p>
              </div>
            </a>
          </Card>
          <Card>
            <a
              href="#"
              className="flex size-full flex-col items-center justify-start"
            >
              <div className="relative w-full overflow-hidden pt-[66%]">
                <img
                  src="https://imagedelivery.net/RAP5LnVUMDfmG3LRL4kHtw/048d4b04-c2c1-451a-7b97-1983dea2da01/2560?exp=1793232000&sig=5ab17ec0e289c86cbabf32a07a8bf2e010be0bf2b352a33744233cba92ebf0f1"
                  alt="Relume placeholder image 1"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="px-5 py-6 md:p-6">
                <a className="mb-2 block" href="#">
                  <h2 className="mb-2 text-h5 font-bold">
                    Property maintenance contracts
                  </h2>
                </a>
                <p>
                  Property maintenance contracts keep buildings sound through
                  every season.
                </p>
              </div>
            </a>
          </Card>
          <Card>
            <a
              href="#"
              className="flex size-full flex-col items-center justify-start"
            >
              <div className="relative w-full overflow-hidden pt-[66%]">
                <img
                  src="https://imagedelivery.net/RAP5LnVUMDfmG3LRL4kHtw/3337832a-de93-46a7-c59b-9e73adabc301/2560?exp=1793232000&sig=5030524bfcaa888286724253da861f3d8c14a62502914cbb0c96c54a0af2b812"
                  alt="Relume placeholder image 1"
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="px-5 py-6 md:p-6">
                <a className="mb-2 block" href="#">
                  <h2 className="mb-2 text-h5 font-bold">Equipment rental</h2>
                </a>
                <p>
                  Tractors, rebar tools, and more. Rent what you need and return
                  it.
                </p>
              </div>
            </a>
          </Card>
        </div>
        <Button
          title="See services"
          variant="secondary"
          className="mt-12 md:hidden"
        >
          See services
        </Button>
      </div>
    </section>
  );
}
