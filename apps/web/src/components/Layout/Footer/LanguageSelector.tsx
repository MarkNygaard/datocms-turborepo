"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "i18n/navigation";
import { routing } from "i18n/routing";
import { getLangNameFromCode } from "language-name-map";
import { Locale, useLocale } from "next-intl";
import { FaCheck, FaChevronDown, FaGlobe, FaTimes } from "react-icons/fa";

import { Button } from "@repo/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { slug } = params as { slug: string };
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (nextLocale: Locale) => {
    startTransition(() => {
      router.replace({ pathname, params: { slug } }, { locale: nextLocale });
    });
  };

  return (
    <>
      {/* Desktop Dropdown */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="fullGhost"
              className="flex items-center gap-2 py-0 text-gray-500"
              disabled={isPending}
            >
              <FaGlobe className="h-4 w-4" />
              <span>
                {getLangNameFromCode(locale)?.name ?? locale.toUpperCase()}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {routing.locales.map((loc) => (
              <DropdownMenuItem
                key={loc}
                className="flex cursor-pointer items-center justify-between"
                onClick={() => handleLocaleChange(loc as Locale)}
              >
                <span>
                  {getLangNameFromCode(loc)?.name ?? loc.toUpperCase()}
                </span>
                {loc === locale && <FaCheck className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Drawer */}
      <div className="sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FaGlobe className="h-4 w-4" />
              <span>
                {getLangNameFromCode(locale)?.name ?? locale.toUpperCase()}
              </span>
              <FaChevronDown className="h-3 w-3" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="grid gap-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Select Language</h3>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
              <div className="grid gap-2">
                {routing.locales.map((loc) => (
                  <Button
                    key={loc}
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => handleLocaleChange(loc as Locale)}
                    disabled={isPending}
                  >
                    <FaGlobe className="h-4 w-4" />
                    <span>
                      {getLangNameFromCode(loc)?.name ?? loc.toUpperCase()}
                    </span>
                    {loc === locale && <FaCheck className="ml-auto h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
