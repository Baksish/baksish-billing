"use client";
import { useEffect, useState } from "react";
import AddMenuItem from "../../Components/Menu/AddMenuItem";
import { useFetchRestaurantMenu } from "@/app/services/restaurantService";
import { useQueryClient } from "react-query";
import { queryKeys } from "@/app/helpers/queryKeys";
import LoaderComponent from "@/app/Components/Loader/LoaderComponent";
import MenuItemCard from "./MenuItemCard";
import { MenuItem } from "@/app/Types/Type";

const MenuPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [groupedMenuItems, setGroupedMenuItems] = useState<
    Record<string, MenuItem[]>
  >({});
  const queryClient = useQueryClient(); // State to control modal
  queryClient.invalidateQueries([queryKeys.orders]);
  const { data: menu, isLoading, error } = useFetchRestaurantMenu();

  useEffect(() => {
    if (menu) {
      const groupedItems = menu.reduce(
        (acc: Record<string, MenuItem[]>, item: MenuItem) => {
          const category = item.food_item_category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        },
        {}
      );
      setGroupedMenuItems(groupedItems);
      setMenuItems(menu);
    }
  }, [menu]);

  return (
    <>
      <div className="bg-[#F7FBFF] max-h-[100vh] overflow-y-auto ">
        <div className="flex justify-between items-center mt-4 ml-4 px-4 mb-6">
          <h1 className="text-3xl">Menu</h1>
        </div>
        {isLoading && <LoaderComponent />}
        {!isLoading && (
          <div className="mt-10 mx-10">
            <div className="flex justify-center align-center">
              <div className="px-16 pt-4 pb-2 w-fit shadow-xl bg-slate-800 p-4 text-white rounded-md ">
                <div className="flex justify-center items-center space-x-4">
                  <p className="text-lg">
                    Want to add a new item to your menu to start selling?
                  </p>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white text-slate-800 h-fit px-4 py-2 rounded-md hover:bg-slate-200"
                  >
                    + Menu Item
                  </button>
                </div>
                <div className="text-center text-slate-400">
                  <p>To edit, tap on the menu item.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {Object.entries(groupedMenuItems).map(([category, items]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 gap-y-8">
                    {items.map((item) => (
                      <MenuItemCard
                        key={item.restaurant_food_item_id}
                        name={item.food_item_name}
                        imageUrl={item.food_item_image_url}
                        food_item_type={item.food_item_type}
                        item={item}
                      />
                    ))}
                  </div>
                  <hr className="mt-8" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddMenuItem isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default MenuPage;
