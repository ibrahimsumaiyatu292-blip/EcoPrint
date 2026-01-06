import { neon } from "@neondatabase/serverless"

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.warn("No DATABASE_URL set; DB operations are disabled in this environment.")
    return null
  }
  return neon(url)
}
