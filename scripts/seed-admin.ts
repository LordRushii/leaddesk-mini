import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { hashPassword } from "../src/lib/password";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required. Set both environment variables before running pnpm seed:admin."
    );
  }

  if (!convexUrl) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_URL or CONVEX_URL is required. Set the Convex URL before running pnpm seed:admin."
    );
  }

  const convex = new ConvexHttpClient(convexUrl);
  const existingUser = await convex.query(api.users.getUserByEmail, { email });

  if (existingUser) {
    console.log(`Admin already exists for ${email}. No changes were made.`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await convex.mutation(api.users.createUser, {
    name: "LeadDesk Admin",
    email,
    passwordHash,
    role: "Super Admin",
    createdAt: Date.now(),
  });

  console.log(`Admin account created for ${email}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Admin seed failed.");
  process.exitCode = 1;
});
