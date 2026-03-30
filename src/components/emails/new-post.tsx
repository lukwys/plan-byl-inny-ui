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

interface NewPostProps {
  title: string;
  preview: string;
  slug: string;
  coverImageUrl: string;
}

export const NewPost = ({
  title,
  preview,
  slug,
  coverImageUrl,
}: NewPostProps) => {
  const postUrl = `${SITE_URL}/wpis/${slug}`;
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>{title} — nowy wpis na blogu Plan był inny</Preview>
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
          <Img
            src={coverImageUrl}
            alt={title}
            width="520"
            style={coverImage}
          />
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>{preview}</Text>
          <Section style={btnContainer}>
            <Link style={button} href={postUrl}>
              CZYTAJ WPIS
            </Link>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Otrzymałeś ten e-mail, ponieważ zapisałeś się do newslettera na
            stronie plan-byl-inny.pl.
            <br />
            <br />
            <Link href={`${SITE_URL}/polityka-prywatnosci`} style={link}>
              Polityka prywatności
            </Link>
            <br />
            <br />© {currentYear} Plan był inny
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default NewPost;

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

const coverImage = {
  width: "100%",
  borderRadius: "8px",
  marginBottom: "24px",
};

const h1 = {
  fontSize: "22px",
  fontWeight: "700",
  textAlign: "center" as const,
  color: "#1a1a1a",
  margin: "24px 0 16px",
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

const hr = {
  borderColor: "#eeeeee",
  margin: "40px 0",
};

const link = {
  color: "#000",
  textDecoration: "underline",
};

const footer = {
  color: "#999999",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "18px",
};
