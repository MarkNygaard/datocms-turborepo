import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { cache } from "react";
import { rawExecuteQuery } from "@datocms/cda-client";
import { print } from "graphql";
import stringify from "safe-stable-stringify";

import { parseXCacheTagsResponseHeader } from "./cache-tags";
import { storeQueryCacheTags } from "./database";

function getExplicitEnvironment(): string | undefined {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const datoEnv = process.env.DATOCMS_ENVIRONMENT;

  // In development/staging: use override
  if (env !== "production" && datoEnv) return datoEnv;

  // In production: let DatoCMS use the current promoted environment
  return undefined;
}

export async function executeQueryWithoutMemoization<
  TResult = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  isDraft?: boolean,
): Promise<TResult> {
  if (!process.env.DATOCMS_READONLY_API_TOKEN) {
    throw new Error("Missing DatoCMS API token.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Exclude-Invalid": "true",
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  };

  if (isDraft || process.env.NODE_ENV === "development") {
    headers["X-Include-Drafts"] = "true";
  }

  const queryId = await generateQueryId(document, variables);

  const [data, response] = await rawExecuteQuery(document, {
    token: process.env.DATOCMS_READONLY_API_TOKEN,
    excludeInvalid: true,
    returnCacheTags: true,
    variables,
    environment: getExplicitEnvironment(),
    requestInitOptions: {
      cache: "force-cache",
      next: {
        tags: [queryId],
      },
    } as RequestInit,
  });

  const cacheTags = parseXCacheTagsResponseHeader(
    response.headers.get("x-cache-tags"),
  );

  await storeQueryCacheTags(queryId, cacheTags);

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
  const hashInput = print(document) + stringify(variables ?? {});
  const data = encoder.encode(hashInput);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const queryDatoCMS = cacheWithDeepCompare(
  executeQueryWithoutMemoization,
);

function cacheWithDeepCompare<A extends unknown[], R>(
  fn: (...args: A) => R | Promise<R>,
): (...args: A) => Promise<R> {
  const cachedFn = cache((serialized: string): Promise<R> => {
    return Promise.resolve(fn(...(JSON.parse(serialized) as A)));
  });

  return (...args: A): Promise<R> => {
    const serialized = JSON.stringify(args);
    return cachedFn(serialized);
  };
}
