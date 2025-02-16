"use client";
import {
  AutoGraph,
  CottageOutlined,
  Inventory2Outlined,
  ReceiptLong,
  SettingsSuggest,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname(); // Get the current route to apply active styles

  const menuItems = [
    { title: "Home", path: "/DashBoard", icon: <CottageOutlined /> },
    { title: "Billing", path: "/DashBoard/Billing", icon: <ReceiptLong /> },
    { title: "Menu", path: "/DashBoard/Menu", icon: <Inventory2Outlined /> },
    { title: "Analytics", path: "/DashBoard/Analytics", icon: <AutoGraph /> },
    { title: "Settings", path: "/DashBoard/Settings", icon: <SettingsSuggest /> },
  ];

  return (
    <div className="w-[4.5rem] relative h-screen  drop-shadow-lg bg-slate-100 flex flex-col pt-20 items-center space-y-10 p-4">
      {menuItems.map((item) => (
        <Tooltip key={item.title} arrow placement="right" title={item.title}>
          <Link href={item.path}>
            <div
              className={`p-2 rounded-lg cursor-pointer ${
                pathname === item.path ? "bg-slate-300" : "bg-slate-500/10"
              } hover:bg-slate-200`}
            >
              {item.icon}
            </div>
          </Link>
        </Tooltip>
      ))}

      <div className="-rotate-90 text-xl w-fit text-white bg-orange-500 px-4 py-1 rounded-br-xl absolute bottom-[29px]  -left-[33px] ">
        Baksish
      </div>
    </div>
  );
};

export default SideBar;
