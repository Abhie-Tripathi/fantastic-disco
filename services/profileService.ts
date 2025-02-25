import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
import { MembershipData } from "@/types/user";
export const useProfileServices = () => {
  const api = useApi();

  const getMyProfileData = async () => {
    const response = await api.request(`${endpoints.myprofile}`);
    if (!response) {
      throw new Error("Failed to get data.");
    }

    return response;
  };

  const updateMyProfileData = async ({ formData }: any) => {
    // const response = await api.request(`${endpoints.myprofile}`, {
    //   method: "PATCH",
    //   data: formData,
    // });
    return api.request(`${endpoints.myprofile}`, {
      method: "PATCH",
      data: formData,
    });
    // console.log("response_",response)
  };

  /**
   * Fetches the user membership data.
   *
   * @returns {Promise<MembershipData | null>} User membership data according to the type {@link MembershipData}
   */
  const getMembershipData = async (): Promise<MembershipData | null> => {
    try {
      const response = await api.request<MembershipData>(
        `${endpoints.membership.getMembership}`,
        {
          method: "GET",
        }
      );
      return response || null;
    } catch (error) {
      console.log("Error fetching membership data:", error);
      return null;
    }
  };

  return {
    getMyProfileData,
    updateMyProfileData,
    getMembershipData,
    isLoading: api.isLoading,
    error: api.error,
  };
};
