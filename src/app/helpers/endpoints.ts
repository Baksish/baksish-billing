const endpoints={
    FETCH_ORDERS : "/api/orders/fetchorders/",
    FETCH_SINGLE_ORDER: "/api/orders/order/",
    UPDATE_ORDER_STATUS: `/api/orders/order/status/`,
    UPDATE_RESTAURANT_DETAILS: "/api/restaurant/update-restaurant/",
    FETCH_MENU : "/api/restaurant-menu/menu/",
    MENU_ITEM : "/api/restaurant-menu/menu/",
    FETCH_COMPLETED_SINGLE_ORDERS: "/api/orders/completed-orders/",
    DASHBOARD_STATUS_MENU_COUNT: "/api/dashboard/menu_count/",
    DASHBOARD_STATUS_ORDER_COUNT: "/api/dashboard/total_orders/",
    DASHBOARD_STATUS_CUSTOMER_COUNT: "/api/dashboard/total_customers/",
    DASHBOARD_STATUS_REVENUE: "/api/dashboard/average_order_amount/",
    FETCH_COMPLETED_ORDERS: "/api/dashboard/all-orders/",
}


export default endpoints;