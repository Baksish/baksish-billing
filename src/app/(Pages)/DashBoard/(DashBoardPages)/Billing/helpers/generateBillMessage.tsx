import { formatTimestamp } from "@/app/helpers/otherHelpers";
import { orderType, ItemSize } from "@/app/Types/Type";
import { capitalize } from "@mui/material";

const generateBillMessage = async(order:orderType) => {
    const header = `🧾 *${order.restaurant_name}*\n` +
      `📍 ${order.restaurant_address}\n` +
      `---------------------------\n` +
      `Order #${order.order_number}\n` +
      `Date: ${formatTimestamp(order.order_date)}\n` +
      `Customer: ${order.customer_name}\n` +
      `---------------------------\n\n`;

    const items = order.order_item.map(item => 
      `${capitalize(item.name || "")} ` +
      `(${ItemSize[item.size as keyof typeof ItemSize]})\n` +
      `${item.quantity} x ₹${item.price} = ₹${parseFloat(item.price || "0") * parseFloat(item.quantity || "0")}`
    ).join('\n\n');

    const footer = `\n---------------------------\n` +
      `Subtotal: ₹${order.subtotal}\n` +
      `CGST (${order.cgst_percent}%): ₹${order.cgst_amount}\n` +
      `SGST (${order.sgst_percent}%): ₹${order.sgst_amount}\n` +
      `Discount: ₹${order.discount_amount}\n` +
      `---------------------------\n` +
      `*Total Amount: ₹${order.round_off_amount}*\n\n` +
      `View and download your bill here: \n${process.env.NEXT_PUBLIC_APP_URL}/Bill/?id=${order.order_id}\n\n` +
      `Thank you for your order! 🙏`;

    return header + items + footer;
  };

export default generateBillMessage;