import { orderItemType, orderType } from "@/app/Types/Type";
import { ItemSize } from "../../../../../Types/Type";

export const generatePrintContent = (order: orderType) => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              margin: 10px;
              font-size: 12px;
              width: 90mm;
            }
            .order-header {
              text-align: center;
              margin-bottom: 10px;
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
            }
            .order-header h2 {
              margin: 5px 0;
              font-size: 16px;
            }
            .order-header p {
              margin: 3px 0;
              font-size: 14px;
            }
            .order-items {
              margin-top: 10px;
            }
            .item {
              margin-bottom: 5px;
              font-size: 14px;
              white-space: normal;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            @media print {
              @page {
                margin: 5mm;
                size: 102mm;
              }
              body {
                width: 90mm;
                margin: 5mm;
                height: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="order-header">
            <h2>Kitchen Order</h2>
            <p><b>Token: #${order.order_number}</b></p>
            <p>ID: ${order.order_id}</p>
            <p>Customer: ${order.customer_name}</p>
            <p>Phone: ${order.customer_phone}</p>
          </div>
          <div class="order-items">
            ${order.order_item.map((item: orderItemType) => `
              <div class="item">
                • ${item.name} 
                  (${ItemSize[item.size as keyof typeof ItemSize]}) 
                  x${item.quantity}
              </div>
            `).join('')}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `;
  };