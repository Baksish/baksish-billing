"use client";
import React, { useState } from "react";
import OrderItem from "./OrderItem";
import { IndividualOrderType, ItemSize, orderItemType, orderType } from "@/app/Types/Type";
import { formatTimestamp } from "@/app/helpers/otherHelpers";
import { capitalize } from "@mui/material";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PrintIcon from '@mui/icons-material/Print';
import { useUpdateOrderStatus } from "@/app/services/orderService";
import { order_status } from "@/app/Constants/constants";
import { useQueryClient } from "react-query";
import generateBillMessage from "../helpers/generateBillMessage";
import { generatePrintContent } from "../helpers/generateKitchenBill";

const OrderCard = ({ order }: IndividualOrderType) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleCompleteOrder = async () => {
    await useUpdateOrderStatus({
      orderId: order.order_id,
      status: order_status.COMPLETED,
      queryClient
    });
    setModalOpen(false);
  };

  
  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=400,height=600');
    if (!printWindow) return;
    const printContent = generatePrintContent(order);
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleWhatsAppClick = async () => {
      // Fallback to text message if image generation fails
      const message =await generateBillMessage(order);
      const whatsappUrl = `https://wa.me/91${order.customer_phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Main Order Card */}
      <div
        onClick={toggleModal}
        className="bg-white border-[0.5px] border-gray-300 p-4 w-full rounded-3xl cursor-pointer"
      >
        <div className="flex justify-between relative items-start text-base space-x-4">
          {/* Left side content */}
          <div className="space-y-2">
            <p className="text-2xl">
              #<span>{order.order_number}</span>
            </p>
            <h3 className="font-semibold">Order Summary</h3>
            <ul className="space-y-[2px] mt-5 max-w-[250px]">
              {order.order_item.map((item: orderItemType) => (
                <li key={item._id || Math.random()}>
                  <OrderItem item={item} />
                </li>
              ))}
            </ul>
            <p className="text-sm">
              <span>{formatTimestamp(order.order_date)}</span>
            </p>
          </div>

          {/* Right side content */}
          <div className="flex flex-col justify-between items-end h-full w-full max-w-[150px]">
            {/* Top Right: Cash */}
            <p className="text-right">
              <span>{order.customer_name}</span>
            </p>

            {/* Bottom Right */}
            <div className="absolute bottom-0 space-y-2">
              <p>
                Total:{" "}
                <span className="text-xl font-semibold font-sans">
                  ₹ {order.round_off_amount}
                </span>
              </p>
              <button className="bg-black hover:bg-green-600 transition-colors duration-200 w-full text-white py-2 px-4 rounded-md">
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Order Summary &nbsp;&nbsp; <span className="text-xl">#{order.order_number}</span>
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✖
              </button>
            </div>
            <div className="space-y-1">
              <p className="text-lg">
                {order.customer_name}, +91 {order.customer_phone}
              </p>
              <p className="text-sm text-gray-600">
                {formatTimestamp(order.order_date)}
              </p>
            </div>
            <div className="mt-8">
              <ul className="list-disc list-inside px-6">
                {order.order_item.map((item: orderItemType) => (
                  <li key={item._id} className="flex justify-between items-center  space-x-4 space-y-2 text-lg">
                    <p>
                      {capitalize(item.menu_item.food_item_id.food_item_name)}&nbsp;<span className="text-base text-gray-600">({ItemSize[item.size as keyof typeof ItemSize]})</span>
                    </p>

                    <span className="mr-10 flex justify-between space-x-8">
                      <p>x {item.quantity}</p>
                      <p>{parseFloat(item.price || "0") * parseFloat(item.quantity || "0")}</p>
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="mt-3 mx-4" />
              <div className="flex justify-between text-lg space-x-4 px-6 mt-2">
                <p>Grand total</p>
                <p>{order.net_amount}</p>
              </div>
            </div>
            <div className="flex justify-between mt-8">
                <div className="">
                  <p>Amount payable</p>
                  <p className="font-semibold text-3xl">₹ {order.round_off_amount}</p>
                </div>
                <div className="flex justify-center space-x-4 mt-2">

                  <div 
                    className="bg-black text-white h-fit py-2 px-4 rounded-lg cursor-pointer"
                    onClick={handleWhatsAppClick}
                  >
                    <WhatsAppIcon/>
                  </div>
                  <div 
            className="bg-black text-white h-fit py-2 px-4 rounded-lg cursor-pointer"
            onClick={handlePrint}
          >
            <PrintIcon/>
          </div>
                  <button
                    className="bg-black text-white h-fit py-2 px-6 rounded-lg"
                    onClick={handleCompleteOrder}
                  >
                    Complete
                  </button>
                </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default OrderCard;
