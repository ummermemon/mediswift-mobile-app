import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { products, type Product } from '@/data/shop';

type CartLine = {
  product: Product;
  quantity: number;
};

export type PlacedOrder = {
  id: string;
  items: CartLine[];
  total: number;
  placedAt: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  orders: PlacedOrder[];
  addItem: (product: Product) => void;
  changeQuantity: (productId: string, delta: number) => void;
  placeOrder: () => PlacedOrder;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<PlacedOrder[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((item) => item.id === productId);
        if (!product) {
          throw new Error(`Cart contains an unknown product: ${productId}`);
        }
        return { product, quantity };
      });

    return {
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.quantity * item.product.price, 0),
      orders,
      addItem: (product) =>
        setQuantities((current) => ({
          ...current,
          [product.id]: (current[product.id] ?? 0) + 1,
        })),
      changeQuantity: (productId, delta) =>
        setQuantities((current) => {
          const nextQuantity = (current[productId] ?? 0) + delta;
          if (nextQuantity <= 0) {
            const next = { ...current };
            delete next[productId];
            return next;
          }
          return { ...current, [productId]: nextQuantity };
        }),
      placeOrder: () => {
        if (items.length === 0) {
          throw new Error('Cannot place an order with an empty cart');
        }
        const order: PlacedOrder = {
          id: `MS-${String(orders.length + 1).padStart(4, '0')}`,
          items,
          total: items.reduce((total, item) => total + item.quantity * item.product.price, 0),
          placedAt: Date.now(),
        };
        setOrders((current) => [order, ...current]);
        setQuantities({});
        return order;
      },
    };
  }, [orders, quantities]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
