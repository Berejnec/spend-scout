import "./globals.css";

import { GeistSans } from "geist/font/sans";

let title = "Spend Scout";
let description =
  "Keep track of your expenses and see how much you're spending on each category with your Spend Scout.";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://spend-scout-eight.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}
