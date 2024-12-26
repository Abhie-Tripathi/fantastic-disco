import { useApi } from "@/hooks/useApi";
import { endpoints } from "@/config/endpoints";
export const useProfileServices = () => {
  const api = useApi();

  const getMyProfileData = async () => {
    const response = await api.request(
      `${endpoints.myprofile}`
    
    );
    if (!response) {
      throw new Error("Failed to get data.");
    }

    return response;
  };


  const updateMyProfileData = async ({formData}:any) => {
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
  

  return {
    getMyProfileData,
    updateMyProfileData,
    isLoading: api.isLoading,
    error: api.error,
  };
};
