import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

interface TwoFactorEmailProps {
  code: string;
}

export const TwoFactorEmail = ({ code }: TwoFactorEmailProps) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f5",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "8px",
            maxWidth: "500px",
          }}
        >
          <Heading
            style={{ color: "#000000", fontSize: "24px", marginBottom: "20px" }}
          >
            Two-Factor Authentication
          </Heading>
          <Text style={{ marginBottom: "20px", color: "#6b7280" }}>
            Use this code to complete your login:
          </Text>
          <Text
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#000000",
              letterSpacing: "2px",
            }}
          >
            {code}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
