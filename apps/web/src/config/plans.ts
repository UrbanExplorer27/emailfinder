export type PlanId = "trial" | "starter" | "pro";

export const plans: Record<
  PlanId,
  {
    name: string;
    priceMonthlyUsd: number;
    credits: number;
  }
> = {
  trial: {
    name: "Free Trial",
    priceMonthlyUsd: 0,
    credits: 5,
  },
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

export const defaultPlan: PlanId = "trial";

