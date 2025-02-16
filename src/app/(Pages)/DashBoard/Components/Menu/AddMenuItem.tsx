"use client";

import { useAddMenu } from "@/app/services/menuService";
import {
  Availability,
  FoodItemType,
  ItemSize,
  MenuItem,
  ParentCategoryType,
  SpecialityType,
} from "@/app/Types/Type";
import { useForm } from "react-hook-form";
import { DEFAULT_MENU_ITEM } from "./constants";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AddMenuItemProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AddMenuItem = ({ isOpen, setIsOpen }: AddMenuItemProps) => {
  const { watch, register, setValue } = useForm<MenuItem>({
    defaultValues: DEFAULT_MENU_ITEM,
  });
  const { mutateAsync: addMenu, isLoading } = useAddMenu();
  const item_prices = watch("item_price");
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const restaurantDetails = storedUser ? JSON.parse(storedUser) : null;
      setCategories(
        restaurantDetails?.restaurant_details?.food_categories || []
      );
    }
  }, []);

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

  const validateMenuItemForm = (formData: MenuItem): string[] => {
    const validationErrors: string[] = [];
    const currentPrices = formData.item_price || [];

    // Required text field validations
    const requiredFields = {
      food_item_name: "Name",
      food_item_description: "Description",
      food_item_image_url: "Image URL",
      food_item_parent_category: "Parent category",
      food_item_category: "Category",
      food_item_type: "Type",
      restaurant_food_item_speciality: "Speciality",
    } as const;

    // Check all required text fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field as keyof typeof requiredFields]?.trim()) {
        validationErrors.push(`${label} is required`);
      }
    });

    // Boolean field validations
    if (
      formData.restaurant_food_item_availability === undefined ||
      formData.restaurant_food_item_availability === null
    ) {
      validationErrors.push("Availability is required");
    }

    if (formData.isAddOns === undefined || formData.isAddOns === null) {
      validationErrors.push("Add-ons applicable is required");
    }

    // Price validations
    if (currentPrices.length === 0) {
      validationErrors.push("At least one size and price is required");
      return validationErrors; // Early return if no prices
    }

    // Check for empty price fields
    if (
      currentPrices.some(
        (price) => !price.size || !price.old_price || !price.actual_price
      )
    ) {
      validationErrors.push("Please fill in all price fields for each size");
    }

    // Check for duplicate sizes
    const sizes = currentPrices.map((price) => price.size);
    if (sizes.length !== new Set(sizes).size) {
      validationErrors.push("Each size must be unique");
    }

    // Validate price values
    if (
      currentPrices.some(
        (price) =>
          parseFloat(price.old_price) <= 0 ||
          parseFloat(price.actual_price) <= 0
      )
    ) {
      validationErrors.push("Price should be greater than 0");
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = watch();

    const validationErrors = validateMenuItemForm(formData);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    const menuItem = {
      ...formData,
      item_price: formData.item_price || [],
      restaurant_food_item_description: watch("food_item_description"),
    };

    // Remove speciality if it's "None"
    if (menuItem.restaurant_food_item_speciality === SpecialityType.NONE) {
      delete menuItem.restaurant_food_item_speciality;
    }
    //remove restaurant_food_item_id from payload
    delete menuItem.restaurant_food_item_id;
    delete menuItem.food_item_description;
    // Generate UUID: first 2 letters + last letter of name + 3 numbers from current time
    const itemName = menuItem?.food_item_name?.trim();
    const timestamp = new Date().getTime().toString().slice(-3);
    const uuid = `${itemName?.slice(0, 2)}${itemName?.slice(
      -1
    )}${timestamp}`.toUpperCase();
    menuItem.food_item_uid = uuid;

    try {
      await addMenu({ payload: menuItem });
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to add menu item");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
          <div
            className="hover:cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            X
          </div>
        </div>

        <div className="">
          <div className="w-full my-4">
            <label className="block text-sm font-medium text-gray-600">
              Name:
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border px-4 py-2 border-gray-300"
              {...register("food_item_name")}
              required
            />
          </div>

          <div className="w-full my-4">
            <label className="block text-sm font-medium text-gray-600">
              Description:
            </label>
            <textarea
              className="mt-1 block w-full rounded-md border px-4 py-2 border-gray-300"
              {...register("food_item_description")}
              required
            />
          </div>

          <div className="w-full my-4">
            <label className="block text-sm font-medium text-gray-600">
              Image URL:
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border px-4 py-2 border-gray-300"
              {...register("food_item_image_url")}
              required
            />
          </div>

          <div className="flex justify-between space-x-4 my-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Parent Category:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
                {...register("food_item_parent_category")}
                required
              >
                <option value={ParentCategoryType.FOOD}>Food</option>
                <option value={ParentCategoryType.DRINKS}>Drinks</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Category:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
                {...register("food_item_category")}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between space-x-4 my-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Type:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
                {...register("food_item_type")}
              >
                <option value={FoodItemType.Vegetarian}>Veg</option>
                <option value={FoodItemType.NonVegetarian}>Non-Veg</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Availability:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
                {...register("restaurant_food_item_availability")}
              >
                <option value="true">{Availability.Available}</option>
                <option value="false">{Availability.NotAvailable}</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between space-x-4 my-4 mb-6">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600">
                Speciality:
              </label>
              <select
                className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
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
                className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
                {...register("isAddOns")}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          {/* Price Sections */}
          {item_prices?.map((_, index) => (
            <div
              key={index}
              className="flex justify-between space-x-4 items-end my-4"
            >
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600">
                  Size:
                </label>
                <select
                  className="mt-1 block w-full rounded-md border px-1 py-2 border-gray-300"
                  {...register(`item_price.${index}.size`)}
                >
                  {Object.entries(ItemSize).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600">
                  Old Price:
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border px-4 py-2 border-gray-300"
                  {...register(`item_price.${index}.old_price`)}
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-600">
                  Actual Price:
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border px-4 py-2 border-gray-300"
                  {...register(`item_price.${index}.actual_price`)}
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSize(index)}
                className="hover:cursor-pointer hover:text-slate-600"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="border text-sm border-gray-300 rounded-md mt-2 px-4 py-1 bg-slate-100 text-black hover:bg-slate-200"
            onClick={handleAddSize}
          >
            + Add new size
          </button>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 disabled:opacity-50"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItem;
