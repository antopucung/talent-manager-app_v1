import { api, APIError } from "encore.dev/api";
import { talentDB } from "../talent/db";

export interface CreateSubscriptionRequest {
  userType: "talent" | "client";
  userId: number;
  subscriptionType: "gallery_upgrade" | "verification" | "ai_premium";
  tier: "basic" | "premium";
  billingCycle: "monthly" | "yearly";
}

export interface SubscriptionResponse {
  id: number;
  expiresAt: Date;
  price: number;
}

// Creates a new subscription for a user.
export const createSubscription = api<CreateSubscriptionRequest, SubscriptionResponse>(
  { expose: true, method: "POST", path: "/subscriptions" },
  async (req) => {
    // Calculate price based on subscription type and tier
    let price = 0;
    const multiplier = req.billingCycle === "yearly" ? 10 : 1; // 2 months free for yearly

    switch (req.subscriptionType) {
      case "gallery_upgrade":
        price = req.tier === "premium" ? 29.99 : 14.99;
        break;
      case "verification":
        price = 9.99;
        break;
      case "ai_premium":
        price = req.tier === "premium" ? 49.99 : 24.99;
        break;
    }

    price *= multiplier;

    // Calculate expiration date
    const now = new Date();
    const expiresAt = new Date(now);
    if (req.billingCycle === "yearly") {
      expiresAt.setFullYear(now.getFullYear() + 1);
    } else {
      expiresAt.setMonth(now.getMonth() + 1);
    }

    const subscription = await talentDB.queryRow<any>`
      INSERT INTO subscriptions (
        user_type, user_id, subscription_type, tier, price, 
        billing_cycle, expires_at
      ) VALUES (
        ${req.userType}, ${req.userId}, ${req.subscriptionType}, 
        ${req.tier}, ${price}, ${req.billingCycle}, ${expiresAt}
      ) RETURNING *
    `;

    if (!subscription) {
      throw new Error("Failed to create subscription");
    }

    // Update talent subscription if it's a talent subscription
    if (req.userType === "talent") {
      if (req.subscriptionType === "verification") {
        await talentDB.exec`
          UPDATE talents 
          SET is_verified = true, subscription_expires_at = ${expiresAt}
          WHERE id = ${req.userId}
        `;
      } else {
        const newTier = req.tier === "premium" ? "premium" : "basic";
        await talentDB.exec`
          UPDATE talents 
          SET subscription_tier = ${newTier}, subscription_expires_at = ${expiresAt}
          WHERE id = ${req.userId}
        `;
      }
    }

    return {
      id: subscription.id,
      expiresAt: subscription.expires_at,
      price: subscription.price
    };
  }
);
