export type PlanId = "starter" | "pro";

export const plans: Record<
  PlanId,
  {
    name: string;
    priceMonthlyUsd: number;
    credits: number;
  }
> = {
  starter: {
    name: "Starter",
    priceMonthlyUsd: 25,
    credits: 500,
  },
  pro: {
    name: "Pro",
    priceMonthlyUsd: 49,
    credits: 1000,
  },
};

export const defaultPlan: PlanId = "starter";

