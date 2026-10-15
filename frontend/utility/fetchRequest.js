export const getDataAPI = async (endPoint, responseErrorMsg, options = {}) => {
  try {

    const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/${endPoint}`, {
      ...options,
      credentials: "include",
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw Error(`${responseErrorMsg}: ${data.message}`);
    }
    
    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
