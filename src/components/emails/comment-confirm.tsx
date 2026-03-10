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

interface CommentConfirmProps {
  postTitle: string;
  commentText: string;
  confirmUrl: string;
}

export const CommentConfirm = ({
  postTitle,
  commentText,
  confirmUrl,
}: CommentConfirmProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Potwierdź swój komentarz pod wpisem: {postTitle}</Preview>
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
          <Heading style={h1}>Dzięki za Twój głos!</Heading>
          <Text style={text}>
            Otrzymałem Twój komentarz pod wpisem: <br />
            <strong>"{postTitle}"</strong>
          </Text>
          <Section style={commentBox}>
            <Text style={commentLabel}>Treść komentarza:</Text>
            <Text style={commentContent}>"{commentText}"</Text>
          </Section>
          <Text style={text}>
            Zanim go opublikuję, muszę potwierdzić, że to Ty. Kliknij przycisk
            poniżej, aby zatwierdzić publikację na blogu.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href={confirmUrl}>
              ZATWIERDŹ KOMENTARZ
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
            Dostałeś ten e-mail, ponieważ Ty (lub ktoś podający się za Ciebie)
            dodał komentarz na stronie plan-byl-inny.pl. Jeśli to pomyłka, po
            prostu zignoruj tę wiadomość.
            <br />
            <br />
            Zapoznaj się z naszą{" "}
            <Link href={`${SITE_URL}/polityka-prywatnosci`} style={link}>
              Polityką prywatności
            </Link>
            .
            <br />
            <br />© {currentYear} Plan był inny
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default CommentConfirm;

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
  fontSize: "15px",
  lineHeight: "24px",
  color: "#444",
  textAlign: "center" as const,
};

const commentBox = {
  backgroundColor: "#f9f9f9",
  borderRadius: "4px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #eeeeee",
};

const commentLabel = {
  fontSize: "12px",
  color: "#888",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: "8px",
  textAlign: "center" as const,
};

const commentContent = {
  fontSize: "16px",
  fontStyle: "italic",
  color: "#333",
  margin: "0",
  textAlign: "center" as const,
  lineHeight: "1.5",
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
