import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => {
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
            Password Reset
          </Heading>
          <Text style={{ marginBottom: "20px", color: "#6B7280" }}>
            Click the button below to reset your password:
          </Text>
          <Button
            href={resetLink}
            style={{
              backgroundColor: "#000000",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Reset Password
          </Button>
          <Text style={{ marginTop: "20px", fontSize: "12px", color: "#888" }}>
            If you did not request a password reset, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
