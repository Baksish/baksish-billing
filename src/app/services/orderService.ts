"use client";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import {
  billingAxiosInstanceGet,
  billingAxiosInstancePut,
} from "../helpers/axiosHelpers";
import endpoints from "../helpers/endpoints";
import { AxiosError } from "axios";
import { queryKeys } from "../helpers/queryKeys";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const fetchAllOrders = async (restaurant_id: string) => {
  const orders = await billingAxiosInstanceGet(
    `${endpoints.FETCH_ORDERS}${restaurant_id}`
  );
  return orders;
};

const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await billingAxiosInstancePut(
      `${endpoints.UPDATE_ORDER_STATUS}${orderId}`,
      { order_status: status }
    );
    return response.data;
  } catch (error) {
    toast.error("Error updating order status");
  }
};

export const useFetchAllOrders = () => {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const restaurantDetails = storedUser
        ? JSON.parse(storedUser).restaurant_details
        : null;
      setRestaurantId(restaurantDetails?._id || null);
    }
  }, []);

  return useQuery(
    [queryKeys.orders, restaurantId], // Query key
    () => fetchAllOrders(restaurantId!), // Query function
    {
      enabled: !!restaurantId, // Only fetch if restaurantId is available
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      retry: 3, // Retry up to 3 times on failure
      onError: (error: AxiosError) => {
        toast.error("Error fetching orders:");
      },
    }
  );
};

export const useUpdateOrderStatus = async({ orderId, status, queryClient }: { orderId: string; status: string, queryClient: QueryClient }) => {
  try {
    const response = await updateOrderStatus(orderId, status);
    toast.success("Order status updated successfully");
    queryClient.invalidateQueries([queryKeys.orders]);
    return;
  } catch (error) {
    toast.error("Error updating order status");
  }
};

// Fetching single order
const fetchSingleOrder = async (order_id: string) => {
  const orders = await billingAxiosInstanceGet(
    `${endpoints.FETCH_SINGLE_ORDER}${order_id}`
  );
  return orders;
}; 
export const useFetchSingleOrder = (order_id: string) => {
  return useQuery(
    [queryKeys.singleorder, order_id], // Query key
    () => fetchSingleOrder(order_id), // Query function
    {
      enabled: !!order_id, // Only fetch if restaurantId is available
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      retry: 3, // Retry up to 3 times on failure
      onError: (error: AxiosError) => {
        console.log("Error fetching orders:", error);
      },
    }
  );
};

// Fetching completed orders
const fetchCompletedSingleOrder = async (order_id: string) => {
  const orders = await billingAxiosInstanceGet(
    `${endpoints.FETCH_COMPLETED_SINGLE_ORDERS}${order_id}`
  );
  return orders;
};
export const useFetchCompletedSingleOrder = (order_id: string) => {
  return useQuery(
    [queryKeys.completedorders, order_id], // Query key
    () => fetchCompletedSingleOrder(order_id), // Query function
    {
      enabled: !!order_id, // Only fetch if restaurantId is available
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      retry: 3, // Retry up to 3 times on failure
      onError: (error: AxiosError) => {
        console.log("Error fetching orders:");
      },
    }
  );
};
