import client from "./client.js";

/**
 * Get a cached value by key. Returns parsed JSON, or null if missing/on error.
 */
export const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis GET failed for key "${key}":`, error.message);
    return null;
  }
};

/**
 * Set a cached value with a TTL (in seconds). Default TTL: 5 minutes.
 * ioredis syntax: SET key value EX seconds
 */
export const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.error(`Redis SET failed for key "${key}":`, error.message);
  }
};

/**
 * Delete a single cache key.
 */
export const deleteCache = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    console.error(`Redis DEL failed for key "${key}":`, error.message);
  }
};

/**
 * Delete every key matching a pattern, e.g. "projects:tenant:123:*"
 * Uses SCAN (not KEYS) so it never blocks Redis, even with a large keyspace.
 */
export const deleteCacheByPattern = async (pattern) => {
  try {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await client.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error(`Redis SCAN/DEL failed for pattern "${pattern}":`, error.message);
  }
};