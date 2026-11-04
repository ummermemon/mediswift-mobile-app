import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PageShell, PageTitle, palette } from '@/components/shop-ui';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/data/shop';

export default function CartScreen() {
  const { items, subtotal, changeQuantity, placeOrder } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  if (orderNumber) {
    return (
      <PageShell>
        <PageTitle
          title="Order placed!"
          subtitle={`Order ${orderNumber} is confirmed. Thanks for choosing MediSwift.`}
        />
        <View style={styles.emptyState}>
          <Text style={styles.successIcon}>✓</Text>
          <Pressable onPress={() => setOrderNumber(null)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continue shopping</Text>
          </Pressable>
        </View>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle
        title="Your cart"
        subtitle={items.length ? `${items.length} product${items.length === 1 ? '' : 's'} in your bag` : 'Your everyday essentials, all in one place.'}
      />

      {items.length > 0 ? (
        <>
          <View style={styles.items}>
            {items.map(({ product, quantity }) => (
              <View key={product.id} style={styles.cartItem}>
                <Image source={product.image} style={styles.productImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{product.name}</Text>
                  <Text style={styles.itemDescription}>{product.description}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(product.price)}</Text>
                </View>
                <View style={styles.quantityControl}>
                  <Pressable
                    onPress={() => changeQuantity(product.id, -1)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove one ${product.name}`}
                    style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <Pressable
                    onPress={() => changeQuantity(product.id, 1)}
                    accessibilityRole="button"
                    accessibilityLabel={`Add one ${product.name}`}
                    style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.deliveryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setOrderNumber(placeOrder().id)}
            accessibilityRole="button"
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continue to checkout · {formatPrice(subtotal)}</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyBag}>
            <Text style={styles.emptyBagIcon}>＋</Text>
          </View>
          <Text style={styles.emptyTitle}>Your cart is waiting</Text>
          <Text style={styles.emptyCopy}>Add a few essentials and they’ll show up here.</Text>
        </View>
      )}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  items: {
    gap: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderRadius: 16,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#E6EDF2',
  },
  productImage: {
    width: 66,
    height: 66,
    borderRadius: 13,
    backgroundColor: '#EFF9FA',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 11,
  },
  itemName: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  itemDescription: {
    color: palette.muted,
    fontSize: 9,
    marginTop: 4,
  },
  itemPrice: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 7,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F8F8',
  },
  quantityButtonText: {
    color: palette.teal,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
  },
  quantity: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
    minWidth: 10,
    textAlign: 'center',
  },
  summary: {
    marginTop: 20,
    padding: 15,
    borderRadius: 16,
    backgroundColor: '#F6F9FB',
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: palette.muted,
    fontSize: 12,
  },
  summaryValue: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  deliveryValue: {
    color: '#299562',
    fontSize: 12,
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E9EF',
    paddingTop: 12,
  },
  totalLabel: {
    color: palette.navy,
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    color: palette.navy,
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.navy,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 22,
  },
  emptyBag: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F7F9',
  },
  emptyBagIcon: {
    color: palette.teal,
    fontSize: 38,
    lineHeight: 43,
  },
  emptyTitle: {
    color: palette.navy,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 14,
  },
  emptyCopy: {
    color: palette.muted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 5,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#E8F7F0',
    color: '#299562',
    fontSize: 36,
    lineHeight: 72,
    fontWeight: '800',
  },
});
