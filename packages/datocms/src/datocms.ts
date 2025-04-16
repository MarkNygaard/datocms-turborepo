import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { unstable_cache as cache } from "next/cache";
import { rawExecuteQuery } from "@datocms/cda-client";
import { print } from "graphql";
import stringify from "safe-stable-stringify";

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
      cache: "no-store",
    },
  });

  // TEMP LOG FOR DEBUGGING
  console.log("🔍 DATA FROM DATOCMS:", JSON.stringify(data, null, 2));
  console.log("🔖 X-Cache-Tags:", response.headers.get("x-cache-tags"));

  const cacheTags = parseXCacheTagsResponseHeader(
    response.headers.get("x-cache-tags"),
  );

  await storeQueryCacheTags(documentId, cacheTags);

  return data as TResult;
}

export async function generateQueryId<
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<string> {
  const encoder = new TextEncoder();

  const hashInput = print(document) + stringify(variables ?? {});

  console.log("🧪 Hash input for queryId:", hashInput);

  const data = encoder.encode(hashInput);
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
