---
name: "ProBuildGroup"
theme: "dark"

colors:
  neutral:
    shade-0: "#FFFFFF"
    shade-1: "#F2F2F2"
    shade-2: "#D8D8D8"
    shade-3: "#B2B2B2"
    shade-4: "#7F7F7F"
    shade-5: "#4C4C4C"
    shade-6: "#191919"
    shade-7: "#000000"
    white: "#FFFFFF"
  christine:
    shade-1: "#FDEFE6"
    shade-2: "#FCDFCE"
    shade-3: "#F58F54"
    shade-4: "#F2600C"
    shade-5: "#C14C09"
    shade-6: "#602604"
    shade-7: "#481C03"
  cello:
    shade-1: "#E8EBEF"
    shade-2: "#D2D7DF"
    shade-3: "#62758F"
    shade-4: "#1F3A5F"
    shade-5: "#182E4C"
    shade-6: "#0C1726"
    shade-7: "#09111C"

typography:
  heading:
    fontFamily: "Martian Mono"
    fontWeight: 500
  body:
    fontFamily: "Noto Sans"
    fontWeight: 400
  sizes:
    desktop:
      h1: 56px
      h2: 48px
      h3: 40px
      h4: 32px
      h5: 24px
      h6: 20px
      text-large: 20px
      text-medium: 18px
      text-regular: 16px
      text-small: 14px
      text-tiny: 12px
    mobile:
      h1: 40px
      h2: 36px
      h3: 32px
      h4: 24px
      h5: 20px
      h6: 18px
      text-large: 18px
      text-medium: 16px
      text-regular: 14px
      text-small: 12px
      text-tiny: 10px

ui:
  style: "default"
  buttonRadius: 100px
  tagRadius: 100px
  inputRadius: 12px

cards:
  style: "flat"
  borderWidth: 0px
  dividerWidth: 1px
  radiusLarge: 16px
  radiusMedium: 16px
  radiusSmall: 16px

schemes:
  - name: "Scheme 1"
    background: "neutral-shade-7"
    backgroundHex: "#000000"
    foregroundHex: "#191919"
    textHex: "#ffffff"
    accentHex: "#ffffff"
    borderValue: "#ffffff33"
    useLogoVariant: dark
    cssClass: "scheme-1"
  - name: "Scheme 2"
    background: "neutral-shade-6"
    backgroundHex: "#191919"
    foregroundHex: "#000000"
    textHex: "#ffffff"
    accentHex: "#ffffff"
    borderValue: "#ffffff33"
    useLogoVariant: dark
    cssClass: "scheme-2"
  - name: "Scheme 3"
    background: "chromatic1-shade-4"
    backgroundHex: "#F2600C"
    foregroundHex: "#C14C09"
    textHex: "#ffffff"
    accentHex: "#ffffff"
    borderValue: "#ffffff33"
    useLogoVariant: dark
    cssClass: "scheme-3"
---

# ProBuildGroup — Design Specification

This file contains machine-readable design tokens in the YAML frontmatter above, and human-readable guidance below.

## Colors

The design uses a **dark** theme with a neutral palette and 2 chromatic palettes.

- **Neutral shades** range from shade-0 (darkest) to shade-7 (lightest), plus white
- **Christine** — primary shade: `#F2600C`
- **Cello** — primary shade: `#1F3A5F`

Use the CSS custom properties from `react/globals.css` for all colors (e.g. `--color-neutral-darkest`, `--color-blue-ribbon`).

## Typography

Headings use **Martian Mono** at weight 500. Body text uses **Noto Sans** at weight 400.

The type scale has desktop and mobile sizes. Apply mobile sizes at smaller breakpoints. All values are in `react/globals.css`.

## UI Elements

UI style is **default** with button radius 100px. Cards use the **flat** style with border-width 0px.

## Color Schemes

Sections use color schemes to control their visual appearance. Each scheme is derived from a single background color — all other colors (text, foreground, accent, border) are automatically computed for optimal contrast.

| Scheme | Background | Text | Accent | Logo | CSS class |
|--------|-----------|------|--------|------|-----------|
| Scheme 1 | Neutral Darkest (#000000) | #ffffff | #ffffff | dark | `.scheme-1` |
| Scheme 2 | Neutral Darker (#191919) | #ffffff | #ffffff | dark | `.scheme-2` |
| Scheme 3 | Christine (#F2600C) | #ffffff | #ffffff | dark | `.scheme-3` |

Apply a scheme by adding its CSS class to the section element. See `sitemap.md` for which scheme each section uses.

### Tweaking Schemes

To create visual variation, you can change which scheme a section uses. When switching schemes:

- Swap the CSS class (e.g. change `.scheme-1` to `.scheme-2`)
- All child elements automatically inherit the correct text, accent, and border colors
- Use the matching logo variant (`logo-light.svg` or `logo-dark.svg`) based on the scheme's `useLogoVariant`
- Alternate between light and dark schemes to create visual rhythm
