import { ContactForm } from "@/components/contact-form";
import { SocialLink } from "@/components/social-link";
import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { SocialLinkModel } from "@/types/social-link";

const Contact = async () => {
  const socialLinks = await requestData<SocialLinkModel[]>(
    `${STRAPI_URL}/api/links?populate=icon`,
  );
  const handleSubmit = () => {};

  return (
    <div className="container mx-auto w-full px-4 py-10 sm:py-14">
      <div className="p-8 sm:p-12">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-2 lg:gap-16">
          <section className="order-1">
            <div>
              <h1 className="font-dm-sans font-semibold text-xl">Pogadajmy</h1>
              <h2 className="text-lg">Napisz, zanim plan znowu się zmieni</h2>
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

export default Contact;
