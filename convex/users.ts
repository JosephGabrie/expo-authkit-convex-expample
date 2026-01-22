import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const store = mutation({
  args: {
    id: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    profilePictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.id))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName || undefined,
        lastName: args.lastName || undefined,
        profilePictureUrl: args.profilePictureUrl || undefined,
      });
      return existingUser._id;
    } else {
      // Create new user
      const newUserId = await ctx.db.insert("users", {
        tokenIdentifier: args.id,
        email: args.email,
        firstName: args.firstName || undefined,
        lastName: args.lastName || undefined,
        profilePictureUrl: args.profilePictureUrl || undefined,
      });
      return newUserId;
    }
  },
});
