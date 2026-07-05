import type { Order } from "./types";
import { OrderStatus, OrderType } from "./types";

const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  [OrderType.BUY]: "Buy",
  [OrderType.SELL]: "Sell",
  [OrderType.DEPOSIT]: "Deposit",
  [OrderType.WITHDRAW]: "Withdraw",
  [OrderType.GLOBAL_PAYOUT]: "Global Payout",
  [OrderType.TAG_SEND]: "Tag Send",
  [OrderType.TAG_RECEIVE]: "Tag Receive",
  [OrderType.CARD_FUNDING]: "Card Funding",
  [OrderType.CARD_CHARGE]: "Card Charge",
  [OrderType.CARD_WITHDRAWAL]: "Card Withdrawal",
  [OrderType.CARD_CREATION]: "Card Creation",
};

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.RECEIVED]: "Received",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.CANCELLED]: "Cancelled",
};

export function formatOrderType(type: OrderType | null | undefined): string {
  if (!type) {
    return "—";
  }

  return ORDER_TYPE_LABELS[type] ?? type;
}

export function formatOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getOrderStatusClass(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.COMPLETED:
      return "bg-success-color/10 text-success-color";
    case OrderStatus.RECEIVED:
      return "bg-secondary/10 text-secondary";
    case OrderStatus.PROCESSING:
      return "bg-primary/10 text-primary";
    case OrderStatus.CANCELLED:
    default:
      return "bg-hint-text-color/10 text-hint-text-color";
  }
}

export function getTransactionAccountName(order: Order): string {
  if (order.receiverAccountName) {
    return order.receiverAccountName;
  }

  if (order.senderUsername) {
    return order.senderUsername;
  }

  if (order.recipientUsername) {
    return order.recipientUsername;
  }

  return order.userId;
}

export function canCompleteTransaction(order: Order): boolean {
  return (
    order.status === OrderStatus.PROCESSING ||
    order.status === OrderStatus.RECEIVED
  );
}

export function canReverseTransaction(order: Order): boolean {
  return order.status === OrderStatus.RECEIVED;
}
