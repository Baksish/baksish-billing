import LoaderComponent from "@/app/Components/Loader/LoaderComponent";
import ViewBill from "./ViewBill";
import React from "react";
const BillPage = () => {
    return (
        <React.Suspense fallback={<div><LoaderComponent/></div>}>
        <div><ViewBill/></div>
        </React.Suspense>
    )
}

export default BillPage;
