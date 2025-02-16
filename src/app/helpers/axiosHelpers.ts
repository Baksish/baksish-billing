import axios from "axios";
import toast from "react-hot-toast";

type API_Params = {
  payload?: Object;
  endpoint: string;
};

export const billingAxiosInstancePost = async (
  endpoint:string,
  payload: Object
) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY, // Replace with the actual API key
      },
    });
    // Return the response data
    return response.data;
  } catch (error: any) {
    toast.error("Error posting data:",error);
  }
};

export const billingAxiosInstanceGet = async (endpoint:string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY, // Replace with the actual API key
        },
      });
      // Return the response data
      return response.data;
    } catch (error: any) {
      toast.error("Error getting data:",error);
    }
};

export const billingAxiosInstancePut = async (endpoint: string, payload: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
        payload, // The payload should go as the body
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY, // Replace with the actual API key
          },
        }
      );
      // Return the response data
      return response.data;
    } catch (error: any) {
      toast.error("Error updating data:",error);
    }
};

export const billingAxiosInstanceDelete = async (endpoint: string) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY, // Replace with the actual API key
        },
      }
    );
    return response.data;
  } catch (error: any) {
    toast.error("Error deleting data:",error);
  }
};


  