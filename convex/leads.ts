import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import * as z from "zod";
import { leadSchema, leadStatus } from "../src/lib/validations/lead";

export const getLeads = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").take(500);
  },
});

export const createLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    budgetRange: v.union(
      v.literal("5k-10k"),
      v.literal("10k-25k"),
      v.literal("25k-50k"),
      v.literal("50k+")
    ),
    message: v.string(),
    status: v.optional(v.union(v.literal("New"), v.literal("Contacted"), v.literal("Closed"))),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const validation = leadSchema.safeParse({
      name: args.name,
      email: args.email,
      budget: args.budgetRange,
      message: args.message,
    });

    if (!validation.success) {
      throw new ConvexError(validation.error.issues[0]?.message ?? "Invalid lead data.");
    }

    return await ctx.db.insert("leads", {
      name: args.name,
      email: args.email.toLowerCase().trim(),
      budgetRange: args.budgetRange,
      message: args.message,
      status: args.status || "New",
      createdAt: args.createdAt || Date.now(),
    });
  },
});

export const updateLeadStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.union(v.literal("New"), v.literal("Contacted"), v.literal("Closed")),
  },
  handler: async (ctx, args) => {
    const validation = z.enum(leadStatus).safeParse(args.status);

    if (!validation.success) {
      throw new ConvexError(validation.error.issues[0]?.message ?? "Invalid lead status.");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});
