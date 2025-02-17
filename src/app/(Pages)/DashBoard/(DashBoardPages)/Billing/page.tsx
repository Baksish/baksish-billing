"use client";
import { order_status } from "@/app/Constants/constants";
import CurrentOrdersSection from "./Components/CurrentOrdersSection";
import IndividualOrderDetails from "./Components/IndividualOrderDetails";
import { useFetchAllOrders } from "@/app/services/orderService";
import { orderType } from "@/app/Types/Type";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import LoaderComponent from "@/app/Components/Loader/LoaderComponent";
import toast from "react-hot-toast";



const BillingPage = () => {
  const { data: initialOrders, isLoading, error } = useFetchAllOrders();
  const [orders, setOrders] = useState<{ orders: orderType[] } | null>(null);
  
  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  useEffect(() => {
    // Initialize socket connection with auth details
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      extraHeaders: {
        "Origin": `${process.env.NEXT_PUBLIC_APP_URL}` // Billing frontend port
      }
    });

    // Connection event handlers
    socket.on('connect', () => {});

    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
    });

    // Listen for new orders
    socket.on("newOrder", (newOrder: orderType) => {
      setTimeout(() => {
        setOrders(prevOrders => {
          if (!prevOrders) return { orders: [newOrder] };
          return {
            orders: [...prevOrders.orders, newOrder]
          };
        });
      }, 500); // 500ms delay
      toast.success("New order received");
    });

    // Listen for order updates
    socket.on("orderUpdated", (updatedOrder: orderType) => {
      setOrders(prevOrders => {
        if (!prevOrders) return null;
        return {
          orders: prevOrders.orders.map(order => 
            order.order_id === updatedOrder.order_id ? updatedOrder : order
          )
        };
      });
    });

    // Listen for order deletions
    socket.on("orderDeleted", (deletedOrderId: string) => {
      setOrders(prevOrders => {
        if (!prevOrders) return null;
        return {
          orders: prevOrders.orders.filter(order => order.order_id !== deletedOrderId)
        };
      });
    });

    // Clean up socket connection
    return () => {
      socket.disconnect();
    };
  }, []);

  const filterOrdersByStatus = (orders: orderType[], status: string) => {
    if (!orders || orders.length === 0) return [];
    return orders
      .filter((order: orderType) => order.order_status === status)
      .sort((a: orderType, b: orderType) => a.order_number - b.order_number);
  };

  const confirmedOrders = orders?.orders
    ? filterOrdersByStatus(orders.orders, order_status.CONFIRMED)
    : [];

  const placedOrders = orders?.orders
    ? filterOrdersByStatus(orders.orders, order_status.PLACED)
    : [];

  if (isLoading) return <div><LoaderComponent/></div>;
  if (error) return <p>Error loading orders: {error.message}</p>;

  if (!orders?.orders?.length) {
    return <div><LoaderComponent/></div>;
  }

  return (
    <div className="bg-[#F7FBFF] max-h-[100vh] overflow-y-auto ">
      <div className="flex justify-between items-center mt-4 ml-4 px-4 mb-6">
        <h1 className="text-3xl">Billing</h1>
      </div>

      <section className=" flex justify-between gap-2 mb-8">
        <div className="flex-[70]">
          <CurrentOrdersSection orders={confirmedOrders} />
        </div>
        <div className="flex-[30] max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <IndividualOrderDetails orders={placedOrders} />
        </div>
      </section>
    </div>
  );
};

export default BillingPage;