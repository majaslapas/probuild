"use client";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { KeyboardArrowDown } from "relume-icons";

const useRelume = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const openOnMobileDropdownMenu = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const openOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(true);
  };
  const closeOnDesktopDropdownMenu = () => {
    !isMobile && setIsDropdownOpen(false);
  };
  const animateMobileMenu = isMobileMenuOpen ? "open" : "close";
  const animateMobileMenuButtonSpan = isMobileMenuOpen
    ? ["open", "rotatePhase"]
    : "closed";
  const animateDropdownMenu = isDropdownOpen ? "open" : "close";
  const animateDropdownMenuIcon = isDropdownOpen ? "rotated" : "initial";
  return {
    toggleMobileMenu,
    openOnDesktopDropdownMenu,
    closeOnDesktopDropdownMenu,
    openOnMobileDropdownMenu,
    animateMobileMenu,
    animateMobileMenuButtonSpan,
    animateDropdownMenu,
    animateDropdownMenuIcon,
  };
};

export function Navbar10() {
  const useActive = useRelume();
  return (
    <section className="relative z-[999] flex min-h-16 w-full items-center bg-scheme-background px-[5%] md:min-h-18 scheme-1 alternate logo-alt">
      <div className="mx-auto flex size-full max-w-full items-center justify-between">
        <a href="#">
          <img
            src="https://d22po4pjz3o32e.cloudfront.net/logo-image.svg"
            alt="Logo image"
          />
        </a>
        <div className="absolute hidden h-screen overflow-auto border-b border-scheme-border bg-scheme-background px-[5%] pt-4 pb-24 md:pb-0 lg:static lg:ml-6 lg:flex lg:h-auto lg:flex-1 lg:items-center lg:justify-between lg:border-none lg:bg-none lg:px-0 lg:pt-0">
          <div className="flex flex-col items-center lg:flex-row">
            <a
              href="#"
              className="relative block w-auto py-3 text-base lg:inline-block lg:px-4 lg:py-6"
            >
              Home
            </a>
            <a
              href="#"
              className="relative block w-auto py-3 text-base lg:inline-block lg:px-4 lg:py-6"
            >
              Services
            </a>
            <a
              href="#"
              className="relative block w-auto py-3 text-base lg:inline-block lg:px-4 lg:py-6"
            >
              Equipment rental
            </a>
            <div
              onMouseEnter={useActive.openOnDesktopDropdownMenu}
              onMouseLeave={useActive.closeOnDesktopDropdownMenu}
            >
              <button
                className="relative flex w-full items-center justify-between py-3 text-base whitespace-nowrap lg:w-auto lg:justify-start lg:gap-2 lg:px-4 lg:py-6"
                onClick={useActive.openOnMobileDropdownMenu}
              >
                <span>Portfolio</span>
                <motion.span
                  animate={useActive.animateDropdownMenuIcon}
                  variants={{
                    rotated: { rotate: 180 },
                    initial: { rotate: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <KeyboardArrowDown className="text-scheme-text" />
                </motion.span>
              </button>
              <AnimatePresence>
                <motion.nav
                  variants={{
                    open: {
                      opacity: 1,
                      height: "var(--height-open, auto)",
                      display: "block",
                    },
                    close: {
                      opacity: 0,
                      height: "var(--height-close, 0)",
                      display: "none",
                    },
                  }}
                  animate={useActive.animateDropdownMenu}
                  initial="close"
                  exit="close"
                  transition={{ duration: 0.2 }}
                  className="top-full bottom-auto left-0 w-full max-w-full min-w-full overflow-hidden bg-scheme-background lg:absolute lg:w-screen lg:border-b lg:border-scheme-border lg:px-[5%] lg:[--height-close:auto]"
                >
                  <div className="mx-auto flex size-full max-w-full items-center justify-between">
                    <div className="flex w-full flex-col lg:flex-row">
                      <div className="w-full content-start py-4 sm:py-8 lg:max-w-[15rem] lg:pr-8">
                        <div className="grid auto-cols-fr auto-rows-max grid-cols-1 grid-rows-[max-content_max-content_max-content_max-content_max-content] gap-y-4">
                          <h4 className="text-small leading-[1.4] font-semibold md:leading-[1.3]">
                            About us
                          </h4>
                          <a href="#">Contact</a>
                          <a href="#">Home</a>
                          <a href="#">Services</a>
                          <a href="#">Equipment rental</a>
                          <a href="#">Portfolio</a>
                        </div>
                      </div>
                      <div className="relative flex w-full flex-wrap items-start justify-center pb-6 lg:items-stretch lg:pt-6">
                        <div className="grid w-full auto-cols-max auto-rows-max grid-cols-1 grid-rows-[max-content] gap-x-12 gap-y-8 sm:grid-cols-2 lg:gap-y-2">
                          <a
                            href="#"
                            className="flex flex-col items-start gap-y-4 py-2 sm:flex-row lg:gap-x-6"
                          >
                            <div className="flex w-full flex-1 shrink-0 basis-[40%] overflow-hidden">
                              <img
                                src="https://d1p38huyj6upaa.cloudfront.net/default-18.jpg"
                                alt="Relume placeholder image 1"
                                className="aspect-3/2 size-full rounded-image object-cover"
                              />
                            </div>
                            <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                              <h5 className="mb-1 font-semibold">About us</h5>
                              <p className="text-small">Contact</p>
                              <Button
                                title="Home"
                                variant="link"
                                size="link"
                                className="mt-2 w-fit text-small underline"
                              >
                                Home
                              </Button>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex flex-col items-start gap-y-4 py-2 sm:flex-row lg:gap-x-6"
                          >
                            <div className="flex w-full flex-1 shrink-0 basis-[40%] overflow-hidden">
                              <img
                                src="https://d1p38huyj6upaa.cloudfront.net/default-34.jpg"
                                alt="Relume placeholder image 2"
                                className="aspect-3/2 size-full rounded-image object-cover"
                              />
                            </div>
                            <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                              <h5 className="mb-1 font-semibold">Services</h5>
                              <p className="text-small">Equipment rental</p>
                              <Button
                                title="Portfolio"
                                variant="link"
                                size="link"
                                className="mt-2 w-fit text-small underline"
                              >
                                Portfolio
                              </Button>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex flex-col items-start gap-y-4 py-2 sm:flex-row lg:gap-x-6"
                          >
                            <div className="flex w-full flex-1 shrink-0 basis-[40%] overflow-hidden">
                              <img
                                src="https://d1p38huyj6upaa.cloudfront.net/default-43.jpg"
                                alt="Relume placeholder image 3"
                                className="aspect-3/2 size-full rounded-image object-cover"
                              />
                            </div>
                            <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                              <h5 className="mb-1 font-semibold">About us</h5>
                              <p className="text-small">Contact</p>
                              <Button
                                title="Home"
                                variant="link"
                                size="link"
                                className="mt-2 w-fit text-small underline"
                              >
                                Home
                              </Button>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex flex-col items-start gap-y-4 py-2 sm:flex-row lg:gap-x-6"
                          >
                            <div className="flex w-full flex-1 shrink-0 basis-[40%] overflow-hidden">
                              <img
                                src="https://d1p38huyj6upaa.cloudfront.net/default-47.jpg"
                                alt="Relume placeholder image 4"
                                className="aspect-3/2 size-full rounded-image object-cover"
                              />
                            </div>
                            <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                              <h5 className="mb-1 font-semibold">Services</h5>
                              <p className="text-small">Equipment rental</p>
                              <Button
                                title="Portfolio"
                                variant="link"
                                size="link"
                                className="mt-2 w-fit text-small underline"
                              >
                                Portfolio
                              </Button>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex flex-col items-start gap-y-4 py-2 sm:flex-row lg:gap-x-6"
                          >
                            <div className="flex w-full flex-1 shrink-0 basis-[40%] overflow-hidden">
                              <img
                                src="https://d1p38huyj6upaa.cloudfront.net/default-16.jpg"
                                alt="Relume placeholder image 5"
                                className="aspect-3/2 size-full rounded-image object-cover"
                              />
                            </div>
                            <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                              <h5 className="mb-1 font-semibold">About us</h5>
                              <p className="text-small">Contact</p>
                              <Button
                                title="Home"
                                variant="link"
                                size="link"
                                className="mt-2 w-fit text-small underline"
                              >
                                Home
                              </Button>
                            </div>
                          </a>
                          <a
                            href="#"
                            className="flex flex-col items-start gap-y-4 py-2 sm:flex-row lg:gap-x-6"
                          >
                            <div className="flex w-full flex-1 shrink-0 basis-[40%] overflow-hidden">
                              <img
                                src="https://d1p38huyj6upaa.cloudfront.net/default-45.jpg"
                                alt="Relume placeholder image 6"
                                className="aspect-3/2 size-full rounded-image object-cover"
                              />
                            </div>
                            <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                              <h5 className="mb-1 font-semibold">Services</h5>
                              <p className="text-small">Equipment rental</p>
                              <Button
                                title="Portfolio"
                                variant="link"
                                size="link"
                                className="mt-2 w-fit text-small underline"
                              >
                                Portfolio
                              </Button>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.nav>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button title="About us" variant="secondary" size="sm">
              About us
            </Button>
            <Button title="Contact" size="sm">
              Contact
            </Button>
          </div>
        </div>
        <button
          className="-mr-2 flex size-12 cursor-pointer flex-col items-center justify-center lg:hidden"
          onClick={useActive.toggleMobileMenu}
        >
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-scheme-text"
            animate={useActive.animateMobileMenuButtonSpan}
            variants={{
              open: { translateY: 8, transition: { delay: 0.1 } },
              rotatePhase: { rotate: -45, transition: { delay: 0.2 } },
              closed: {
                translateY: 0,
                rotate: 0,
                transition: { duration: 0.2 },
              },
            }}
          />
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-scheme-text"
            animate={useActive.animateMobileMenu}
            variants={{
              open: { width: 0, transition: { duration: 0.1 } },
              closed: {
                width: "1.5rem",
                transition: { delay: 0.3, duration: 0.2 },
              },
            }}
          />
          <motion.span
            className="my-[3px] h-0.5 w-6 bg-scheme-text"
            animate={useActive.animateMobileMenuButtonSpan}
            variants={{
              open: { translateY: -8, transition: { delay: 0.1 } },
              rotatePhase: { rotate: 45, transition: { delay: 0.2 } },
              closed: {
                translateY: 0,
                rotate: 0,
                transition: { duration: 0.2 },
              },
            }}
          />
        </button>
      </div>
      <AnimatePresence>
        <motion.div
          variants={{ open: { height: "100dvh" }, close: { height: "auto" } }}
          animate={useActive.animateMobileMenu}
          initial="close"
          exit="close"
          className="absolute top-full right-0 left-0 w-full overflow-hidden lg:hidden"
          transition={{ duration: 0.4 }}
        >
          <motion.div
            variants={{ open: { y: 0 }, close: { y: "-100%" } }}
            animate={useActive.animateMobileMenu}
            initial="close"
            exit="close"
            transition={{ duration: 0.4 }}
            className="absolute top-0 right-0 left-0 block h-dvh overflow-auto border-b border-scheme-border bg-scheme-background px-[5%] pt-4 pb-8"
          >
            <div className="flex flex-col">
              <a
                href="#"
                className="relative block w-auto py-3 text-base lg:inline-block lg:px-4 lg:py-6"
              >
                Link One
              </a>
              <a
                href="#"
                className="relative block w-auto py-3 text-base lg:inline-block lg:px-4 lg:py-6"
              >
                Link Two
              </a>
              <a
                href="#"
                className="relative block w-auto py-3 text-base lg:inline-block lg:px-4 lg:py-6"
              >
                Link Three
              </a>
              <div>
                <p
                  role="button"
                  className="relative flex w-full items-center justify-between py-3 text-base whitespace-nowrap lg:w-auto lg:justify-start lg:gap-2 lg:px-4 lg:py-6"
                  onClick={useActive.openOnMobileDropdownMenu}
                >
                  Link Four
                  <motion.span
                    animate={useActive.animateDropdownMenuIcon}
                    variants={{
                      rotated: { rotate: 180 },
                      initial: { rotate: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <KeyboardArrowDown className="text-scheme-text" />
                  </motion.span>
                </p>
                <AnimatePresence>
                  <motion.nav
                    variants={{
                      open: {
                        opacity: 1,
                        height: "var(--height-open, auto)",
                        display: "block",
                      },
                      close: {
                        opacity: 0,
                        height: "var(--height-close, 0)",
                        display: "none",
                      },
                    }}
                    animate={useActive.animateDropdownMenu}
                    initial="close"
                    exit="close"
                    transition={{ duration: 0.2 }}
                    className="top-full bottom-auto left-0 w-full max-w-full min-w-full overflow-hidden bg-scheme-background lg:absolute lg:w-screen lg:border-b lg:border-scheme-border lg:px-[5%] lg:[--height-close:auto]"
                  >
                    <div className="mx-auto flex size-full max-w-full items-center justify-between">
                      <div className="flex w-full flex-col lg:flex-row">
                        <div className="w-full content-start py-4 sm:py-8 lg:max-w-[15rem] lg:pr-8">
                          <div className="grid auto-cols-fr auto-rows-max grid-cols-1 grid-rows-[max-content_max-content_max-content_max-content_max-content] gap-y-4">
                            <h4 className="text-small leading-[1.4] font-semibold md:leading-[1.3]">
                              Blog categories
                            </h4>
                            <a href="#">Category One</a>
                            <a href="#">Category Two</a>
                            <a href="#">Category Three</a>
                            <a href="#">Category Four</a>
                            <a href="#">Category Five</a>
                          </div>
                        </div>
                        <div className="relative flex w-full flex-wrap items-start justify-center pb-6 lg:items-stretch lg:pt-6">
                          <div className="grid w-full auto-cols-max auto-rows-max grid-cols-1 grid-rows-[max-content] gap-x-12 gap-y-8 sm:grid-cols-2 lg:gap-y-2">
                            <a
                              href="#"
                              className="grid max-w-full auto-cols-fr grid-cols-1 items-start gap-x-6 gap-y-4 py-2 lg:grid-cols-[0.5fr_1fr] lg:gap-y-0"
                            >
                              <div className="relative flex w-full flex-col pt-[66.6%] lg:flex-row">
                                <img
                                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                                  alt="Relume placeholder image 1"
                                  className="absolute inset-0 size-full rounded-image object-cover"
                                />
                              </div>
                              <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                                <p className="mb-1 font-semibold">
                                  Article Title
                                </p>
                                <p className="text-small">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit
                                </p>
                                <Button
                                  title="Read more"
                                  variant="link"
                                  size="link"
                                  className="mt-2 w-fit text-small underline"
                                >
                                  Read more
                                </Button>
                              </div>
                            </a>
                            <a
                              href="#"
                              className="grid max-w-full auto-cols-fr grid-cols-1 items-start gap-x-6 gap-y-4 py-2 lg:grid-cols-[0.5fr_1fr] lg:gap-y-0"
                            >
                              <div className="relative flex w-full flex-col pt-[66.6%] lg:flex-row">
                                <img
                                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                                  alt="Relume placeholder image 2"
                                  className="absolute inset-0 size-full rounded-image object-cover"
                                />
                              </div>
                              <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                                <p className="mb-1 font-semibold">
                                  Article Title
                                </p>
                                <p className="text-small">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit
                                </p>
                                <Button
                                  title="Read more"
                                  variant="link"
                                  size="link"
                                  className="mt-2 w-fit text-small underline"
                                >
                                  Read more
                                </Button>
                              </div>
                            </a>
                            <a
                              href="#"
                              className="grid max-w-full auto-cols-fr grid-cols-1 items-start gap-x-6 gap-y-4 py-2 lg:grid-cols-[0.5fr_1fr] lg:gap-y-0"
                            >
                              <div className="relative flex w-full flex-col pt-[66.6%] lg:flex-row">
                                <img
                                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                                  alt="Relume placeholder image 3"
                                  className="absolute inset-0 size-full rounded-image object-cover"
                                />
                              </div>
                              <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                                <p className="mb-1 font-semibold">
                                  Article Title
                                </p>
                                <p className="text-small">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit
                                </p>
                                <Button
                                  title="Read more"
                                  variant="link"
                                  size="link"
                                  className="mt-2 w-fit text-small underline"
                                >
                                  Read more
                                </Button>
                              </div>
                            </a>
                            <a
                              href="#"
                              className="grid max-w-full auto-cols-fr grid-cols-1 items-start gap-x-6 gap-y-4 py-2 lg:grid-cols-[0.5fr_1fr] lg:gap-y-0"
                            >
                              <div className="relative flex w-full flex-col pt-[66.6%] lg:flex-row">
                                <img
                                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                                  alt="Relume placeholder image 4"
                                  className="absolute inset-0 size-full rounded-image object-cover"
                                />
                              </div>
                              <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                                <p className="mb-1 font-semibold">
                                  Article Title
                                </p>
                                <p className="text-small">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit
                                </p>
                                <Button
                                  title="Read more"
                                  variant="link"
                                  size="link"
                                  className="mt-2 w-fit text-small underline"
                                >
                                  Read more
                                </Button>
                              </div>
                            </a>
                            <a
                              href="#"
                              className="grid max-w-full auto-cols-fr grid-cols-1 items-start gap-x-6 gap-y-4 py-2 lg:grid-cols-[0.5fr_1fr] lg:gap-y-0"
                            >
                              <div className="relative flex w-full flex-col pt-[66.6%] lg:flex-row">
                                <img
                                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                                  alt="Relume placeholder image 5"
                                  className="absolute inset-0 size-full rounded-image object-cover"
                                />
                              </div>
                              <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                                <p className="mb-1 font-semibold">
                                  Article Title
                                </p>
                                <p className="text-small">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit
                                </p>
                                <Button
                                  title="Read more"
                                  variant="link"
                                  size="link"
                                  className="mt-2 w-fit text-small underline"
                                >
                                  Read more
                                </Button>
                              </div>
                            </a>
                            <a
                              href="#"
                              className="grid max-w-full auto-cols-fr grid-cols-1 items-start gap-x-6 gap-y-4 py-2 lg:grid-cols-[0.5fr_1fr] lg:gap-y-0"
                            >
                              <div className="relative flex w-full flex-col pt-[66.6%] lg:flex-row">
                                <img
                                  src="https://d22po4pjz3o32e.cloudfront.net/placeholder-image-landscape.svg"
                                  alt="Relume placeholder image 6"
                                  className="absolute inset-0 size-full rounded-image object-cover"
                                />
                              </div>
                              <div className="flex w-full flex-col justify-center self-center lg:w-auto">
                                <p className="mb-1 font-semibold">
                                  Article Title
                                </p>
                                <p className="text-small">
                                  Lorem ipsum dolor sit amet, consectetur
                                  adipiscing elit
                                </p>
                                <Button
                                  title="Read more"
                                  variant="link"
                                  size="link"
                                  className="mt-2 w-fit text-small underline"
                                >
                                  Read more
                                </Button>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.nav>
                </AnimatePresence>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <Button title="Button" variant="secondary" size="sm">
                  Button
                </Button>
                <Button title="Button" size="sm">
                  Button
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
