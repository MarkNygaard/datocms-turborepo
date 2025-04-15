import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  generates: {
    "src/types/datocms.ts": {
      schema: {
        "https://graphql.datocms.com": {
          headers: {
            Authorization: process.env.DATOCMS_READONLY_API_TOKEN ?? "",
          },
        },
      },
      overwrite: true,
      documents: [
        "src/**/*.gql",
        "src/**/**/*.graphql",
        "src/**/**/**/*.graphql",
      ],
      plugins: ["typescript", "typed-document-node", "typescript-operations"],
      config: {
        dedupeFragments: true,
        pureMagicComment: true,
        exportFragmentSpreadSubTypes: true,
        namingConvention: "keep",
      },
    },
  },
};

export default config;
