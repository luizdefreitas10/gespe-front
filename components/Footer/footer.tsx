import Image from "next/image";

import footerLogoDark from "@/public/footer-logo-dark.svg";
import footerLogoLight from "@/public/footer-logo-light.svg";

const LOGO_W = 162;
const LOGO_H = 95;

const footerTopDivider =
  "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-[1] before:h-[2px] before:content-[''] before:bg-[linear-gradient(to_right,rgba(0,0,0,0.4)_0%,rgba(255,255,255,0.6)_50%,rgba(0,0,0,0.4)_100%)] dark:before:bg-[linear-gradient(to_right,rgba(0,0,0,0.5)_0%,rgba(255,255,255,0.8)_50%,rgba(0,0,0,0.5)_100%)]";

export function Footer() {
  return (
    <footer
      className={`relative w-full shrink-0 bg-[#f0f4f8] dark:bg-[linear-gradient(90deg,#000000_0%,#0c2856_50%,#000000_100%)] ${footerTopDivider}`}
      role="contentinfo"
    >
      <div className="mx-auto flex min-h-[120px] w-full max-w-[1728px] items-center justify-center px-4 py-8 sm:min-h-[140px] sm:px-6 md:min-h-[155px] md:py-0">
        <Image
          src={footerLogoLight}
          alt="Arpe"
          width={LOGO_W}
          height={LOGO_H}
          className="h-auto w-[min(162px,42vw)] max-w-full object-contain dark:hidden"
        />
        <Image
          src={footerLogoDark}
          alt="Arpe"
          width={LOGO_W}
          height={LOGO_H}
          className="hidden h-auto w-[min(162px,42vw)] max-w-full object-contain dark:block"
        />
      </div>
    </footer>
  );
}
