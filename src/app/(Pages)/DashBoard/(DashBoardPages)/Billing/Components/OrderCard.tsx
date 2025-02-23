"use client";
import React, { useState } from "react";
import {
  IndividualOrderType,
  ItemSize,
  orderItemType,
  orderType,
} from "@/app/Types/Type";
import { formatTimestamp } from "@/app/helpers/otherHelpers";
import { capitalize } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";
import { useUpdateOrderStatus } from "@/app/services/orderService";
import { order_status } from "@/app/Constants/constants";
import { useQueryClient } from "react-query";
import generateBillMessage from "../helpers/generateBillMessage";
import { generatePrintContent } from "../helpers/generateKitchenBill";
import { generatePrintContent_TeXt } from "../helpers/generateKitchenBill";

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
      queryClient,
    });
    setModalOpen(false);
  };



  let printerDevice: any = null;
  let printerServer: any = null;
  

/**
 * Connects to the MPT-II Bluetooth printer using Chrome's Web Bluetooth API.
 */
const connectPrinter = async (): Promise<void> => {
    try {
        printerDevice = await (navigator as any)?.bluetooth?.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'] // Standard SPP UUID for serial printers
        });

        if (!printerDevice.gatt) {
            throw new Error("GATT server not found on the device");
        }

        printerServer = await printerDevice.gatt.connect();
        console.log('✅ Connected to printer:', printerDevice.name);
    } catch (error) {
        console.log('❌ Bluetooth Connection Failed:', error);
    }
};

/**
 * Sends KOT bill data to the printer over Bluetooth.
 */
const handlePrint_new = async () => {

  connectPrinter();
    if (!printerDevice || !printerServer) {
        console.log("❌ Prz`inter not connected! Call connectPrinter() first.");
        return;
    }

    try {
        const service = await printerServer.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('00002a56-0000-1000-8000-00805f9b34fb'); // Adjust based on printer's documentation

        const printData = generatePrintContent(order);
        const encoder = new TextEncoder();
        const dataArray = encoder.encode(printData);

        await characteristic.writeValue(dataArray);
        console.log("✅ Print request sent successfully!");
    } catch (error) {
        console.log("❌ Printing failed:", error);
    }
};

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=400,height=600");
    if (!printWindow) return;
    const printContent = generatePrintContent(order);
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleWhatsAppClick = async () => {
    // Fallback to text message if image generation fails
    const message = await generateBillMessage(order);
    const whatsappUrl = `https://wa.me/91${
      order.customer_phone
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <>
      {/* Main Order Card */}
      <div
        onClick={toggleModal}
        className="relative bg-white border-[0.5px] border-gray-300 p-4 w-full rounded-3xl h-56 cursor-pointer"
      >
        <div className="flex justify-between">
          <p className="text-2xl">
            #<span>{order.order_number}</span>
          </p>
          <p className="text-right">
            <span>{order.customer_name}</span>
          </p>
        </div>
        <h3 className="font-semibold">Order Summary</h3>
        <div className="text-base mt-2 h-20 hide_scrollbar overflow-y-auto w-full">
          {order.order_item.map((item: orderItemType) => (
            <div
              key={item._id || Math.random()}
              className="flex grid grid-cols-12 w-full"
            >
              <p className="text-sm col-span-10">
                {capitalize(item?.name || "")}
              </p>
              <p className="col-span-2 text-right">x {item?.quantity}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full px-2 absolute items-center bottom-2">
          <div className="text-sm">
            <span className="italic">{formatTimestamp(order.order_date)}</span>
          </div>
          <div className="bg-zinc-500 text-white px-2 py-1 rounded-md text-xl font-semibold font-sans mx-6">
            ₹ {order.round_off_amount}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[500px] p-6 px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Order Summary &nbsp;&nbsp;{" "}
                <span className="text-xl">#{order.order_number}</span>
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
              <ul className=" gap-4 px-6">
                {order.order_item.map((item: orderItemType) => (
                  <li
                    key={item._id}
                    className="flex items-center space-y-2 text-sm grid grid-cols-10 my-2"
                  >
                    <p className="col-span-8">
                      {capitalize(item.name || "")}&nbsp;
                      <span className="text-gray-600">
                        ({ItemSize[item.size as keyof typeof ItemSize]})
                      </span>
                    </p>

                    <p className="col-span-1 text-right">x {item.quantity}</p>
                    <p className="col-span-1 text-right">
                      {parseFloat(item.price || "0") *
                        parseFloat(item.quantity || "0")}
                    </p>
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
                <p className="font-semibold text-3xl">
                  ₹ {order.round_off_amount}
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-2">
                <div
                  className="bg-black text-white h-fit py-2 px-4 rounded-lg cursor-pointer"
                  onClick={handleWhatsAppClick}
                >
                  <WhatsAppIcon />
                </div>
                <div
                  className="bg-black text-white h-fit py-2 px-4 rounded-lg cursor-pointer"
                  onClick={handlePrint_new}
                >
                  <PrintIcon />
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
