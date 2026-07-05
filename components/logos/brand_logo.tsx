type BrandLogoVariant = "text" | "backOffice" | "icon";

type BrandLogoProps = {
  variant: BrandLogoVariant;
  className?: string;
};

const LOGO_VARIANTS: Record<
  BrandLogoVariant,
  { className: string; label: string }
> = {
  text: {
    className:
      "aspect-[115/18] w-[115px] mask-[url(/logos/text-logo.svg)]",
    label: "Evolution",
  },
  backOffice: {
    className:
      "aspect-[150/76] w-[120px] sm:w-[150px] mask-[url(/logos/back-office-logo.svg)]",
    label: "Evolution Back Office",
  },
  icon: {
    className: "aspect-[28/24] w-[28px] mask-[url(/logos/logo.svg)]",
    label: "Evolution",
  },
};

export default function BrandLogo({ variant, className = "" }: BrandLogoProps) {
  const logo = LOGO_VARIANTS[variant];

  return (
    <span
      role="img"
      aria-label={logo.label}
      className={`inline-block shrink-0 bg-secondary mask-contain mask-center mask-no-repeat ${logo.className} ${className}`}
    />
  );
}
