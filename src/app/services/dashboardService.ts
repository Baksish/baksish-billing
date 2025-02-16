"use client";
import { useQuery } from "react-query";
import { billingAxiosInstanceGet } from "@/app/helpers/axiosHelpers"
import endpoints from "@/app/helpers/endpoints"
import { AxiosError } from "axios";
import { queryKeys } from "@/app/helpers/queryKeys";
import toast from "react-hot-toast";

// Base fetch functions
const fetchTotalMenus = async (restaurantId: string) => {
    const response = await billingAxiosInstanceGet(
        `${endpoints.DASHBOARD_STATUS_MENU_COUNT}${restaurantId}`
    );
    return response;
}

const fetchTotalOrders = async (restaurantId: string, date: string) => {
    const response = await billingAxiosInstanceGet(
        `${endpoints.DASHBOARD_STATUS_ORDER_COUNT}${restaurantId}/${date}`
    );
    return response;
}

const fetchTotalCustomers = async (restaurantId: string, date: string) => {
    const response = await billingAxiosInstanceGet(
        `${endpoints.DASHBOARD_STATUS_CUSTOMER_COUNT}${restaurantId}/${date}`
    );
    return response;
}

const fetchTotalRevenue = async (restaurantId: string, date: string) => {
    const response = await billingAxiosInstanceGet(
        `${endpoints.DASHBOARD_STATUS_REVENUE}${restaurantId}/${date}`
    );
    return response;
}

const fetchCompletedOrders = async (restaurantId: string, date: string) => {
    const response = await billingAxiosInstanceGet(
        `${endpoints.FETCH_COMPLETED_ORDERS}${restaurantId}/${date}`
    );
    return response;
}

// Hook exports
export const useFetchTotalMenus = (restaurantId: string) => {
    return useQuery(
        [queryKeys.dashboardMenus, restaurantId],
        () => fetchTotalMenus(restaurantId),
        {
            enabled: !!restaurantId,
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 3,
            onError: (error: AxiosError) => {
                toast.error("Error fetching menu:");
            },
        }
    );
}

export const useFetchTotalOrders = (restaurantId: string, date: string) => {
    return useQuery(
        [queryKeys.dashboardOrders, restaurantId, date],
        () => fetchTotalOrders(restaurantId, date),
        {
            enabled: !!restaurantId && !!date,
            staleTime: 1000 * 60 * 5,
            retry: 3,
            onError: (error: AxiosError) => {
                toast.error("Error fetching orders:");
            },
        }
    );
}

export const useFetchTotalCustomers = (restaurantId: string, date: string) => {
    return useQuery(
        [queryKeys.dashboardCustomers, restaurantId, date],
        () => fetchTotalCustomers(restaurantId, date),
        {
            enabled: !!restaurantId && !!date,
            staleTime: 1000 * 60 * 5,
            retry: 3,
            onError: (error: AxiosError) => {
                toast.error("Error fetching customers:");
            },
        }
    );
}

export const useFetchTotalRevenue = (restaurantId: string, date: string) => {
    return useQuery(
        [queryKeys.dashboardRevenue, restaurantId, date],
        () => fetchTotalRevenue(restaurantId, date),
        {
            enabled: !!restaurantId && !!date,
            staleTime: 1000 * 60 * 5,
            retry: 3,
            onError: (error: AxiosError) => {
                toast.error("Error fetching revenue:");
            },
        }
    );
}

export const useFetchCompletedOrders = (restaurantId: string, date: string) => {
    return useQuery(
        [queryKeys.dashboardCompletedOrders, restaurantId, date],
        () => fetchCompletedOrders(restaurantId, date),
        {
            enabled: !!restaurantId && !!date,
            staleTime: 1000 * 60 * 5,
            retry: 3,
            onError: (error: AxiosError) => {
                toast.error("Error fetching completed orders:");
            },
        }
    );
}