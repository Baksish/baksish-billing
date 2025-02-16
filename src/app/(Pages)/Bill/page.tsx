import ViewBill from "./ViewBill";
import React from "react";
const BillPage = () => {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
        <div><ViewBill/></div>
        </React.Suspense>
    )
}

export default BillPage;
