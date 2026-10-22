"use client"

import React from "react";
import { PortfolioHeader12 } from "@/components/portfolio-project/portfolio-header-12";
import { Content12 } from "@/components/portfolio-project/content-12";
import { Gallery9 } from "@/components/portfolio-project/gallery-09";
import { Contact5 } from "@/components/portfolio-project/contact-05";


export default function Page() {
  return (
    <div>
      <PortfolioHeader12 />
      <Content12 />
      <Gallery9 />
      <Contact5 />
    </div>
  );
}
