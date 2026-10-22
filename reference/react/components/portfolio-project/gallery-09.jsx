"use client";

import React from "react";

export function Gallery9() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <div className="md:mb-18 mb-12 text-center lg:mb-20">
          <h2 className="text-h2 mb-5 font-bold md:mb-6">The work</h2>
          <p className="text-medium">
            Before and after. The bones and the finished house.
          </p>
        </div>
        <div className="grid auto-cols-fr grid-cols-2 grid-rows-2 gap-6 md:auto-cols-auto md:grid-cols-[2fr_1fr_1fr] md:gap-8">
          <a
            href="#"
            className="inline-block size-full col-start-1 col-end-2 row-start-1 row-end-3"
          >
            <div className="size-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="rounded-image aspect-square size-full object-cover"
              />
            </div>
          </a>
          <a href="#" className="inline-block size-full">
            <div className="size-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 2"
                className="rounded-image aspect-square size-full object-cover"
              />
            </div>
          </a>
          <a href="#" className="inline-block size-full">
            <div className="size-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 3"
                className="rounded-image aspect-square size-full object-cover"
              />
            </div>
          </a>
          <a href="#" className="inline-block size-full">
            <div className="size-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 4"
                className="rounded-image aspect-square size-full object-cover"
              />
            </div>
          </a>
          <a href="#" className="inline-block size-full">
            <div className="size-full">
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 5"
                className="rounded-image aspect-square size-full object-cover"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
