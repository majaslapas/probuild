"use client";

import React from "react";
import { Call, LocationOn, Mail, Sms } from "relume-icons";

export function Contact22() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <div className="grid auto-cols-fr gap-x-8 gap-y-12 sm:gap-x-10 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4">
          <div>
            <div className="mb-5 sm:mb-6">
              <Mail className="size-12 text-scheme-text" />
            </div>
            <h3 className="mb-3 text-h4 font-bold sm:mb-4 lg:mb-4">Email</h3>
            <p className="mb-5 md:mb-6">Send us the details</p>
            <a className="underline" href="#">
              info@probuildgroup.lv
            </a>
          </div>
          <div>
            <div className="mb-5 sm:mb-6">
              <Sms className="size-12 text-scheme-text" />
            </div>
            <h3 className="mb-3 text-h4 font-bold sm:mb-4 lg:mb-4">Phone</h3>
            <p className="mb-5 md:mb-6">Call us directly</p>
            <a className="underline" href="#">
              +371 200 000 00
            </a>
          </div>
          <div>
            <div className="mb-5 sm:mb-6">
              <Call className="size-12 text-scheme-text" />
            </div>
            <h3 className="mb-3 text-h4 font-bold sm:mb-4 lg:mb-4">Office</h3>
            <p className="mb-5 md:mb-6">Salaspils area, Latvia</p>
            <a className="underline" href="#">
              +1 (555) 000-0000
            </a>
          </div>
          <div>
            <div className="mb-5 sm:mb-6">
              <LocationOn className="size-12 text-scheme-text" />
            </div>
            <h3 className="mb-3 text-h4 font-bold sm:mb-4 lg:mb-4">Office</h3>
            <p className="mb-5 md:mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in ero.
            </p>
            <a className="underline" href="#">
              Salaspils area, Latvia
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
