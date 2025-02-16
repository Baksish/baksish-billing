import { formatTimestamp } from "@/app/helpers/otherHelpers";
import { orderType, ItemSize } from "@/app/Types/Type";
import * as htmlToImage from 'html-to-image';
import { capitalize } from "@mui/material";
import toast from "react-hot-toast";

const generateBillImage = async (order:orderType) => {
    const billElement = document.createElement('div');
    billElement.style.cssText = `
      background: white;
      padding: 40px;
      width: 400px;
      font-family: Arial, sans-serif;
      color: #333;
    `;

    billElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #1a1a1a; font-size: 24px;">${order?.restaurant_name}</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">${order?.restaurant_address}</p>
      </div>
      
      <div style="border-top: 2px dashed #ccc; border-bottom: 2px dashed #ccc; padding: 10px 0; margin: 15px 0;">
        <p style="margin: 5px 0; font-size: 14px;">Order #${order?.order_number}</p>
        <p style="margin: 5px 0; font-size: 14px;">Date: ${formatTimestamp(order?.order_date)}</p>
        <p style="margin: 5px 0; font-size: 14px;">Name: ${order?.customer_name}</p>
      </div>

      <div style="margin: 20px 0;">
        ${order?.order_item?.map(item => `
          <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 14px;">
            <div style="flex: 2;">
              <p style="margin: 0; font-weight: bold;">${capitalize(item?.menu_item?.food_item_id?.food_item_name)}</p>
              <p style="margin: 0; color: #666; font-size: 12px;">${ItemSize[item?.size as keyof typeof ItemSize]}</p>
            </div>
            <div style="flex: 1; text-align: center;">
              <p style="margin: 0;">x${item?.quantity}</p>
            </div>
            <div style="flex: 1; text-align: right;">
              <p style="margin: 0;">₹${parseFloat(item?.price || "0") * parseFloat(item?.quantity || "0")}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="border-top: 1px solid #eee; margin-top: 20px; padding-top: 10px;">
        <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
          <span>Subtotal</span>
          <span>₹${order?.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
          <span>CGST (${order?.cgst_percent}%)</span>
          <span>₹${order?.cgst_amount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
          <span>SGST (${order?.sgst_percent}%)</span>
          <span>₹${order?.sgst_amount}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px;">
          <span>Discount</span>
          <span>₹${order?.discount_amount}</span>
        </div>
      </div>

      <div style="border-top: 2px solid #333; margin-top: 10px; padding-top: 10px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px;">
          <span>Total Amount</span>
          <span>₹${order?.round_off_amount}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
        <p style="margin: 5px 0;">Thank you for your order!</p>
        <p style="margin: 5px 0;">Visit us again</p>
      </div>
    `;

    document.body.appendChild(billElement);
    
    try {
      const dataUrl = await htmlToImage.toPng(billElement);
      document.body.removeChild(billElement);
      return dataUrl;
    } catch (error) {
      toast.error("Error generating bill image:");
      document.body.removeChild(billElement);
      return null;
    }
  };

export default generateBillImage;