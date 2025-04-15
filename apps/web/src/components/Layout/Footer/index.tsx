import React from "react";
import Container from "@/Primitives/Container";
import PrimitiveLink from "components/Primitives/Link";
import { LayoutQuery, LinkRecord, SiteLocale } from "types/datocms";

import LanguageSelector from "./LanguageSelector";

type Props = {
  data: LayoutQuery;
  languages: SiteLocale[];
};

export default function Footer({ data, languages }: Props) {
  if (!data.layout) {
    return null;
  }

  return (
    <Container className="pt-12">
      <footer className="border-t border-gray-200">
        <div className="mt-12 flex w-full flex-wrap gap-6">
          {/* Footer columns */}
          {data.layout.footerColumns.map((column) => (
            <div key={column.id} className="min-w-[150px] flex-1">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                {column.label}
              </h3>
              <ul className="space-y-2">
                {column.footerItem.map((link) => (
                  <li key={link.id}>
                    <PrimitiveLink {...(link as LinkRecord)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Language Selector */}
          {languages.length > 1 && (
            <div className="flex min-w-[150px] flex-1 justify-end">
              <LanguageSelector />
            </div>
          )}
        </div>
      </footer>
      {/* Copyright Text */}
      <div className="my-12 text-sm text-gray-500">
        © {new Date().getFullYear()} {data.layout.copyrightText}
      </div>
    </Container>
  );
}
