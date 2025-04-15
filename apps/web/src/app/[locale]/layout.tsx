import "styles/globals.css";

import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { GlobalPageProps } from "utils/globalPageProps";

const inter = Inter({ subsets: ["latin"] });

type Params = GlobalPageProps & {
  children: React.ReactNode;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Layout({ children, params }: Params) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${inter.className} flex min-h-screen flex-col antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
