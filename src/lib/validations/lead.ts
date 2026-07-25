import * as z from "zod";

export const budgetRanges = [
  { value: "5k-10k", label: "$5k - $10k" },
  { value: "10k-25k", label: "$10k - $25k" },
  { value: "25k-50k", label: "$25k - $50k" },
  { value: "50k+", label: "$50k+" },
] as const;

export const leadStatus = ["New", "Contacted", "Closed"] as const;

export const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  budget: z.enum([budgetRanges[0].value, budgetRanges[1].value, budgetRanges[2].value, budgetRanges[3].value], {
    message: "Please select a budget range.",
  }),
  message: z.string().min(10, "Please provide a bit more detail (at least 10 characters)."),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export type Lead = LeadFormData & {
  id: string;
  status: typeof leadStatus[number];
  createdAt: string;
};
