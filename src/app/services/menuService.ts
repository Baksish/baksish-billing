import { AxiosError } from "axios";
import { billingAxiosInstanceDelete, billingAxiosInstancePost, billingAxiosInstancePut } from "../helpers/axiosHelpers";
import endpoints from "../helpers/endpoints";
import { useMutation, useQueryClient } from "react-query";
import { queryKeys } from "../helpers/queryKeys";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

//update menu item
const updateMenu = async (menuId: string, payload: Object) => {
  const menu = await billingAxiosInstancePut(
    `${endpoints.MENU_ITEM}${menuId}`,
    payload
  );
  return menu;
};

export const useUpdateMenu = () => {
    const queryClient = useQueryClient();
  
    return useMutation(
      (data: { menuId: string; payload: Object }) =>
        updateMenu(data.menuId, data.payload),
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


//delete menu item
const deleteMenu = async (menuId: string) => {
  const menu = await billingAxiosInstanceDelete(
    `${endpoints.MENU_ITEM}${menuId}`
  );
  return menu;
};

export const useDeleteMenu = () => {
    const queryClient = useQueryClient();
  return useMutation((menuId: string) => deleteMenu(menuId), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.menu]);
      toast.success("Menu item deleted successfully");
    },
    onError: (error: AxiosError) => {
      toast.error("Error deleting menu item");
    },
  });
};


//add menu item
const addMenu = async (resId: string, payload: Object) => {
  const menu = await billingAxiosInstancePost(
    `${endpoints.MENU_ITEM}${resId}`,
    payload
  );
  return menu;
};

export const useAddMenu = () => {
  const queryClient = useQueryClient();
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
  return useMutation((data: {payload: Object }) => addMenu(restaurantId!, data.payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.menu]);
      toast.success("Menu item added successfully");
    },
    onError: (error: AxiosError) => {
      toast.error("Error adding menu item");
    },
  });
};
