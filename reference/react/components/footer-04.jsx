"use client";

import React from "react";
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
  YoutubeLogo,
} from "relume-icons";

export function Footer4() {
  return (
    <footer className="px-[5%] py-12 md:py-18 lg:py-20 scheme-3 alternate logo-alt">
      <div className="container">
        <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-x-[4vw] gap-y-12 pb-12 md:pb-18 lg:grid-cols-[0.25fr_1fr_0.25fr] lg:justify-between lg:gap-y-4 lg:pb-20">
          <a href="#" className="lg:justify-self-start">
            <img
              src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
              alt="Logo image"
              className="inline-block"
            />
          </a>
          <ul className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-center gap-6 md:grid-flow-col md:grid-cols-[max-content] md:justify-center md:justify-items-start">
            <li className="font-semibold">
              <a href="#">Home</a>
            </li>
            <li className="font-semibold">
              <a href="#">Services</a>
            </li>
            <li className="font-semibold">
              <a href="#">Equipment Rental</a>
            </li>
            <li className="font-semibold">
              <a href="#">Portfolio</a>
            </li>
            <li className="font-semibold">
              <a href="#">Contact</a>
            </li>
          </ul>
          <div className="flex items-start justify-start justify-items-center gap-x-3 lg:justify-self-end">
            <a href="#">
              <FacebookLogo className="size-6 text-scheme-text" />
            </a>
            <a href="#">
              <InstagramLogo className="size-6 text-scheme-text" />
            </a>
            <a href="#">
              <XLogo className="size-6 p-0.5 text-scheme-text" />
            </a>
            <a href="#">
              <LinkedinLogo className="size-6 text-scheme-text" />
            </a>
            <a href="#">
              <YoutubeLogo className="size-6 text-scheme-text" />
            </a>
          </div>
        </div>
        <div className="h-px w-full bg-scheme-border" />
        <div className="flex flex-col-reverse items-start pt-6 pb-4 text-small md:flex-row md:items-center md:justify-center md:justify-items-center md:gap-x-6 md:pt-8 md:pb-0">
          <ul className="grid grid-flow-row grid-cols-[max-content] items-start gap-y-4 text-small md:grid-flow-col md:gap-x-6 md:gap-y-0">
            <p className="mt-4 md:mt-0">
              © 2025 ProBuildGroup. All rights reserved.
            </p>
            <a href="#" className="underline">
              Privacy Policy
            </a>
            <a href="#" className="underline">
              Terms of Service
            </a>
            <a href="#" className="underline">
              Cookies Settings
            </a>
          </ul>
        </div>
      </div>
    </footer>
  );
}
