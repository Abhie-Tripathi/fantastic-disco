import { Designations } from "@/types/misc"

export const MiscAdapter = {
  adaptDesignationsResponse: (
    response: any
  ): { designations: Designations[] } => {
    if (Array.isArray(response)) {
      return { designations: response };
    }
    return { designations: [] };
  },

}