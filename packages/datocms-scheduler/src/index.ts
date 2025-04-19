import { fileURLToPath } from "node:url";
import { buildClient } from "@datocms/cma-client-node";
import { config } from "dotenv";
import { gql, request } from "graphql-request";

import type { CacheTag } from "../../datocms/src/cache-tags.ts";
import { database } from "../../datocms/src/database.ts";

config();

const READ_API_URL = process.env.DATOCMS_READ_API_URL!;
const TOKEN = process.env.DATOCMS_API_TOKEN!;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "X-Environment": "main", // always read config from main
};

// ---------- GraphQL Query (Content Delivery API) ----------

const CAMPAIGN_QUERY = gql`
  {
    campaignSetting {
      campaignStart
      campaignEnd
      targetEnvironment
      active
    }
  }
`;

interface CampaignQueryResult {
  campaignSetting: {
    campaignStart: string;
    campaignEnd: string;
    targetEnvironment: string;
    active: boolean;
  };
}

// ---------- Management API Client ----------

const client = buildClient({ apiToken: TOKEN });

// ---------- Fetch campaign config from GraphQL ----------

async function getCampaignConfig() {
  try {
    const res = await request<CampaignQueryResult>(
      READ_API_URL,
      CAMPAIGN_QUERY,
      undefined,
      headers,
    );

    if (!res.campaignSetting.active) {
      console.log("🚫 Campaign config is not active");
      return null;
    }

    return res.campaignSetting;
  } catch (err) {
    console.error("Error fetching campaign config:", err);
    return null;
  }
}

// ---------- Get currently promoted environment ----------

async function getCurrentlyActiveEnvironment() {
  try {
    const environments = await client.environments.list();

    const active = environments.find((env) => env.meta.primary);
    return active?.id ?? null;
  } catch (err: any) {
    console.error(
      "Failed to fetch environments:",
      err.response?.data ?? err.message,
    );
    return null;
  }
}

// ---------- Promote a new environment to main ----------

async function promoteEnvironment(env: string) {
  try {
    await client.environments.promote(env);
    console.log(`✅ Successfully promoted '${env}' to main`);

    // 👇 NEW: invalidate all tags in Turso
    const tags = await allCacheTags();
    if (tags.length > 0) {
      await sendCacheInvalidationWebhook(tags);
    } else {
      console.log("⚠️ No cache tags found in DB to invalidate");
    }
  } catch (err: any) {
    console.error(
      `❌ Failed to promote '${env}':`,
      err.response?.data ?? err.message,
    );
  }
}

// ---------- Fetch all cache tags from Turso ----------
export async function allCacheTags(): Promise<CacheTag[]> {
  const { rows } = await database().execute(`
    SELECT DISTINCT cache_tag FROM query_cache_tags
  `);

  return rows.map((row) => row.cache_tag as CacheTag);
}

// ---------- Invalidate cache tags ----------
async function sendCacheInvalidationWebhook(tags: CacheTag[]) {
  try {
    const res = await fetch(process.env.CACHE_INVALIDATION_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Revalidate-Token": process.env.CACHE_INVALIDATION_SECRET_TOKEN!,
        "X-Site-Id": process.env.DATOCMS_SITE_ID ?? "", // optional but matches DatoCMS
        "X-Webhook-Id": "manual-invalidation", // use a fixed value or UUID
      },
      body: JSON.stringify({
        webhook_call_id: "manual-" + Date.now(),
        event_triggered_at: new Date().toISOString(),
        attempted_auto_retries_count: 0,
        webhook_id: "manual-invalidation",
        site_id: process.env.DATOCMS_SITE_ID ?? "manual",
        entity_type: "cda_cache_tags",
        event_type: "invalidate",
        entity: {
          id: "cda_cache_tags",
          type: "cda_cache_tags",
          attributes: {
            tags,
          },
        },
        related_entities: [],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Invalidation webhook failed: ${body}`);
    }

    console.log("✅ Cache invalidation triggered for tags");
  } catch (err) {
    console.error("❌ Cache invalidation failed:", err);
  }
}

// ---------- Scheduler Runner ----------

export async function runScheduler() {
  const config = await getCampaignConfig();
  if (!config) return;

  const now = new Date();
  const start = new Date(config.campaignStart);
  const end = new Date(config.campaignEnd);
  const campaignEnv = config.targetEnvironment;

  let targetEnv = "main";
  if (now >= start && now < end) {
    targetEnv = campaignEnv;
  }

  const current = await getCurrentlyActiveEnvironment();

  if (!current) {
    console.error(
      "❌ Could not determine current active environment — skipping promotion.",
    );
    return;
  }

  if (current !== targetEnv) {
    console.log(`🔁 Switching environment from '${current}' to '${targetEnv}'`);
    await promoteEnvironment(targetEnv);
  } else {
    console.log(`✅ Environment already set to '${targetEnv}'. No changes.`);
  }
}

// ✅ Only run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runScheduler().catch((err) => {
    console.error("❌ Scheduler failed:", err);
    process.exit(1);
  });
}
