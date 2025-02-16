import { useEffect, useState } from "react";
import { billingAxiosInstanceGet, billingAxiosInstancePost, billingAxiosInstancePut } from "../helpers/axiosHelpers";
import endpoints from "../helpers/endpoints";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { queryKeys } from "../helpers/queryKeys";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const updateRestaurantDetails = async (restaurantId: string, payload: Object) => {
    try {
      const response = await billingAxiosInstancePut(
        `${endpoints.UPDATE_RESTAURANT_DETAILS}${restaurantId}`,
        payload
      );
      return response.data;
    } catch (error) {
      toast.error("Error updating restaurant details");
    }
  };

  export const useUpdateRestaurantDetails = () => {
    const queryClient = useQueryClient();  
    return useMutation(
      (data: { restaurant_id: string; payload: Object }) =>
        updateRestaurantDetails(data.restaurant_id, data.payload),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([queryKeys.menu]);
          toast.success("Menu item updated successfully");
        },
        onError: (error: AxiosError) => {
          toast.error("Error updating order status");
        },
      }
    );
  };
  
  
  export const fetchRestaurantMenu = async (restaurant_id: string) => {
    const menu = await billingAxiosInstanceGet(
      `${endpoints.FETCH_MENU}${restaurant_id}`
    );
    return menu.menu;
  };

  export const useFetchRestaurantMenu = () => {
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        const restaurantDetails = storedUser
          ? JSON.parse(storedUser)
          : null;
        setRestaurantId(restaurantDetails?.id || null);
      }
    }, []);
  
    return useQuery(
      [queryKeys.menu, restaurantId], // Query key
      () => fetchRestaurantMenu(restaurantId!), // Query function
      {
        enabled: !!restaurantId, // Only fetch if restaurantId is available
        // staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
        // retry: 3, // Retry up to 3 times on failure
        onError: (error: AxiosError) => {
          toast.error("Error fetching menu:");
        },
      }
    );
  };


  
  


