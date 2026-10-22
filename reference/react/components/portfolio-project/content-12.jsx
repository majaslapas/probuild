"use client";

import React, { Fragment } from "react";

export function Content12() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container max-w-lg">
        <div className="mb-8 grid grid-cols-2 gap-6 md:mb-10 md:grid-cols-4 md:gap-8 lg:mb-12">
          <div>
            <h3 className="mb-2 text-h6 font-bold">Work</h3>
            <p>Full scope</p>
          </div>
          <div>
            <h3 className="mb-2 text-h6 font-bold">Duration</h3>
            <p>Four months</p>
          </div>
          <div>
            <h3 className="mb-2 text-h6 font-bold">Materials</h3>
            <p>Local timber</p>
          </div>
          <div>
            <h3 className="mb-2 text-h6 font-bold">Area</h3>
            <p>120 m²</p>
          </div>
        </div>
        <div className="prose-base max-w-full prose-p:m-0 prose-p:mb-4 prose-p:leading-[1.5]">
          <Fragment>
            <p>
              Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
              id scelerisque est ultricies ultricies. Duis est sit sed leo nisl,
              blandit elit sagittis. Quisque tristique consequat quam sed. Nisl
              at scelerisque amet nulla purus habitasse.
            </p>
            <p>
              Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas
              condimentum mi massa. In tincidunt pharetra consectetur sed duis
              facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit
              dictum eget nibh tortor commodo cursus.
            </p>
            <p>
              Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce
              aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare
              id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur
              dictum. Donec posuere pharetra odio consequat scelerisque et, nunc
              tortor. Nulla adipiscing erat a erat. Condimentum lorem posuere
              gravida enim posuere cursus diam.
            </p>
          </Fragment>
        </div>
      </div>
    </section>
  );
}
