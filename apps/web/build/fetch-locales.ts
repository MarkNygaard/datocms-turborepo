import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://graphql.datocms.com/", {
  headers: {
    Authorization: `Bearer ${process.env.DATOCMS_READONLY_API_TOKEN}`,
  },
});

const QUERY = gql`
  {
    _site {
      locales
    }
  }
`;

export async function fetchLocales() {
  const data = await client.request<{ _site: { locales: string[] } }>(QUERY);
  const locales = data._site.locales;
  const defaultLocale = locales[0] ?? "en";
  return { locales, defaultLocale };
}
