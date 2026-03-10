import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polityka Prywatności | Plan był inny",
  description:
    "Informacje o tym, jak dbamy o Twoje dane osobowe i prywatność na blogu Plan był inny.",
};

const currentYear = new Date().getFullYear();

const PrivacyPolicyPage = () => {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="font-dm-sans text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Polityka Prywatności
        </h1>
        <p className="text-gray-500 font-eb-garamond">
          Ostatnia aktualizacja: 10 marca {currentYear} r.
        </p>
      </header>
      <div className="prose prose-gray prose-lg max-w-none">
        <section className="mb-10">
          <h2 className="text-xl font-dm-sans font-semibold text-gray-900 mb-4">
            1. Administrator Danych
          </h2>
          <p className="text-gray-600 font-eb-garamond leading-relaxed">
            Administratorem Twoich danych osobowych zbieranych za pośrednictwem
            strony
            <strong> plan-byl-inny.pl </strong> jest: <br />
            <span className="block mt-2 font-medium">Łukasz Wysocki</span>
            Kontakt:{" "}
            <a
              href="mailto:lwysocki91@gmail.com"
              className="text-black underline"
            >
              lwysocki91@gmail.com
            </a>
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-dm-sans font-semibold text-gray-900 mb-4">
            2. Cel i Podstawa Przetwarzania
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-gray-600 font-eb-garamond">
            <li>
              <strong>Newsletter:</strong> Twoje dane (e-mail) przetwarzane są w
              celu wysyłki informacji o nowych wpisach. Podstawą prawną jest
              Twoja zgoda.
            </li>
            <li>
              <strong>Komentarze:</strong> Przetwarzamy Twoje imię/nick oraz
              e-mail, aby umożliwić Ci merytoryczną dyskusję pod postami.
            </li>
            <li>
              <strong>Bezpieczeństwo:</strong> Korzystamy z Cloudflare
              Turnstile, aby chronić formularze przed spamem i botami
              (uzasadniony interes administratora).
            </li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-dm-sans font-semibold text-gray-900 mb-4">
            3. Odbiorcy Danych
          </h2>
          <p className="text-gray-600 mb-4 font-eb-garamond">
            Twoje dane są bezpieczne i nie są odsprzedawane. Korzystamy jednak z
            usług zaufanych partnerów technicznych:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 font-eb-garamond">
            <ul className="list-none p-0 m-0 space-y-2 text-sm text-gray-600">
              <li>
                <strong>Hosting i Baza Danych:</strong> Vercel Inc.
              </li>
              <li>
                <strong>Wysyłka E-maili:</strong> Resend
              </li>
              <li>
                <strong>Ochrona Antyspamowa:</strong> Cloudflare
              </li>
            </ul>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-dm-sans font-semibold text-gray-900 mb-4">
            4. Pliki Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed font-eb-garamond">
            Strona wykorzystuje niezbędne techniczne pliki cookies (m.in.
            Cloudflare Turnstile). Służą one wyłącznie zapewnieniu
            bezpieczeństwa i poprawnego działania funkcji bloga. Nie
            wykorzystujemy ich do celów reklamowych bez Twojej zgody.
          </p>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-dm-sans font-semibold text-gray-900 mb-4">
            5. Twoje Prawa
          </h2>
          <p className="text-gray-600 leading-relaxed font-eb-garamond">
            Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia
            ("prawo do bycia zapomnianym") oraz wycofania zgody na newsletter w
            dowolnym momencie. W tym celu napisz do mnie na podany wyżej adres
            e-mail.
          </p>
        </section>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
