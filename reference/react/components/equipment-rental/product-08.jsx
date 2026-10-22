"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export function Product8() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <div className="mb-12 grid grid-cols-1 items-end gap-12 md:mb-18 md:grid-cols-[1fr_max-content] lg:mb-20 lg:gap-20">
          <div className="max-w-lg">
            <p className="mb-3 font-semibold md:mb-4">Rental</p>
            <h1 className="mb-3 text-h2 font-bold md:mb-4">Equipment</h1>
            <p className="text-medium">
              Good tools do not ask for praise. They do the work.
            </p>
          </div>
          <div className="hidden md:flex">
            <Button variant="secondary" title="View all">
              View all
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 justify-items-start gap-x-5 gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3 lg:gap-x-12">
          <div>
            <a className="mb-3 block aspect-[5/6] md:mb-4">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-full rounded-image object-cover"
              />
            </a>
            <a className="flex justify-between text-medium">
              <div className="mr-4">
                <p className="font-semibold">Tractor with front loader</p>
                <p className="text-small">Daily</p>
              </div>
              <p className="text-large font-semibold">$120</p>
            </a>
            <Button
              variant="secondary"
              size="sm"
              title="Send request"
              className="mt-3 w-full md:mt-4"
            >
              Send request
            </Button>
          </div>
          <div>
            <a className="mb-3 block aspect-[5/6] md:mb-4">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-full rounded-image object-cover"
              />
            </a>
            <a className="flex justify-between text-medium">
              <div className="mr-4">
                <p className="font-semibold">Rebar cutting tool</p>
                <p className="text-small">Daily</p>
              </div>
              <p className="text-large font-semibold">$35</p>
            </a>
            <Button
              variant="secondary"
              size="sm"
              title="Send request"
              className="mt-3 w-full md:mt-4"
            >
              Send request
            </Button>
          </div>
          <div>
            <a className="mb-3 block aspect-[5/6] md:mb-4">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-full rounded-image object-cover"
              />
            </a>
            <a className="flex justify-between text-medium">
              <div className="mr-4">
                <p className="font-semibold">Concrete mixer</p>
                <p className="text-small">Daily</p>
              </div>
              <p className="text-large font-semibold">$45</p>
            </a>
            <Button
              variant="secondary"
              size="sm"
              title="Send request"
              className="mt-3 w-full md:mt-4"
            >
              Send request
            </Button>
          </div>
          <div>
            <a className="mb-3 block aspect-[5/6] md:mb-4">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-full rounded-image object-cover"
              />
            </a>
            <a className="flex justify-between text-medium">
              <div className="mr-4">
                <p className="font-semibold">Scaffolding set</p>
                <p className="text-small">Weekly</p>
              </div>
              <p className="text-large font-semibold">$80</p>
            </a>
            <Button
              variant="secondary"
              size="sm"
              title="Send request"
              className="mt-3 w-full md:mt-4"
            >
              Send request
            </Button>
          </div>
          <div>
            <a className="mb-3 block aspect-[5/6] md:mb-4">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-full rounded-image object-cover"
              />
            </a>
            <a className="flex justify-between text-medium">
              <div className="mr-4">
                <p className="font-semibold">Rotary hammer drill</p>
                <p className="text-small">Daily</p>
              </div>
              <p className="text-large font-semibold">$25</p>
            </a>
            <Button
              variant="secondary"
              size="sm"
              title="Send request"
              className="mt-3 w-full md:mt-4"
            >
              Send request
            </Button>
          </div>
          <div>
            <a className="mb-3 block aspect-[5/6] md:mb-4">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image"
                className="size-full rounded-image object-cover"
              />
            </a>
            <a className="flex justify-between text-medium">
              <div className="mr-4">
                <p className="font-semibold">Plate compactor</p>
                <p className="text-small">Daily</p>
              </div>
              <p className="text-large font-semibold">$55</p>
            </a>
            <Button
              variant="secondary"
              size="sm"
              title="Send request"
              className="mt-3 w-full md:mt-4"
            >
              Send request
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
