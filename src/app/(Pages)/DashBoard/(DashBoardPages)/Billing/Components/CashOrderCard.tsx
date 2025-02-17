import { order_status } from "@/app/Constants/constants";
import { useUpdateOrderStatus } from "@/app/services/orderService";
import { IndividualOrderType } from "@/app/Types/Type";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  withCredentials: true,
  extraHeaders: {
    "Origin": `${process.env.NEXT_PUBLIC_APP_URL}` // Billing frontend port
  }
});

const CashOrderCard = ({ order }: IndividualOrderType) => {
  const queryClient = useQueryClient();
  // Initialize socket connection with auth details
  useEffect(()=>{
    // Connection event handlers
    socket.on('connect', () => {});

    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
    });
  },[])

  const handleConfirmOrder = async () => {
    await useUpdateOrderStatus({ orderId: order.order_id, status: order_status.CONFIRMED ,queryClient});
    socket.emit("clientOrderStatusUpdatedToConfirm",order);
  };

  const handleCancelOrder = async () => {
    await useUpdateOrderStatus({ orderId: order.order_id, status: order_status.CANCELLED ,queryClient});
    socket.emit("clientOrderStatusUpdatedToCancel",order);
  };
  return (
    <div className="bg-zinc-100 drop-shadow-md  min-h-10 p-2 px-2 pr-2 w-full rounded-md my-4">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <p className="text-2xl">#{order.order_number}</p>
      </div>
      <p className="">
        <span>{order.customer_name}</span>
      </p>
      <div className="flex justify-between items-center mt-6">
        <div className="">
          <p className="text-gray-700 font-semibold text-base">Order Amount</p>
          <p className="text-base flex justify-start items-center font-bold text-gray-900">
            <svg
              fill="#000000"
              className="mr-1"
              width="14px"
              height="14px"
              viewBox="-96 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z" />
            </svg>{" "}
            <span> {order.round_off_amount}</span>
          </p>
        </div>
        <div className="flex justify-end space-x-1 mt-2 ">
          <button
            className="bg-green-600 text-white text-sm  p-[4px]  rounded-md"
            onClick={handleConfirmOrder}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 text-white text-sm p-[2.5px] px-1 rounded-md"
            onClick={handleCancelOrder}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashOrderCard;
