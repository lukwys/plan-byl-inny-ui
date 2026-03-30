import { SocialLink } from "@/components/social-link";
import { strapiService } from "@/services/strapi";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Gallery } from "@/components/gallery";
import { Divider } from "@/components/divider";
import { Metadata } from "next";
import { SITE_URL } from "@/config/next";

export const metadata: Metadata = {
  title: "O mnie | Plan był inny",
  description:
    "Cześć, tu Łukasz. Dowiedz się, dlaczego uważam, że najlepsze przygody zaczynają się tam, gdzie kończy się plan. Podróże, bikepacking, nurkowanie i projekty DIY.",
  openGraph: {
    title: "O mnie | Plan był inny",
    description:
      "Cześć, tu Łukasz. Dowiedz się, dlaczego uważam, że najlepsze przygody zaczynają się tam, gdzie kończy się plan. Podróże, bikepacking, nurkowanie i projekty DIY.",
    type: "profile",
    images: [{ url: `${SITE_URL}/logo.png` }],
  },
  twitter: {
    card: "summary",
    title: "O mnie | Plan był inny",
    description:
      "Cześć, tu Łukasz. Dowiedz się, dlaczego uważam, że najlepsze przygody zaczynają się tam, gdzie kończy się plan. Podróże, bikepacking, nurkowanie i projekty DIY.",
    images: [`${SITE_URL}/logo.png`],
  },
};
const AboutMe = async () => {
  const { header_image, title, content_blocks, avatar } =
    await strapiService.getAboutMe(true);
  const socialLinks = await strapiService.getSocialLinks();

  return (
    <div>
      <div className="relative w-full h-[350px] md:h-[450px]">
        <div className="absolute inset-0 bg-black/20 z-[5]" />
        <Image
          src={getStrapiImage(header_image.url)}
          alt={header_image.alternativeText ?? ""}
          className="object-cover"
          priority
          sizes="100vw"
          fill
        />
      </div>
      <div className="grid gap-10 py-16 max-w-7xl mx-auto lg:grid-cols-24 px-4 lg:px-6 bg-white">
        <div className="lg:col-span-15 lg:col-start-2">
          <h1 className="font-dm-sans font-bold text-2xl mb-4 text-main-red uppercase tracking-wider">
            {title}
          </h1>
          <article className="markdown prose prose-lg max-w-none font-eb-garamond">
            {content_blocks?.map((block) => {
              switch (block.__component) {
                case "content.paragraph-md":
                  return (
                    <div key={block.id}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="font-eb-garamond text-lg text-justify mb-4 last:mb-0">
                              {children}
                            </p>
                          ),
                          li: ({ children }) => (
                            <li className="font-eb-garamond text-lg text-justify mb-4 last:mb-0">
                              {children}
                            </li>
                          ),
                        }}
                      >
                        {block.paragraph}
                      </ReactMarkdown>
                    </div>
                  );
                case "content.gallery":
                  return (
                    <div key={block.id} className="my-10">
                      <Gallery block={block} />
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </article>
        </div>
        <div className="lg:col-start-18 lg:col-span-6">
          <div className="sticky top-10 flex flex-col items-center">
            <div className="relative aspect-square w-full max-w-[280px] lg:max-w-none shadow-2xl rounded-full overflow-hidden border-8 border-white bg-white">
              <Image
                src={getStrapiImage(avatar.url)}
                alt={avatar.alternativeText ?? ""}
                fill
                priority
                className="object-cover object-center"
                sizes="(min-width: 1024px) 350px, 280px"
              />
            </div>
            <Divider />
            <p className="font-dm-sans text-xs uppercase tracking-widest text-gray-400 mb-4 text-center lg:text-left">
              Znajdziesz mnie tutaj:
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <SocialLink key={link.documentId} socialLink={link} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
