import { FoodItemType, ItemSize, MenuItem, ParentCategoryType, SpecialityType } from "@/app/Types/Type";

export const DEFAULT_MENU_ITEM: MenuItem = {
  food_item_category: '',
  food_item_description: '',
  restaurant_food_item_id: '',
  food_item_image_url: '',
  food_item_name: '',
  food_item_type: FoodItemType.Vegetarian, // Assuming FoodItemType is an enum/type with 'VEG' as a valid option
  restaurant_food_item_availability: true,
  food_item_parent_category: ParentCategoryType.FOOD,
  restaurant_food_item_speciality: SpecialityType.NONE,
  item_price: [{size: ItemSize.M, old_price: "", actual_price: ""}],
  isAddOns: false
};
