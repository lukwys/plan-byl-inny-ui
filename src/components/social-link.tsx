import Image from "next/image";
import Link from "next/link";
import { STRAPI_URL } from "@/config/strapi";
import { SocialLinkModel } from "@/types/social-link";

type SocialLinkProps = {
  socialLink: SocialLinkModel;
};

export const SocialLink = ({ socialLink }: SocialLinkProps) => {
  const { documentId, url, icon } = socialLink;

  return (
    <Link key={documentId} href={url} target="_blank">
      <Image src={`${STRAPI_URL}${icon.url}`} alt="" width={30} height={30} />
    </Link>
  );
};
