import Link from "next/link";
import { STRAPI_URL } from "@/config/strapi";
import { SocialLinkModel } from "@/types/social-link";

type SocialLinkProps = {
  socialLink: SocialLinkModel;
};

export const SocialLink = ({ socialLink }: SocialLinkProps) => {
  const { documentId, url, icon } = socialLink;

  return (
    <Link
      key={documentId}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex"
    >
      <span
        aria-hidden="true"
        className="h-[30px] w-[30px] bg-black group-hover:bg-neutral-800 transition-colors"
        style={{
          WebkitMask: `url(${STRAPI_URL}${icon.url}) center / contain no-repeat`,
          mask: `url(${STRAPI_URL}${icon.url}) center / contain no-repeat`,
        }}
      />
    </Link>
  );
};
