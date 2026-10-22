"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { Fragment, useEffect, useState } from "react";

const Star = () => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const isFullStar = i < fullStars;
        const isHalfStar = hasHalfStar && i === fullStars;

        return (
          <div key={i}>
            {isFullStar ? (
              <StarFull className="text-scheme-text" />
            ) : isHalfStar ? (
              <StarHalf className="text-scheme-text" />
            ) : (
              <Star className="text-scheme-text" />
            )}
          </div>
        );
      })}
    </div>
  );
};

const useCarousel = () => {
  const [mainApi, setMainApi] = useState();
  const [thumbApi, setThumbApi] = useState();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!mainApi || !thumbApi) {
      return;
    }
    mainApi.on("select", () => {
      const index = mainApi.selectedScrollSnap();
      setCurrent(index);
      thumbApi.scrollTo(index);
    });
  }, [mainApi, thumbApi]);
  const handleClick = (index) => () => {
    return mainApi?.scrollTo(index);
  };
  const getThumbStyles = (index) => {
    return clsx("block", current === index && "opacity-60");
  };
  return {
    setMainApi,
    setThumbApi,
    handleClick,
    getThumbStyles,
  };
};

export function ProductHeader1() {
  const useActive = useCarousel();
  return (
    <header className="px-[5%] py-12 md:py-16 lg:py-20 scheme-3 alternate logo-alt">
      <div className="container">
        <Breadcrumb className="mb-6 flex flex-wrap items-center text-sm">
          <BreadcrumbList>
            <Fragment>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Equipment rental</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
            <Fragment>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Tractors</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
            <Fragment>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Front loader</BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 gap-y-8 md:gap-y-10 lg:grid-cols-[1.25fr_1fr] lg:gap-x-20">
          <div className="grid grid-cols-1 md:grid-cols-[5rem_1fr] md:gap-x-4">
            <div className="relative hidden h-full md:block">
              <div className="absolute top-0 bottom-0 max-h-full overflow-y-auto">
                <Carousel
                  setApi={useActive.setThumbApi}
                  orientation="vertical"
                  opts={{
                    align: "start",
                    containScroll: "keepSnaps",
                    dragFree: true,
                  }}
                  className="m-0"
                >
                  <CarouselContent className="m-0 gap-y-4">
                    <CarouselItem className="p-0">
                      <button
                        onClick={useActive.handleClick(0)}
                        className={useActive.getThumbStyles(0)}
                      >
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                          alt="Relume placeholder image 1"
                          className="aspect-[5/6] size-full rounded-image object-cover"
                        />
                      </button>
                    </CarouselItem>
                    <CarouselItem className="p-0">
                      <button
                        onClick={useActive.handleClick(1)}
                        className={useActive.getThumbStyles(1)}
                      >
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                          alt="Relume placeholder image 2"
                          className="aspect-[5/6] size-full rounded-image object-cover"
                        />
                      </button>
                    </CarouselItem>
                    <CarouselItem className="p-0">
                      <button
                        onClick={useActive.handleClick(2)}
                        className={useActive.getThumbStyles(2)}
                      >
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                          alt="Relume placeholder image 3"
                          className="aspect-[5/6] size-full rounded-image object-cover"
                        />
                      </button>
                    </CarouselItem>
                    <CarouselItem className="p-0">
                      <button
                        onClick={useActive.handleClick(3)}
                        className={useActive.getThumbStyles(3)}
                      >
                        <img
                          src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                          alt="Relume placeholder image 4"
                          className="aspect-[5/6] size-full rounded-image object-cover"
                        />
                      </button>
                    </CarouselItem>
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
            <div className="overflow-hidden">
              <Carousel
                setApi={useActive.setMainApi}
                opts={{ loop: true, align: "start" }}
                className="m-0"
              >
                <CarouselContent className="m-0">
                  <CarouselItem className="basis-full pl-0">
                    <button>
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                        alt="Relume placeholder image 1"
                        className="aspect-[5/6] size-full rounded-image object-cover"
                      />
                    </button>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-0">
                    <button>
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                        alt="Relume placeholder image 2"
                        className="aspect-[5/6] size-full rounded-image object-cover"
                      />
                    </button>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-0">
                    <button>
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                        alt="Relume placeholder image 3"
                        className="aspect-[5/6] size-full rounded-image object-cover"
                      />
                    </button>
                  </CarouselItem>
                  <CarouselItem className="basis-full pl-0">
                    <button>
                      <img
                        src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg"
                        alt="Relume placeholder image 4"
                        className="aspect-[5/6] size-full rounded-image object-cover"
                      />
                    </button>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          <div>
            <h1 className="mb-2 text-h3 font-bold">Front loader</h1>
            <h5 className="mb-5 text-h5 font-bold md:mb-6">$55</h5>
            <div className="mb-5 flex flex-wrap items-center gap-3 md:mb-6">
              <Star rating={3.5} />
              <p className="text-small">(3.5 stars) • 10 reviews</p>
            </div>
            <p className="mb-5 md:mb-6">
              A compact tractor with a front loader. It moves earth, gravel, and
              snow without complaint. It is ready for the next job.
            </p>
            <form className="mb-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                  <Label className="mb-2">Options</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-choice">Option One</SelectItem>
                      <SelectItem value="second-choice">Option Two</SelectItem>
                      <SelectItem value="third-choice">Option Three</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <Label className="mb-2">Options</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      className="px-4 py-2"
                      asChild={true}
                      title="One day"
                      url="#"
                    >
                      <a href="#" className="">
                        One day
                      </a>
                    </Button>
                    <Button
                      className="px-4 py-2"
                      asChild={true}
                      title="One week"
                      url="#"
                      variant="secondary"
                    >
                      <a href="#" className="">
                        One week
                      </a>
                    </Button>
                    <Button
                      className="px-4 py-2"
                      asChild={true}
                      title="One month"
                      url="#"
                      variant="secondary"
                      disabled={true}
                    >
                      <a href="#" className="pointer-events-none opacity-25">
                        One month
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="quantity" className="mb-2">
                    Quantity
                  </Label>
                  <Input
                    type="number"
                    id="quantity"
                    placeholder="1"
                    className="w-16"
                  />
                </div>
              </div>
              <div className="mt-8 mb-4 flex flex-col gap-y-4">
                <Button title="Send request">Send request</Button>
                <Button title="Rent now" variant="secondary">
                  Rent now
                </Button>
              </div>
              <p className="text-center text-tiny">
                Delivery available in Salaspils
              </p>
            </form>
            <Accordion type="multiple">
              <AccordionItem value="item-0">
                <AccordionTrigger className="py-4 text-medium font-semibold [&_svg]:size-6">
                  Details
                </AccordionTrigger>
                <AccordionContent className="md:pb-6">
                  Return the machine clean and with a full tank. We inspect it
                  together before you leave. Damage beyond normal wear is billed
                  at cost.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-1">
                <AccordionTrigger className="py-4 text-medium font-semibold [&_svg]:size-6">
                  Shipping
                </AccordionTrigger>
                <AccordionContent className="md:pb-6">
                  Return the machine clean and with a full tank. We inspect it
                  together before you leave. Damage beyond normal wear is billed
                  at cost.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="py-4 text-medium font-semibold [&_svg]:size-6">
                  Returns
                </AccordionTrigger>
                <AccordionContent className="md:pb-6">
                  Return the machine clean and with a full tank. We inspect it
                  together before you leave. Damage beyond normal wear is billed
                  at cost.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </header>
  );
}
