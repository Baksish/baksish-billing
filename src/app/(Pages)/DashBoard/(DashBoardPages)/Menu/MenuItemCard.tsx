import React, { useState } from "react";
import Image from "next/image";
import { FoodItemType, MenuItemCardProps } from "@/app/Types/Type";
import veg from "../../../../../assets/icons/vegicon.png"
import nonveg from "../../../../../assets/icons/nonveg.png";
import MenuItemModal from "./MenuItemModal";

const MenuItemCard = ({
  name = "",
  imageUrl = "https://example.com/image.jpg",
  food_item_type,
  item,
}: MenuItemCardProps) => {
    const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  return (
    <div className="w-56 border-2 border-gray-300 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:bg-slate-200 hover:cursor-pointer transition-shadow duration-300" onClick={() => setIsOpenEdit(true)}>
      <div className="relative">
        <Image
          src={imageUrl}
          alt={name}
          width={100}
          height={100}
          className="w-full h-32 object-cover "
        />
      </div>

      <div className="my-2 mx-2 flex justify-between">
        <h3 className="font-medium text-base text-gray-800 truncate">{name}</h3>
        <Image src={food_item_type === FoodItemType.Vegetarian ? veg : nonveg} alt="veg" width={24} height={20} />
      </div>
      {item && <MenuItemModal isOpenEdit={isOpenEdit} setIsOpenEdit={setIsOpenEdit} item={item}/>}
    </div>



  );
};

export default MenuItemCard;
