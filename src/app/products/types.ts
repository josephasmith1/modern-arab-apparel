export type CartItem = {
  id: string;
  name: string | undefined;
  price: string | undefined;
  image: string | undefined;
  color: string | undefined;
  size: string;
  quantity: number;
  vendor: string | undefined;
  tags: string[] | undefined;
};

export type ProductVariant = {
  size: string;
  price: number;
  sku: string;
  available: boolean;
};
