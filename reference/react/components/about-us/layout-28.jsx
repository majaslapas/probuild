"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoIframe } from "@/components/ui/video-iframe";
import React from "react";
import { PlayCircle } from "relume-icons";

export function Layout28() {
  return (
    <section className="px-[5%] py-16 md:py-24 lg:py-28 scheme-3 alternate logo-alt">
      <div className="container">
        <Tabs
          defaultValue="tab-1"
          className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20"
        >
          <TabsList className="col-start-1 col-end-2 row-start-1 row-end-2 grid grid-cols-1 items-center gap-x-4">
            <TabsTrigger
              value="tab-1"
              className="flex-col items-start justify-start rounded-none border-0 border-l py-4 pr-0 pl-6 text-left whitespace-normal data-[state=active]:border-scheme-text data-[state=active]:bg-transparent md:pl-8"
            >
              <div>
                <h3 className="mb-3 text-h4 font-bold md:mb-4">
                  One crew, one call
                </h3>
                <p>
                  No chasing subcontractors. We handle the work from foundation
                  to finish with our own people and our own equipment.
                </p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="flex-col items-start justify-start rounded-none border-0 border-l py-4 pr-0 pl-6 text-left whitespace-normal data-[state=active]:border-scheme-text data-[state=active]:bg-transparent md:pl-8"
            >
              <div>
                <h3 className="mb-3 text-h4 font-bold md:mb-4">
                  Honest pricing upfront
                </h3>
                <p>
                  You get a clear estimate before we start. The price we agree
                  on is the price you pay.
                </p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="flex-col items-start justify-start rounded-none border-0 border-l py-4 pr-0 pl-6 text-left whitespace-normal data-[state=active]:border-scheme-text data-[state=active]:bg-transparent md:pl-8"
            >
              <div>
                <h3 className="mb-3 text-h4 font-bold md:mb-4">
                  Work that holds
                </h3>
                <p>
                  We build for Latvian winters and long years. No shortcuts, no
                  materials that fail in the first frost.
                </p>
              </div>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center justify-center overflow-hidden">
            <TabsContent
              value="tab-1"
              className="data-[state=active]:animate-tabs"
            >
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 1"
                className="size-full rounded-image object-cover"
              />
            </TabsContent>
            <TabsContent
              value="tab-2"
              className="data-[state=active]:animate-tabs"
            >
              <Dialog>
                <DialogTrigger className="relative flex w-full items-center justify-center overflow-hidden rounded-image">
                  <img
                    src="https://d22po4pjz3o32e.cloudfront.net/placeholder-video-thumbnail.svg"
                    alt="Relume placeholder image 2"
                    className="size-full object-cover"
                  />
                  <PlayCircle className="absolute z-20 size-20 text-white" />
                  <span className="absolute inset-0 z-10 bg-neutral-darkest/50" />
                </DialogTrigger>
                <DialogContent>
                  <VideoIframe video="https://www.youtube.com/embed/8DKLYsikxTs?si=Ch9W0KrDWWUiCMMW" />
                </DialogContent>
              </Dialog>
            </TabsContent>
            <TabsContent
              value="tab-3"
              className="data-[state=active]:animate-tabs"
            >
              <img
                src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                alt="Relume placeholder image 3"
                className="size-full rounded-image object-cover"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
