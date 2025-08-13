import nodemailer from "nodemailer";
import { render } from "@react-email/render";

import { TwoFactorEmail } from "@/emails/two-factor-email";
import { VerificationEmail } from "@/emails/verification-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";
import { OrderConfirmationEmail } from "@/emails/order-confirmation-email";

const domain = process.env.NEXT_PUBLIC_APP_URL;
const pass = process.env.NODEMAILER_SENDER_PASSWORD;
const emailSender = process.env.NODEMAILER_SENDER_EMAIL;

if (!domain || !emailSender || !pass) {
  throw new Error("Missing email configuration environment variables");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: emailSender, pass },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    const html = await render(<VerificationEmail confirmLink={confirmLink} />);

    await transporter.sendMail({
      from: emailSender,
      to: email,
      subject: "Підтвердіть свою електронну адресу",
      html,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendTwoFactorTokensEmail = async (
  email: string,
  token: string
) => {
  const html = await render(<TwoFactorEmail code={token} />);

  try {
    await transporter.sendMail({
      from: emailSender,
      to: email,
      subject: "2FA-code",
      html,
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    const html = await render(<PasswordResetEmail resetLink={resetLink} />);

    await transporter.sendMail({
      from: emailSender,
      to: email,
      subject: "Reset your password",
      html,
    });
  } catch (error) {
    console.error(error);
  }
};

interface OrderItemForEmail {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface DeliveryAddressForEmail {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  email: string;
  phone: string;
}

interface OrderConfirmationData {
  orderId: string;
  items: OrderItemForEmail[];
  totalPrice: number;
  deliveryAddress: DeliveryAddressForEmail;
  paymentMethod: string;
  deliveryMethod: string;
}

export const sendOrderConfirmationEmail = async (
  email: string,
  orderData: OrderConfirmationData
) => {
  try {
    const html = await render(<OrderConfirmationEmail order={orderData} />);

    await transporter.sendMail({
      from: emailSender,
      to: email,
      subject: `Order Confirmation #${orderData.orderId}`,
      html,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};
