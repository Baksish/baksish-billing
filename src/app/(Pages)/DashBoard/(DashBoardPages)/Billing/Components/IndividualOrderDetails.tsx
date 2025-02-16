import React from "react";
import CashOrderCard from "./CashOrderCard";
import { ordersMappedType } from "@/app/Types/Type";


const IndividualOrderDetails = ({orders}:ordersMappedType) => {
  return (
    <aside className="w-[100%] px-8">
      <h2 className="text-2xl font-semibold  mb-4">Cash Order</h2>
      {orders?.map((order: any) => (
        <div className="" key={order._id}>
          <CashOrderCard order={order} />
        </div>
      ))}
    </aside>
  );
};

export default IndividualOrderDetails;
