import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Img,
} from "@react-email/components";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface DeliveryAddress {
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

interface OrderConfirmationEmailProps {
  order: {
    orderId: string;
    items: OrderItem[];
    totalPrice: number;
    currency?: string;
    deliveryAddress: DeliveryAddress;
    paymentMethod: string;
    deliveryMethod: string;
  };
}

export const OrderConfirmationEmail = ({
  order,
}: OrderConfirmationEmailProps) => {
  const {
    orderId,
    items,
    totalPrice,
    currency = "USD",
    deliveryAddress,
    paymentMethod,
    deliveryMethod,
  } = order;

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "'Arial', sans-serif",
          backgroundColor: "#f4f4f5",
          padding: "20px",
          margin: 0,
        }}
      >
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <Heading
            style={{ color: "#111827", fontSize: "24px", marginBottom: "20px" }}
          >
            Order Confirmation #{orderId}
          </Heading>

          <Text
            style={{ marginBottom: "20px", color: "#374151", fontSize: "16px" }}
          >
            Thank you for your order! Here’s a summary of your purchase:
          </Text>

          <Section>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      borderBottom: "1px solid #d1d5db",
                      padding: "8px",
                      textAlign: "left",
                      color: "#6b7280",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #d1d5db",
                      padding: "8px",
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #d1d5db",
                      padding: "8px",
                      textAlign: "right",
                      color: "#6b7280",
                    }}
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ id, productName, quantity, price, imageUrl }) => (
                  <tr key={id}>
                    <td
                      style={{
                        padding: "8px",
                        borderBottom: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {imageUrl && (
                        <Img
                          src={imageUrl}
                          alt={productName}
                          width={50}
                          height={50}
                          style={{ borderRadius: "6px", objectFit: "cover" }}
                        />
                      )}
                      <span>{productName}</span>
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {quantity}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        textAlign: "right",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {price.toFixed(2)} {currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Text
            style={{
              fontWeight: "bold",
              textAlign: "right",
              fontSize: "18px",
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Total: {totalPrice.toFixed(2)} {currency}
          </Text>

          <Heading
            style={{ fontSize: "20px", color: "#111827", marginBottom: "10px" }}
          >
            Delivery Address
          </Heading>
          <Text
            style={{ color: "#374151", fontSize: "14px", marginBottom: "10px" }}
          >
            {deliveryAddress.firstName} {deliveryAddress.lastName}
            <br />
            {deliveryAddress.address}
            <br />
            {deliveryAddress.city}, {deliveryAddress.state}{" "}
            {deliveryAddress.postalCode}
            <br />
            {deliveryAddress.country}
            <br />
            Email: {deliveryAddress.email}
            <br />
            Phone: {deliveryAddress.phone}
          </Text>

          <Text
            style={{ color: "#374151", fontSize: "14px", marginBottom: "5px" }}
          >
            Payment method: <strong>{paymentMethod}</strong>
          </Text>
          <Text style={{ color: "#374151", fontSize: "14px" }}>
            Delivery method: <strong>{deliveryMethod}</strong>
          </Text>

          <Text
            style={{
              marginTop: "30px",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            If you have any questions, reply to this email or contact our
            support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
