// Types and fallback content for pages editable from /admin. Safe to import in client components.

export type HomeContent = {
  badge: string;
  title: string;
  description: string;
  primary_label: string;
  primary_href: string;
  secondary_label: string;
  secondary_href: string;
  stats: { value: number; decimals: number; prefix: string; suffix: string; label: string }[];
  intro_title: string;
  intro_text: string;
  intro_image: string;
  clients: { name: string; logo: string }[];
  process: { title: string; text: string }[];
  industries: string[];
  faqs: { q: string; a: string }[];
  videos_title: string;
  videos_text: string;
  included_title: string;
  included_text: string;
  included_cta_label: string;
  included_cta_href: string;
  included: { title: string; text: string }[];
  process_title: string;
  process_text: string;
  process_cta_label: string;
  process_cta_href: string;
};

export type AboutContent = {
  hero_title: string;
  hero_description: string;
  story_title: string;
  story: string;
  story_image: string;
  mission: string;
  vision: string;
  values: { title: string; text: string }[];
  stats: { value: number; suffix: string; label: string }[];
  team: { name: string; role: string; photo: string }[];
  why: { title: string; text: string }[];
  cta_title: string;
  cta_text: string;
};

export type SettingsContent = {
  company_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
  youtube: string;
};

export type ContentMap = { home: HomeContent; about: AboutContent; settings: SettingsContent };
export type ContentKey = keyof ContentMap;

export const DEFAULT_HOME: HomeContent = {
  badge: "Full-service digital marketing agency",
  title: "Marketing that fills your pipeline, not just your feed.",
  description:
    "MyWorkAgency plans, designs and builds campaigns, websites and apps that bring in qualified leads and turn them into customers.",
  primary_label: "See our work",
  primary_href: "/work",
  secondary_label: "About us",
  secondary_href: "/about",
  // Placeholder numbers: replace with your real figures in Admin > Pages > Home.
  stats: [
    { value: 150, decimals: 0, prefix: "", suffix: "+", label: "Brands served" },
    { value: 4.8, decimals: 1, prefix: "", suffix: "x", label: "Average return on ad spend" },
    { value: 95, decimals: 0, prefix: "", suffix: "%", label: "Clients who stay with us" },
  ],
  intro_title: "One partner for strategy, creative and technology",
  intro_text:
    "We bring marketing, design and development together so every campaign, page and product works as one system.\n\nEdit this text in Admin > Pages > Home to tell your own story: who you help, how you work and what makes you different.",
  intro_image: "",
  clients: [],
  process: [
    { title: "Tell us your goals", text: "Share what you want to achieve. We listen first and ask the right questions." },
    { title: "Get a clear plan", text: "We map out the strategy, deliverables and timeline so you know what happens next." },
    { title: "We design and build", text: "Our team creates your campaigns, creative and technology, with check-ins along the way." },
    { title: "Launch", text: "Everything goes live after testing, with tracking set up from day one." },
    { title: "We keep improving", text: "We monitor results, report in plain language and keep refining what works." },
  ],
  industries: ["Retail and e-commerce", "Real estate", "Healthcare", "Education", "Hospitality", "Technology", "Finance", "Food and beverage"],
  faqs: [
    { q: "How do we get started?", a: "Tell us about your business and goals. We will review them and suggest a plan that fits." },
    { q: "Which services do you offer?", a: "Digital marketing, SEO, social media, performance marketing, influencer marketing, reputation management, UI/UX and graphic design, and website and mobile app development." },
    { q: "Can I choose only one service?", a: "Yes. You can start with a single service and add more as your needs grow." },
    { q: "How will I know what is working?", a: "We share clear reports on the numbers that matter to your business, in plain language." },
  ],
  videos_title: "AI video showcase",
  videos_text: "A look at the AI-powered videos we create for brands.",
  // Placeholder wording: edit it in Admin > Home page so it describes what you really offer.
  included_title: "Everything included",
  included_text: "One team handles the whole job, so you do not have to manage a pile of separate suppliers.",
  included_cta_label: "Explore our work",
  included_cta_href: "/work",
  included: [
    { title: "Strategy and design", text: "A plan and a polished look built around your brand and your audience." },
    { title: "Build and launch", text: "Websites, apps and campaigns built carefully, tested and launched on time." },
    { title: "Support and growth", text: "Ongoing help and reporting, so what we build keeps performing." },
  ],
  process_title: "How it works",
  process_text: "From first conversation to ongoing results, in five simple steps.",
  process_cta_label: "",
  process_cta_href: "",
};

export const DEFAULT_ABOUT: AboutContent = {
  hero_title: "We help ambitious brands grow online",
  hero_description:
    "A team of marketers, designers and developers working as one, so your strategy, creative and technology always pull in the same direction.",
  story_title: "Our story",
  story:
    "Edit this text in Admin > Pages > About.\n\nTell visitors how the company started, what you believe in and what makes your approach different.",
  story_image: "",
  mission: "Edit this in Admin > Pages > About. Describe the purpose that drives your work.",
  vision: "Edit this in Admin > Pages > About. Describe where you want to take the company.",
  values: [
    { title: "Results first", text: "Every campaign is tied to a number that matters to your business." },
    { title: "Honest communication", text: "Clear updates, plain language and no surprises." },
    { title: "Craft", text: "Design and code made with care, down to the last detail." },
  ],
  stats: [],
  team: [],
  why: [
    { title: "One team for everything", text: "Marketing, design and development under one roof." },
    { title: "Built around your goals", text: "We start with your targets, then choose the channels." },
    { title: "Transparent reporting", text: "You always see what is working and what is not." },
  ],
  cta_title: "Ready to grow your business?",
  cta_text: "Tell us about your goals and we will show you how we can help.",
};

export const DEFAULT_SETTINGS: SettingsContent = {
  company_name: "MyWorkAgency",
  tagline: "Digital marketing, design and development that bring in qualified leads.",
  email: "",
  phone: "",
  address: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  x: "",
  youtube: "",
};

export const CONTENT_DEFAULTS: ContentMap = {
  home: DEFAULT_HOME,
  about: DEFAULT_ABOUT,
  settings: DEFAULT_SETTINGS,
};
