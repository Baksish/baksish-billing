"use client"
import React from "react";
import OrderCard from "./OrderCard";
import { orderItemType, ordersMappedType, orderType } from "@/app/Types/Type";

const CurrentOrdersSection = ({orders}:ordersMappedType) => {
  const directToCustomerPage=()=>{
    if(window.localStorage!=undefined){
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if(user?.restaurant_details){
        window.open(`${process.env.NEXT_PUBLIC_CUSTOMER_PAGE_URL}?id=${user.restaurant_details._id}`, '_blank');
      }
    }
  }
  return (
    <>
      <div className="flex justify-between items-center  px-8 pb-4">
        <h2 className="text-2xl font-semibold ">Current Orders</h2>
        <button className="bg-black hover:bg-green-600 transition-colors duration-200 text-white py-2 px-4 rounded-md" onClick={directToCustomerPage}>
          Create a new order
        </button>
      </div>
      <aside className="w-[100%] max-h-[80vh] overflow-y-auto px-8 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <div className="grid grid-cols-2 gap-5">
        {orders?.map((order: orderType) => (
        <div key={order._id}>
          <OrderCard order={order} />
          
        </div>
      ))}
          
        </div>
      </aside>
    </>
  );
};

export default CurrentOrdersSection;
