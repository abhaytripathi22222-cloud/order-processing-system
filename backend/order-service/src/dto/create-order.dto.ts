export interface CreateOrderDto {
  orderNumber: string;
  customerId: string;
  sku: string;
  quantity: number;
}