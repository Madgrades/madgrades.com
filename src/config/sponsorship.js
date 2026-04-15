import logoBlack from "../assets/sponsors/mechanize-black.svg";
import logoWhite from "../assets/sponsors/mechanize-white.svg";

/**
 * Active sponsor configuration. Set to null to disable all sponsor UI.
 *
 * Fields:
 *   name       - Display name shown in the footer
 *   url        - Link destination for all sponsor placements
 *   logoBlack  - Logo variant for light backgrounds
 *   logoWhite  - Logo variant for dark backgrounds
 *   storageKey - localStorage key for banner dismiss state
 *   callToAction - CTA link text in the banner
 *   taglines   - Array of rotating banner taglines (pick one at random)
 */

// eslint-disable-next-line no-unused-vars
const MECHANIZE = {
  name: "Mechanize, Inc.",
  url: "https://jobs.ashbyhq.com/mechanize?utm_source=UWMadison",
  logoBlack,
  logoWhite,
  storageKey: "madgrades-sponsor-dismissed-mechanize",
  callToAction: "Apply now!",
  taglines: [
    "Mechanize is hiring junior SWEs. $300K base + equity.",
    "Better at coding than AI? Prove it.",
    "Mechanize hires engineers to outsmart AI. It's harder than you think. $300K + equity.",
    "Most engineers can't beat Claude on our take-home. Think you can? $300K + equity for Jr SWEs at Mechanize.",
  ],
};

const SPONSOR = MECHANIZE;

export default SPONSOR;
