import { SITE_URL } from "@/config/next";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface NewsletterConfirmProps {
  confirmUrl: string;
}

export const NewsletterConfirm = ({ confirmUrl }: NewsletterConfirmProps) => {
  return (
    <Html>
      <Head />
      <Preview>Potwierdź swój zapis do newslettera "Plan był inny"</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={`${SITE_URL}/logo.png`}
              width="140"
              alt="Plan był inny"
              style={logo}
            />
          </Section>
          <Heading style={h1}>Hej! Fajnie, że jesteś</Heading>
          <Text style={text}>
            Zapisałeś/aś się do newslettera bloga <strong>Plan był inny</strong>
            . Zanim wyślę Ci pierwsze historie z trasy, muszę mieć pewność, że
            to Ty. Kliknij poniższy przycisk, aby potwierdzić swój adres e-mail.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href={confirmUrl}>
              POTWIERDZAM ZAPIS
            </Link>
            <Text style={expiryWarning}>Link jest ważny przez 30 minut.</Text>
          </Section>
          <Text style={subtext}>
            Jeśli przycisk nie działa, skopiuj ten link do przeglądarki:
            <br />
            <Link href={confirmUrl} style={link}>
              {confirmUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Otrzymałeś ten e-mail, ponieważ zapisałeś się na stronie
            plan-byl-inny.pl. Jeśli to pomyłka, po prostu zignoruj tę wiadomość.
            <br />
            <br />© 2026 Plan był inny
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterConfirm;

// --- STYLE ---
const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  fontSize: "22px",
  fontWeight: "700",
  textAlign: "center" as const,
  color: "#1a1a1a",
  margin: "30px 0",
};

const text = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#444",
  textAlign: "center" as const,
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "40px 0",
};

const button = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "16px 32px",
  textDecoration: "none",
  display: "inline-block",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "1px",
};

const subtext = {
  fontSize: "12px",
  color: "#888",
  textAlign: "center" as const,
  marginTop: "20px",
};

const link = {
  color: "#000",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#eeeeee",
  margin: "40px 0",
};

const footer = {
  color: "#999999",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "18px",
};

const expiryWarning = {
  fontSize: "13px",
  color: "#e11d48",
  marginTop: "12px",
  fontWeight: "500",
  textAlign: "center" as const,
};
