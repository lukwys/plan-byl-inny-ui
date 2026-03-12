import Link from "next/link";
import { STRAPI_URL } from "@/config/strapi";
import { SocialLinkModel } from "@/types/social-link";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";

type SocialLinkProps = {
  socialLink: SocialLinkModel;
};

export const SocialLink = ({ socialLink }: SocialLinkProps) => {
  const { documentId, url, icon, name } = socialLink;

  return (
    <Link
      key={documentId}
      href={url}
      target="_blank"
      rel="noopener noreferrer me"
      className="group inline-flex"
      aria-label={`Odwiedź mój profil w serwisie ${name || "Social Media"}`}
    >
      <span
        aria-hidden="true"
        className="h-[30px] w-[30px] bg-black group-hover:bg-neutral-800 transition-colors"
        style={{
          WebkitMask: `url(${getStrapiImage(icon.url)}) center / contain no-repeat`,
          mask: `url(${getStrapiImage(icon.url)}) center / contain no-repeat`,
        }}
      />
    </Link>
  );
};
