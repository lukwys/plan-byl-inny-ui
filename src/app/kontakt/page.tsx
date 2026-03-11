import { ContactForm } from "@/components/contact-form";
import { SocialLink } from "@/components/social-link";
import { strapiService } from "@/services/strapi";

const ContactPage = async () => {
  const socialLinks = await strapiService.getSocialLinks();

  return (
    <div className="container mx-auto w-full px-4 py-10 sm:py-14 flex-1 bg-white">
      <div className="p-8 sm:p-12">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-16">
          <section className="order-1">
            <div className="font-dm-sans">
              <h1 className="font-semibold text-2xl mb-2">Pogadajmy</h1>
              <h2 className="text-lg mb-1">
                Napisz, zanim plan znowu się zmieni
              </h2>
              <p>
                Jeśli masz pytanie, chcesz coś skomentować albo po prostu się
                odezwać — śmiało. Odpowiadam, gdy tylko złapię chwilę.
              </p>
              <div className="flex gap-3 mt-3">
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
    </div>
  );
};

export default ContactPage;
