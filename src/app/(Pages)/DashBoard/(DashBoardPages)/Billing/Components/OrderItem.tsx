"use client";
import React from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { IndividualMenuItemType } from "@/app/Types/Type";
import { capitalize } from "@mui/material";

function OrderItem({item}:IndividualMenuItemType) {
  return (
    <div className="flex text-md justify-between items-center ">
      <div>
        <span className="text-sm">{capitalize(item?.name||"")}</span>
        <span>&nbsp;&nbsp;&nbsp;x {item?.quantity}</span>
      </div>
    </div>
  );
}

export default OrderItem;
