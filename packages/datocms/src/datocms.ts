import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { unstable_cache as cache } from "next/cache";
import { rawExecuteQuery } from "@datocms/cda-client";
import { print } from "graphql";

import { parseXCacheTagsResponseHeader } from "./cache-tags";
import { storeQueryCacheTags } from "./database";

export async function executeQueryWithoutMemoization<
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Exclude-Invalid": "true",
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  if (isDraft || process.env.NODE_ENV === "development")
    headers["X-Include-Drafts"] = "true";

  const documentId = await generateQueryId(document, variables);

  const [data, response] = await rawExecuteQuery(document, {
    token: process.env.DATOCMS_READONLY_API_TOKEN ?? "",
    excludeInvalid: true,
    returnCacheTags: true,
    variables,
    requestInitOptions: {
      cache:
        process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    },
  });

  console.log("📡 PROD fetch run at:", new Date().toISOString());
  console.log(
    "📦 Fetching queryId:",
    await generateQueryId(document, variables),
  );

  const cacheTags = parseXCacheTagsResponseHeader(
    response.headers.get("x-cache-tags"),
  );

  await storeQueryCacheTags(documentId, cacheTags);

  return data as TResult;
}

async function generateQueryId<
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(
    print(document) + JSON.stringify(variables ?? {}),
  );
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const queryDatoCMS =
  process.env.NODE_ENV === "production"
    ? executeQueryWithoutMemoization
    : cacheWithDeepCompare(executeQueryWithoutMemoization);

function cacheWithDeepCompare<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  const cachedFn = cache(async (serialized: string) => {
    return Promise.resolve(fn(...(JSON.parse(serialized) as A)));
  });
  return (...args: A) => {
    const serialized = JSON.stringify(args);
    return cachedFn(serialized);
  };
}
