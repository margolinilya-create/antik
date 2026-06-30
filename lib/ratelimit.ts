import "server-only";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Env-gated: a no-op limiter (always allows) until Upstash creds are provided.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const limiter =
  url && token
    ? new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(6, "60 s"),
        prefix: "rl:lead",
        analytics: false,
      })
    : null;

/**
 * Returns true when the current client has exceeded the lead-submission rate
 * limit. Fails OPEN: no limiter configured, or limiter error → never blocks.
 */
export async function leadRateLimited(): Promise<boolean> {
  if (!limiter) return false;
  try {
    const h = await headers();
    const ip = (
      h.get("x-forwarded-for")?.split(",")[0] ??
      h.get("x-real-ip") ??
      "anon"
    ).trim();
    const { success } = await limiter.limit(`lead:${ip}`);
    return !success;
  } catch {
    return false;
  }
}
