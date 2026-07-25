import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  sessions: defineTable({
    userId: v.id("users"),
    sessionToken: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_sessionToken", ["sessionToken"]),

  leads: defineTable({
    name: v.string(),
    email: v.string(),
    budgetRange: v.string(),
    message: v.string(),
    status: v.union(v.literal("New"), v.literal("Contacted"), v.literal("Closed")),
    createdAt: v.number(),
  }),
});
