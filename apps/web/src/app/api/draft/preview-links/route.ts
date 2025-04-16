import type { NextRequest } from "next/server";
import { SiteLocale } from "types/datocms";

type generatePreviewUrlParams = {
  item: any;
  itemType: any;
  locale: SiteLocale;
};

const generatePreviewUrl = ({
  item,
  itemType,
  locale,
}: generatePreviewUrlParams) => {
  const localePrefix = locale === "en" ? "" : `/${locale}`;

  switch (itemType.attributes.api_key) {
    case "home":
      return `${localePrefix || "/"}`;
    case "page":
      return `${localePrefix}/${item.attributes.slug || ""}`;
    default:
      return null;
  }
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-preview-token",
  "Content-Type": "application/json",
};

export async function OPTIONS(request: NextRequest) {
  return new Response("ok", {
    status: 200,
    headers,
  });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-preview-token");

  if (token !== process.env.DRAFT_SECRET_TOKEN) {
    return new Response("Invalid token", { status: 401 });
  }

  const parsedRequest = await request.json();
  const url = generatePreviewUrl(parsedRequest);

  if (!url) {
    return new Response(JSON.stringify({ previewLinks: [] }), {
      status: 200,
      headers,
    });
  }

  const baseUrl = process.env.URL as string;
  const isPublished = parsedRequest.item.meta.status === "published";

  const previewLinks = [];

  if (isPublished) {
    previewLinks.push({
      label: "Published version",
      url: `${baseUrl}/api/draft/disable?url=${url}`,
    });
  }

  if (!isPublished) {
    previewLinks.push({
      label: "Draft version",
      url: `${baseUrl}/api/draft/enable?url=${url}&token=${token}`,
    });
  }

  return new Response(JSON.stringify({ previewLinks }), {
    status: 200,
    headers,
  });
}
