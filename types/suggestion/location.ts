import { z } from "zod";
import { SuggestionSchema } from ".";

export const LocationType = {
  CITY: "city",
  STATE: "state",
  COUNTRY: "country",
  REGION: "region",
  VENUE: "venue",
} as const;

export const LocationSchema = SuggestionSchema.extend({
  type: z
    .string()
    .refine((type) => Object.keys(LocationType).includes(type.toUpperCase()))
    .transform((type) => type.toUpperCase())
    .optional(),
});

export const LocationResponseSchema = z.object({
  formattedLocations: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      displayName: z.string(),
      latitude: z.coerce.number(),
      longitude: z.coerce.number(),
      iso: z.string().optional(),
      locationType: z.string(),
      city: z
        .object({
          id: z.string().uuid(),
          name: z.string(),
          latitude: z.coerce.number(),
          longitude: z.coerce.number(),
        })
        .nullable()
        .optional(),
      state: z
        .object({
          id: z.string().uuid(),
          name: z.string(),
          latitude: z.coerce.number(),
          longitude: z.coerce.number(),
        })
        .nullable()
        .optional(),
      country: z
        .object({
          id: z.string().uuid(),
          name: z.string(),
          latitude: z.coerce.number(),
          longitude: z.coerce.number(),
          iso: z.string().optional(),
        })
        .nullable()
        .optional(),
    })
  ),
});

export type LocationQuery = z.infer<typeof LocationSchema>;
export type LocationResponse = z.infer<typeof LocationResponseSchema>;
