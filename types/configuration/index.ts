import { z } from "zod";
import { FilterNames } from "../events/dto/event-query.dto";

export enum FilterGroup {
  BASIC = "basic",
  ADVANCE = "advance",
  INSIGHT = "insight",
  AUDIENCE = "audience",
}

export const filterValueSchema = z.object({
  allowedValues: z.array(z.string()),
  group: z.nativeEnum(FilterGroup),
});

const InterestSchema = z.object({
  label: z.string(),
  status: z.string(),
});

const OutreachSchema = z.object({
  label: z.string(),
  status: z.string(),
});

const FilterConfigurationSchema = z.object({
  data: z.record(z.string(), z.any()),
  source: z.string(),
});

export const AccountConfigSchema = z.strictObject({
  interest: InterestSchema,
  outreach: OutreachSchema,
  filter: FilterConfigurationSchema,
});

export const accountConfig = {
  interest: [
    {
      label: "Bookmark",
      source: "research",
      status: "BOOKMARK",
      position: 1,
    },
    {
      label: "Speak",
      source: "research",
      status: "SPEAK",
      position: 2,
    },
    {
      label: "Sponsor",
      source: "research",
      status: "SPONSOR",
      position: 3,
    },
    {
      label: "Attend",
      source: "research",
      status: "ATTEND",
      position: 4,
    },
    {
      label: "Exhibit",
      source: "research",
      status: "EXHIBIT",
      position: 5,
    },
  ],
  outreach: [
    {
      label: "Pending",
      source: "coordinate",
      status: "PENDING",
      position: 1,
    },
    {
      label: "In Discussion",
      source: "outreach",
      status: "IN_DISCUSSION",
      position: 2,
    },
    {
      label: "Shortlisted",
      source: "outreach",
      status: "SHORTLISTED",
      position: 3,
    },
    {
      label: "In Negotiation",
      source: "outreach",
      status: "IN_NEGOTIATION",
      position: 4,
    },
    {
      label: "Confirmed",
      source: "outreach",
      status: "CONFIRMED",
      position: 5,
    },
    {
      label: "Cancelled",
      source: "coordinate",
      status: "CANCELLED",
      position: 6,
    },
    {
      label: "Rejected",
      source: "coordinate",
      status: "REJECTED",
      position: 7,
    },
  ],
  filter: {},
};

export interface InterestConfigurationResponse {
  interest: InterestConfiguration[];
}

export interface OutreachConfigurationResponse {
  outreach: OutreachConfiguration[];
}

export type InterestConfiguration = z.infer<typeof InterestSchema>;
export type OutreachConfiguration = z.infer<typeof OutreachSchema>;
export type FilterConfiguration = z.infer<typeof FilterConfigurationSchema>;
export type AccountConfig = z.infer<typeof AccountConfigSchema>;
