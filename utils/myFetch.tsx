export const myFetch = async (
  url: string,
  options?: RequestInit | undefined
): Promise<{ data?: any | undefined; error?: any | undefined }> => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    mode: "cors",
  });
  const result = await response.json();
  console.log(response)
  // console.log(JSON.stringify(response.headers));

  const { error, data } = result;
  if (
    error &&
    error.status === 401 &&
    error.message === "Incorrect or Expired Cookies"
  ) {
  }
  return {
    error: result.error ? error : null,
    data: result.data ? data : null,
  };
};
