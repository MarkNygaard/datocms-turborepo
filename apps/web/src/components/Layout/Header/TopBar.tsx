import React from "react";
import Container from "@/Primitives/Container";
import PrimitiveLink from "components/Primitives/Link";
import { LayoutQuery, LinkRecord } from "types/datocms";

import { cn } from "@repo/ui";

type PropTypes = {
  data: LayoutQuery;
};

export default function TopBar({ data }: PropTypes) {
  return (
    <div className="relative z-50 hidden h-9 items-center bg-zinc-100 lg:flex">
      <div className="w-full">
        <Container className="flex justify-between text-xs font-semibold">
          {data.layout?.topBarText && <div>{data.layout?.topBarText}</div>}
          <ul
            className={cn("flex", {
              "divide-x divide-black": data.layout?.topBarText,
              "w-full justify-evenly text-sm": !data.layout?.topBarText,
            })}
          >
            {data.layout?.topBarLinks?.map((link) => (
              <li key={link.id}>
                <PrimitiveLink
                  className={cn(
                    "px-3 py-0 text-xs font-semibold text-black hover:text-gray-600",
                    {
                      "font-normal": !data.layout?.topBarText,
                    },
                  )}
                  {...(link as LinkRecord)}
                />
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </div>
  );
}
