"use client";

import type { Record, StructuredText } from "datocms-structured-text-utils";
import { useState } from "react";
import Link from "next/link";
import { isLink } from "datocms-structured-text-utils";
import { getLocale } from "next-intl/server";
import {
  renderNodeRule,
  StructuredText as StructuredTextField,
} from "react-datocms/structured-text";
import { LayoutModelNotificationField, SiteLocale } from "types/datocms";

type Props = {
  notification: LayoutModelNotificationField;
};

const NotificationStrip = ({ notification }: Props) => {
  const [notificationStrip, setNotificationStrip] = useState(true);
  if (!notificationStrip) return null;

  const locale = getLocale();

  return (
    <div className="relative z-50 bg-white pb-1">
      <div className="relative flex flex-nowrap items-center justify-center bg-primary/80 px-4 py-2 sm:flex-nowrap sm:gap-3 sm:py-4 sm:pr-8 md:px-8">
        <div className="order-1 mb-2 mt-2 flex h-full w-auto max-w-screen-sm items-center justify-center text-sm text-white sm:order-none sm:mb-0 sm:mt-0 md:text-base">
          <StructuredTextField
            data={notification.value as StructuredText<Record, Record>}
            customNodeRules={[
              renderNodeRule(isLink, ({ node, children, key }) => {
                return (
                  <Link
                    href={`/${locale}${node.url}` || "#"}
                    className="order-last inline-block whitespace-nowrap rounded-lg bg-primary px-2 py-2 text-center text-xs font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-primary/90 focus-visible:ring active:bg-primary/50 sm:order-none sm:w-auto md:text-sm"
                    key={key}
                  >
                    {children}
                  </Link>
                );
              }),
            ]}
          />
        </div>

        <div className="order-2 flex w-1/12 items-start justify-end sm:absolute sm:right-0 sm:order-none sm:mr-1 sm:w-auto xl:mr-3">
          <button
            type="button"
            className="text-white transition duration-100 hover:text-indigo-100 active:text-indigo-200"
            onClick={() => {
              setNotificationStrip(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationStrip;
