export const myFetch = async (
    url: string,
    options?: RequestInit | undefined
  ): Promise<{ data?: any | undefined; error?: any | undefined }> => {
    const response = await fetch(url, {
      
      
      credentials: "include",
      mode: "cors",
  
      // headers: {
      //   "Content-Type" : "application/json"
      // },
      ...options
    });
    const result = await response.json();
    console.log(JSON.stringify(response.headers));
    
    const { error, data } = result;
    if (error &&
      error.status === 401 &&
      error.message === "Incorrect or Expired Cookies"
    ) {
    }
    return {
      error: result.error ? error : null,
      data: result.data ? data : null,
    };
  };