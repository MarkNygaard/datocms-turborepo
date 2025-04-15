# Turborepo starter using Next.js 15 with DatoCMS, cache tags invalidation, shadcn/ui and next-intl

> [!NOTE]
>
> This starter is heavily inspired by DatoCMS own eCommerce demo and their cache-tags starter. Find the repos here: [ecommerce-website-demo](https://github.com/datocms/ecommerce-website-demo) [nextjs-with-cache-tags-starter](https://github.com/datocms/nextjs-with-cache-tags-starter)
> A lot of inspiration for the basic turborepo settings comes from the Create T3 Turbo repo. Find the repo here: [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo/)

## Demo

Have a look at the end result live:

### [https://ecommerce-website-demo-livid.vercel.app/](https://ecommerce-website-demo-livid.vercel.app/)

## Getting Started

### Step 1: Clone the DatoCMS project

1. [Create an account on DatoCMS](https://datocms.com).

2. Make sure that you have set up the [Github integration on Vercel](https://vercel.com/docs/git/vercel-for-github).

3. Press this button to create a new project on DatoCMS containing the data expected by this project:

[![Clone DatoCMS project](https://dashboard.datocms.com/deploy/button.svg)](https://dashboard.datocms.com/clone?projectId=158348&name=datocms-turborepo)

Once the setup of the project is done, clone the repo locally.

### Step 2: Environment variables

In your DatoCMS' project, go to the **Settings** menu at the top and click **API tokens**.

Then click **Read-only API token** and copy the token.

Next, copy the `.env.example` file in apps/web to `.env` in the same directory (which will be ignored by Git):

```bash
cp .env.example .env.local
```

and set the `DATOCMS_READONLY_API_TOKEN` variable as the API token you just copied.

##### `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`

Simply click the following button to create and initialize a Turso database with the expected schema (sign up or log in to Turso is required):

[![Create a database with Turso](https://sqlite.new/button)](https://sqlite.new?dump=https%3A//raw.githubusercontent.com/datocms/nextjs-with-cache-tags-starter/main/schema.sql)

If you don't see the query_cache_tags table in your turso database you can create it with the SQL console. Input and run the following:

```
CREATE TABLE IF NOT EXISTS query_cache_tags (
  query_id TEXT NOT NULL,
  cache_tag TEXT NOT NULL,
  PRIMARY KEY (query_id, cache_tag)
);
```

Copy the database URL and use it to fill the `TURSO_DATABASE_URL` environment variable.

Also create a token for the database, with no expiration and read/write permissions: copy and use it for the `TURSO_AUTH_TOKEN` variable.

Set the remaining environment variables. A secret token that is being used for WebPreviews and Cache invalidation token you should add to your webhook in DatoCMS:

```
URL=http://localhost:3000
DRAFT_SECRET_TOKEN=superSecretToken
CACHE_INVALIDATION_SECRET_TOKEN=superSecretToken
```

### Step 3: Run your project locally

```bash
pnpm install
pnpm dev
```

Your site will be up and running on [http://localhost:3000](http://localhost:3000)!

## Additional Information

The template works both with a single language and with multiple languages.

The first language set in DatoCMS will be the default language. The Default langauge wont append the url.
If you have e.g. English, Italien and Danish languages enabled in DatoCMS the url's will look like the following.
English: https://localhost:3000
Italian: https://localhost:3000/it
Danish: https://localhost:3000/da

In the footer you will find a Language selector to change between your languages. This language selector will only show if you have multiple languages.

After adding a new language in DatoCMS you will need to run pnpm prebuild for next-intl to be able to use it from the generated locales.config.json file.

#### Structure of the project:

```text
apps
  └─ web
      ├─ Next.js 15
      ├─ React 19
      └─ Tailwind CSS
packages
  ├─ datocms
  |   └─ DatoCMS fetcher with cache-tags validation
  ├─ hooks
  |   └─ General hooks
  └─ ui
      └─ UI package using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```
