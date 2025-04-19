export { queryDatoCMS, executeQueryWithoutMemoization } from "./datocms";
export { parseXCacheTagsResponseHeader } from "./cache-tags";
export {
  storeQueryCacheTags,
  queriesReferencingCacheTags,
  deleteQueries,
  truncateAssociationsTable,
} from "./database";
export type { CacheTag } from "./cache-tags";

// Validate environment variables
function validateEnvironmentVariables() {
  const requiredVariables = [
    "DATOCMS_READONLY_API_TOKEN",
    "DATOCMS_ENVIRONMENT",
    "CACHE_INVALIDATION_SECRET_TOKEN",
    "DRAFT_SECRET_TOKEN",
    "TURSO_DATABASE_URL",
    "TURSO_AUTH_TOKEN",
    "URL",
  ];

  requiredVariables.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not defined.`);
    }
  });
}

// Perform validation when the package is imported
validateEnvironmentVariables();
