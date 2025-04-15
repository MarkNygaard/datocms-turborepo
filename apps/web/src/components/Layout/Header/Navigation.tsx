"use client";

import type { ResponsiveImageType } from "react-datocms";
import Link from "next/link";
import Container from "@/Primitives/Container";
import PrimitiveLink from "components/Primitives/Link";
import { Image as DatoImage } from "react-datocms";
import { RiSearchLine } from "react-icons/ri";
import { DropdownMenuRecord, LayoutQuery, LinkRecord } from "types/datocms";

import { cn } from "@repo/ui";

import CategoryPopover from "./CategoryPopover";
import { useSmartNav } from "./useSmartNav";

type PropTypes = {
  data: LayoutQuery;
};

export default function Navigation({ data }: PropTypes) {
  const { scrollDirection, isSticky, scrollY } = useSmartNav();
  const menuItems = data.layout?.menu ?? [];

  return (
    <>
      <header
        className={cn(
          "z-50 w-full bg-white transition-all duration-100 ease-in-out",
          {
            "relative top-0": !isSticky && scrollY < 36,
            "relative top-[36px]": !isSticky && scrollY >= 96,
            "relative top-[-60px]": !isSticky && scrollY >= 96 && scrollY < 156,
            "fixed top-0 z-50": isSticky && scrollDirection === "up",
            "fixed top-[-60px] z-50": isSticky && scrollDirection === "down",
          },
        )}
      >
        <Container className="flex h-[60px] items-center justify-between">
          <Link href="/" className="relative -m-2 flex w-8 lg:ml-0">
            <DatoImage
              data={data.layout?.logo?.responsiveImage as ResponsiveImageType}
              className="object-contain"
            />
          </Link>
          <nav aria-label="Main Navigation">
            <ul className="hidden gap-1 md:flex">
              {menuItems.map((item) => {
                if (item._modelApiKey === "link") {
                  return (
                    <li key={item.id}>
                      <PrimitiveLink {...(item as LinkRecord)} />
                    </li>
                  );
                }

                if (item._modelApiKey === "dropdown_menu") {
                  return (
                    <li key={item.id} className="flex items-center">
                      <CategoryPopover category={item as DropdownMenuRecord} />
                    </li>
                  );
                }

                return null;
              })}
            </ul>
          </nav>
          <div className="relative">
            <div className="pointer-events-none inset-y-0 flex items-center lg:absolute lg:left-3 lg:text-gray-400">
              <RiSearchLine />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="hidden w-full rounded-full border border-gray-300 py-2 pl-8 pr-4 text-sm placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black lg:block"
            />
          </div>
        </Container>
      </header>
      {isSticky && <div className="h-[60px]" />}
    </>
  );
}
