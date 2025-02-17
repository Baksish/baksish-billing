"use client";
import {
  Availability,
  FoodItemType,
  ItemSize,
  MenuItem,
  SpecialityType,
} from "@/app/Types/Type";
import { useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteMenu, useUpdateMenu } from "@/app/services/menuService";
import { useState } from "react";
import DeleteItemConfirmModal from "./DeleteItemConfirmModal";
import toast from "react-hot-toast";

type MenuItemModalProps = {
  isOpenEdit: boolean;
  setIsOpenEdit: (isOpenEdit: boolean) => void;
  item: MenuItem;
};

const MenuItemModal = ({
  isOpenEdit,
  setIsOpenEdit,
  item,
}: MenuItemModalProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { watch, register, setValue } = useForm<MenuItem>({
    defaultValues: item,
  });
  const item_prices = watch("item_price");
  const { mutateAsync: updateMenu, isLoading: isUpdating } = useUpdateMenu();
  const { mutateAsync: deleteMenu, isLoading: isDeleting } = useDeleteMenu();

  const handleDeleteSize = (index: number) => {
    const currentPrices = watch("item_price");
    const updatedPrices = currentPrices?.filter((_, i) => i !== index);
    setValue("item_price", updatedPrices);
  };

  const handleAddSize = () => {
    const currentPrices = watch("item_price") || [];
    const updatedPrices = [
      ...currentPrices,
      { size: "", old_price: "", actual_price: "" },
    ];
    setValue("item_price", updatedPrices);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentPrices = watch("item_price") || [];

    // Check if all fields in item_price array have values
    const hasEmptyFields = currentPrices.some(
      (price) => !price.size || !price.old_price || !price.actual_price
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all price fields for each size");
      return;
    }

    // Check for duplicate sizes
    const sizes = currentPrices.map((price) => price.size);
    const hasDuplicateSizes = sizes.length !== new Set(sizes).size;

    if (hasDuplicateSizes) {
      toast.error("Each size must be unique");
      return;
    }
    const payload = {
      restaurant_food_item_availability: watch(
        "restaurant_food_item_availability"
      ),
      restaurant_food_item_description: watch("food_item_description"),
      item_price: currentPrices,
      restaurant_food_item_speciality: watch("restaurant_food_item_speciality"),
      isAddOns: watch("isAddOns"),
    };
    await updateMenu({
      menuId: item.restaurant_food_item_id || "",
      payload: payload,
    });
    e.stopPropagation();
    setIsOpenEdit(false);
  };

  const handleDeleteItem = async () => {
    await deleteMenu(item.restaurant_food_item_id || "");
    setIsDeleteModalOpen(false);
    setIsOpenEdit(false);
  };

  return (
    <>
      {isOpenEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 hover:cursor-default">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-2">Menu Item Details</h2>
              <div
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenEdit(false);
                }}
              >
                X
              </div>
            </div>
            <div className="border border-gray-300 my-1 flex items-center justify-between px-2 py-1 space-x-10 rounded-md text-sm">
              <p className="text-sm text-gray-600">
                In case you want to change non-editable fields, please delete
                this item and add a new one.
              </p>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-1 bg-red-100 border-red-400 border text-black rounded-md hover:bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                {isUpdating ? "Deleting..." : "Delete"}
              </button>
            </div>
            <div className="">
              <div className="w-full my-4">
                <label className="block text-sm font-medium text-gray-600">
                  Name:
                </label>
                <div className="">{watch("food_item_name")}</div>
              </div>

              <div className="w-full my-4 mb-6">
                <label className="block text-sm font-medium text-gray-600">
                  Description:
                </label>
                <textarea
              className="mt-1 block w-full rounded-md border px-4 py-2 border-gray-300"
              {...register("food_item_description")}
              required
            />
              </div>

              <div className="flex justify-between mb-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600">
                    Parent Category:
                  </label>
                  <div className="mt-1">
                    {watch("food_item_parent_category")}
                  </div>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600">
                    Category:
                  </label>
                  <div className="mt-1">{watch("food_item_category")}</div>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600">
                    Type:
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        watch("food_item_type") === FoodItemType.Vegetarian
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {watch("food_item_type") === FoodItemType.Vegetarian
                        ? "Veg"
                        : "Non-Veg"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between space-x-4 mb-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600">
                    Availability:
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border px-1 py-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    {...register("restaurant_food_item_availability")}
                  >
                    <option value="true">{Availability.Available}</option>
                    <option value="false">{Availability.NotAvailable}</option>
                  </select>
                </div>
                <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Speciality:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-1 border-gray-300"
                {...register("restaurant_food_item_speciality")}
                required
              >
                <option value={SpecialityType.BEST_SELLER}>
                  {SpecialityType.BEST_SELLER}
                </option>
                <option value={SpecialityType.CHEF_SPECIAL}>
                  {SpecialityType.CHEF_SPECIAL}
                </option>
                <option value={SpecialityType.NONE}>
                  {SpecialityType.NONE}
                </option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Add-ons applicable:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-1 border-gray-300"
                {...register("isAddOns")}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
              </div>
              {item_prices?.map((priceItem, index) => (
                <div
                  className="flex justify-between space-x-10 mb-6 items-end"
                  key={index}
                >
                  <div className="w-full" key={index}>
                    <label className="block text-sm font-medium text-gray-600">
                      Size:
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border px-2 py-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register(`item_price.${index}.size`)}
                    >
                      {Object.entries(ItemSize).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    {/* <div>{ItemSize[priceItem?.size as keyof typeof ItemSize]}</div> */}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600">
                      Old Price:
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full mr-4 rounded-md border px-4 py-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register(`item_price.${index}.old_price`)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-600">
                      Actual Price:
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full mr-4 rounded-md border px-4 py-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register(`item_price.${index}.actual_price`)}
                    />
                  </div>
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
                      handleDeleteSize(index);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </div>
              ))}
              <div
                className="border border-gray-300 rounded-md px-4 w-fit h-fit my-4 bg-slate-100 text-black hover:cursor-pointer"
                onClick={handleAddSize}
              >
                + Add new size
              </div>
              <div className="flex space-x-8 justify-between">
                <p className="text-sm text-gray-600">
                  In case you want to change the image or name, delete this item
                  and add a new one.{" "}
                </p>
                <button
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleSave(e)
                  }
                  className="px-8 py-2 bg-slate-800 text-white rounded-md hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteItemConfirmModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDeleteConfirm={handleDeleteItem}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default MenuItemModal;
