import { Stack } from 'expo-router';

import { CartProvider } from '@/context/cart-context';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CartProvider>
  );
}
