"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { ChevronRight, RelumeIcon } from "relume-icons";

export function Layout207() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-2 btn-light alternate logo-alt">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-x-20">
          <div className="order-2 md:order-1">
            <img
              src="https://imagedelivery.net/RAP5LnVUMDfmG3LRL4kHtw/2fba94b1-a64c-4e96-8466-19f34e4b4f01/2560?exp=1793232000&sig=daf28418d6ceec2407cf408b9f1beb7a0b5141a9a0513671b643b32c734225c8"
              className="w-full rounded-image object-cover"
              alt="Relume placeholder image"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="mb-3 font-semibold md:mb-4">About us</p>
            <h2 className="mb-5 text-h2 font-bold md:mb-6">
              Work that holds up under pressure
            </h2>
            <p className="mb-5 text-medium md:mb-6">
              We do the job right the first time. No shortcuts, no surprises,
              just work that lasts. We do the job right the first time. No
              shortcuts, no surprises, just work that lasts.
            </p>
            <div className="grid grid-cols-1 gap-4 py-2">
              <div className="flex self-start">
                <div className="mr-4 flex-none self-start">
                  <RelumeIcon className="size-6 text-scheme-text" />
                </div>
                <p>Tools ready when you need them</p>
              </div>
              <div className="flex self-start">
                <div className="mr-4 flex-none self-start">
                  <RelumeIcon className="size-6 text-scheme-text" />
                </div>
                <p>Local crew from Salaspils</p>
              </div>
              <div className="flex self-start">
                <div className="mr-4 flex-none self-start">
                  <RelumeIcon className="size-6 text-scheme-text" />
                </div>
                <p>On time and on budget</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              <Button title="About us" variant="secondary">
                About us
              </Button>
              <Button
                title="Contact"
                variant="link"
                size="link"
                iconRight={<ChevronRight className="text-scheme-text" />}
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
