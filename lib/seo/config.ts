import type {
  SeoKeyword,
  SeoPageConfig,
  SeoTask,
} from "./types";

export const SEO_SITE_URL =
  "https://www.godmillcityguesthouse.com";

export const seoKeywords: SeoKeyword[] = [
  {
    keyword: "Godmill City Guesthouse",
    targetPage: "/",
    intent: "brand",
    priority: "critical",
    cluster: "brand",
    active: true,
  },
  {
    keyword: "accommodation in Taung",
    targetPage: "/accommodation-taung",
    intent: "transactional",
    priority: "critical",
    cluster: "accommodation",
    active: true,
  },
  {
    keyword: "guesthouse in Taung",
    targetPage: "/guesthouse-taung",
    intent: "transactional",
    priority: "critical",
    cluster: "guesthouse",
    active: true,
  },
  {
    keyword: "affordable accommodation Taung",
    targetPage: "/affordable-accommodation-taung",
    intent: "commercial",
    priority: "high",
    cluster: "affordable",
    active: true,
  },
  {
    keyword: "family accommodation Taung",
    targetPage: "/family-accommodation-taung",
    intent: "transactional",
    priority: "high",
    cluster: "family",
    active: true,
  },
  {
    keyword: "business accommodation Taung",
    targetPage: "/business-accommodation-taung",
    intent: "transactional",
    priority: "high",
    cluster: "business",
    active: true,
  },
  {
    keyword: "rooms in Taung",
    targetPage: "/rooms-taung",
    intent: "transactional",
    priority: "high",
    cluster: "rooms",
    active: true,
  },
];

export const seoPages: SeoPageConfig[] = [
  {
    name: "Homepage",
    route: "/",
    sourceFile: "app/page.tsx",
    metadataFile: "app/layout.tsx",
    primaryKeyword: "Godmill City Guesthouse",
    purpose: "Brand authority and direct booking",
    seoTarget: true,
  },
  {
    name: "Accommodation in Taung",
    route: "/accommodation-taung",
    sourceFile: "app/accommodation-taung/page.tsx",
    primaryKeyword: "accommodation in Taung",
    purpose: "Primary Taung accommodation landing page",
    seoTarget: true,
  },
  {
    name: "Guesthouse in Taung",
    route: "/guesthouse-taung",
    sourceFile: "app/guesthouse-taung/page.tsx",
    primaryKeyword: "guesthouse in Taung",
    purpose: "Guesthouse search intent",
    seoTarget: true,
  },
  {
    name: "Affordable Accommodation",
    route: "/affordable-accommodation-taung",
    sourceFile: "app/affordable-accommodation-taung/page.tsx",
    primaryKeyword: "affordable accommodation Taung",
    purpose: "Price-sensitive accommodation searches",
    seoTarget: true,
  },
  {
    name: "Family Accommodation",
    route: "/family-accommodation-taung",
    sourceFile: "app/family-accommodation-taung/page.tsx",
    primaryKeyword: "family accommodation Taung",
    purpose: "Family and small-group stays",
    seoTarget: true,
  },
  {
    name: "Business Accommodation",
    route: "/business-accommodation-taung",
    sourceFile: "app/business-accommodation-taung/page.tsx",
    primaryKeyword: "business accommodation Taung",
    purpose: "Business and contractor travel",
    seoTarget: true,
  },
  {
    name: "Rooms in Taung",
    route: "/rooms-taung",
    sourceFile: "app/rooms-taung/page.tsx",
    primaryKeyword: "rooms in Taung",
    purpose: "Room-selection search intent",
    seoTarget: true,
  },
  {
    name: "Gallery",
    route: "/gallery",
    sourceFile: "app/gallery/page.tsx",
    primaryKeyword: "Godmill City Guesthouse",
    purpose: "Visual trust and property discovery",
    seoTarget: false,
  },
];

export const defaultSeoTasks: SeoTask[] = [
  {
    id: "reviews",
    title: "Grow genuine Google reviews",
    description:
      "Ask real checked-out guests for honest Google reviews and respond consistently to new reviews.",
    priority: "critical",
    category: "reviews",
    status: "in_progress",
  },
  {
    id: "profile",
    title: "Keep Google Business Profile complete",
    description:
      "Maintain accurate rooms, amenities, website, phone number, address and property information.",
    priority: "critical",
    category: "local",
    status: "in_progress",
  },
  {
    id: "citations",
    title: "Build reputable local citations",
    description:
      "Create consistent Godmill listings across trustworthy tourism, accommodation and business directories.",
    priority: "high",
    category: "authority",
    status: "todo",
  },
  {
    id: "content",
    title: "Publish useful Taung visitor content",
    description:
      "Create genuinely helpful travel content instead of repetitive keyword landing pages.",
    priority: "high",
    category: "content",
    status: "todo",
  },
  {
    id: "conversion",
    title: "Improve direct-booking conversion",
    description:
      "Keep booking actions prominent and remove unnecessary friction between search visitor and reservation.",
    priority: "high",
    category: "conversion",
    status: "in_progress",
  },
  {
    id: "photos",
    title: "Add fresh original property photography",
    description:
      "Add genuine new room, exterior, pool and facility photos whenever they become available.",
    priority: "medium",
    category: "content",
    status: "todo",
  },
];
