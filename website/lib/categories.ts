export const CATEGORIES = [
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "graphic-design", label: "Graphic Design" },
  { value: "website-development", label: "Website Development" },
  { value: "mobile-app-development", label: "Mobile App Development" },
  { value: "seo", label: "SEO" },
  { value: "influencer-marketing", label: "Influencer Marketing" },
  { value: "reputation-management", label: "Reputation Management" },
  { value: "social-media-marketing", label: "Social Media Marketing" },
  { value: "performance-marketing", label: "Performance Marketing" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_VALUES = CATEGORIES.map((c) => c.value) as [CategoryValue, ...CategoryValue[]];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
