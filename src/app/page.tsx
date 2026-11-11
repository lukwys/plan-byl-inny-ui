import { Suspense } from "react";
import { NewsletterStatus } from "@/components/newsletter-status";
import { strapiService } from "@/services/strapi";
import { PostsPage } from "@/components/posts-page";
import { Metadata } from "next";
import { SITE_URL } from "@/config/next";

export const metadata: Metadata = {
  title: "Plan był inny - Blog o podróżach i przygodach",
  description:
    "Bikepacking, nurkowanie i wyprawy bez sztywnego planu. Wejdź do świata Łukasza i zobacz, gdzie kończą się plany, a zaczyna przygoda.",
  openGraph: {
    title: "Plan był inny - Blog o podróżach i przygodach",
    description:
      "Bikepacking, nurkowanie i wyprawy bez sztywnego planu. Wejdź do świata Łukasza i zobacz, gdzie kończą się plany, a zaczyna przygoda.",
    url: SITE_URL,
    type: "website",
    images: [{ url: `${SITE_URL}/logo.png` }],
  },
  twitter: {
    card: "summary",
    title: "Plan był inny - Blog o podróżach i przygodach",
    description:
      "Bikepacking, nurkowanie i wyprawy bez sztywnego planu. Wejdź do świata Łukasza i zobacz, gdzie kończą się plany, a zaczyna przygoda.",
    images: [`${SITE_URL}/logo.png`],
  },
};

export default async function Home() {
  const [{ posts, totalPages }, { tagline }] = await Promise.all([
    strapiService.getPostsPage(1),
    strapiService.getHomepage(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Plan był inny",
    url: SITE_URL,
    description: "Blog o podróżach, rowerze, nurkowaniu i DIY",
    author: {
      "@type": "Person",
      name: "Łukasz",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Suspense fallback={null}>
        <NewsletterStatus />
      </Suspense>

      <PostsPage
        title={tagline}
        fallbackTitle="Plan był inny"
        posts={posts}
        currentPage={1}
        totalPages={totalPages}
        basePath=""
        emptyMessage="Cisza przed burzą... Wpisy są w drodze!"
      />
    </main>
  );
}
