import { ContactForm } from "@/components/contact-form";
import { SocialLink } from "@/components/social-link";
import { strapiService } from "@/services/strapi";
import { Metadata } from "next";

export const metadata = {
  title: "Kontakt | Plan był inny",
  description:
    "Jeśli masz pytanie, chcesz coś skomentować albo po prostu się odezwać — śmiało. Odpowiadam, gdy tylko złapię chwilę lub znajdź mnie w mediach społecznościowych.",
  openGraph: {
    title: "Skontaktuj się ze mną - Plan był inny",
    description:
      "Napisz, zanim plan znowu się zmieni. Formularz kontaktowy i social media.",
  },
};

const ContactPage = async () => {
  const socialLinks = await strapiService.getSocialLinks();

  return (
    <main className="container mx-auto w-full px-4 py-10 sm:py-14 flex-1 bg-white">
      <div className="p-8 sm:p-12">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-16">
          <section className="order-1">
            <div className="font-dm-sans">
              <h1 className="font-semibold text-2xl mb-2">Kontakt</h1>
              <h2 className="text-lg mb-1">
                Pogadajmy, zanim plan znowu się zmieni
              </h2>
              <p className="leading-relaxed">
                Jeśli masz pytanie, chcesz coś skomentować albo po prostu się
                odezwać — śmiało. Odpowiadam, gdy tylko złapię chwilę.
              </p>
              <div className="flex gap-4 mt-6">
                {socialLinks.map((link) => (
                  <SocialLink key={link.documentId} socialLink={link} />
                ))}
              </div>
            </div>
          </section>
          <section className="order-2">
            <ContactForm />
          </section>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
