export type User = {
    id: string,
    name: string;
    email: string;
    token: string;
    restaurant_details: Object;
  };


export type foodItemDescription={
  _id: string,
  food_item_description:string,
  food_item_category:string,
  food_item_image_url:string,
  food_item_name:string,
  food_item_type:string,
  food_item_uid:string,
  _v:Number,
  restaurant_id: string[],
}

export type menuItemType={
  food_item_id:foodItemDescription,
  restaurant_food_item_availability:boolean,
  restaurant_id:string,
  _id:string,
  _v:Number,
  restaurant_food_item_inventory:[],
  restaurant_food_item_description?:string,
  isAddOns?:boolean,
}

export type orderItemType={
  menu_item:menuItemType,
  quantity:string,
  price?:string,
  size?:string,
  name?:string,
  _id:string,
  _v:Number,
}


export type orderType={
  cgst_amount: string;
  cgst_percent: string;
  customer_address: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  discount_amount: string;
  discount_percent: string;
  net_amount: string;
  order_date: string;
  order_id: string;
  order_item: orderItemType[];
  order_notes: string;
  order_number: number;
  order_placed_at: string;
  order_status: "PLACED"| "INITIATED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  order_type: "QSR" | "DINE IN" | "DELIVERY";
  payment_method: "CASH" | "CARD" | "ONLINE";
  restaurant_address: string;
  restaurant_id: string;
  restaurant_name: string;
  round_off_amount: string;
  sgst_amount: string;
  sgst_percent: string;
  subtotal: string;
  _id: string;
  _v: Number;
}
export type ordersMappedType ={
  orders:orderType[];
}
export type IndividualOrderType ={
  order: orderType;
}
export type IndividualMenuItemType={
  item:orderItemType;
}

export type RestaurantDetails = {
  _id?: string;
  restaurant_id?: string;
  restaurant_uuid?: string;
  restaurant_name?: string;
  restaurant_address?: string;
  restaurant_phone_number?: string;
  restaurant_email?: string;
  restaurant_description?: string;
  restaurant_type?: string;
  restaurant_opening_time?: string;
  restaurant_closing_time?: string;
  restaurant_image?: string;
  restaurant_cgst?: string;
  restaurant_sgst?: string;
  restaurant_discount?: string;
  restaurant_password?: string;
  restaurant_confirmPassword?: string;
  food_categories?:string[];
  isVegOnly?:boolean;
  isCashOnly?:boolean;
}

export type MenuItemCardProps={
  name?:string,
  imageUrl?:string,
  food_item_type?:FoodItemType,
  item?:MenuItem,
}


export enum FoodItemType {
  Vegetarian = "Vegetarian",
  NonVegetarian = "Non-Vegetarian"
}

export enum Availability {
  Available = "Available",
  NotAvailable = "Not Available"
}

export enum ParentCategoryType{
  DRINKS= "Drinks",
  FOOD="Food",
}

export enum SpecialityType{
  CHEF_SPECIAL= "Chef Special",
  BEST_SELLER= "Best Seller",
  NONE= "None",
}

export type MenuItem = {
  food_item_category?: string;
  food_item_description?: string;
  restaurant_food_item_id?: string;
  food_item_image_url?: string;
  food_item_name?: string;
  food_item_parent_category?: ParentCategoryType;
  food_item_type?: FoodItemType;
  restaurant_food_item_availability?: boolean;
  restaurant_food_item_speciality?:SpecialityType;
  item_price?:FoodItemPrice[];
  isAddOns?:boolean;
  restaurant_id?:string;
  food_item_uid?:string;
}

export type FoodItemPrice={
  size:string,
  old_price:string,
  actual_price:string,
}


export enum ItemSize{
  S="Small",
  M="Medium",
  L="Large",
  XL="Extra large",
  XXL="Extra extra large",
}
// ... existing code ...