import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PageShell, PageTitle, palette } from '@/components/shop-ui';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/data/shop';

export default function OrdersScreen() {
  const { orders } = useCart();

  return (
    <PageShell>
      <PageTitle title="Your orders" subtitle="Keep track of your MediSwift deliveries." />
      {orders.length > 0 ? (
        <View style={styles.orderList}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{order.id}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.placedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Confirmed</Text>
                </View>
              </View>
              <View style={styles.orderDivider} />
              {order.items.map((item) => (
                <View key={item.product.id} style={styles.orderItem}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.product.name} × {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </Text>
                </View>
              ))}
              <View style={[styles.orderItem, styles.orderTotal]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>{formatPrice(order.total)}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.orderIcon}>
            <View style={styles.orderLine} />
            <View style={styles.orderLine} />
            <View style={styles.orderLineShort} />
          </View>
          <Text style={styles.title}>No orders yet</Text>
          <Text style={styles.description}>
            When you place an order, its updates will appear here.
          </Text>
          <Pressable onPress={() => router.push('/search')} style={styles.button}>
            <Text style={styles.buttonText}>Explore medicines</Text>
          </Pressable>
        </View>
      )}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingTop: 54,
    paddingHorizontal: 28,
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#E6EDF2',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderNumber: {
    color: palette.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  orderDate: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#EAF7EF',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    color: '#33845B',
    fontSize: 9,
    fontWeight: '800',
  },
  orderDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E6EDF2',
    marginVertical: 12,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    color: palette.muted,
    fontSize: 11,
    marginRight: 10,
  },
  itemPrice: {
    color: palette.navy,
    fontSize: 11,
    fontWeight: '600',
  },
  orderTotal: {
    marginTop: 3,
    paddingTop: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6EDF2',
    marginBottom: 0,
  },
  totalLabel: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  totalPrice: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
  },
  orderIcon: {
    width: 62,
    height: 68,
    borderWidth: 2,
    borderColor: '#C4EDEF',
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 13,
    gap: 7,
    backgroundColor: '#F1FAFB',
  },
  orderLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#8DDADD',
  },
  orderLineShort: {
    width: '65%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#8DDADD',
  },
  title: {
    color: palette.navy,
    fontSize: 17,
    fontWeight: '800',
    marginTop: 15,
  },
  description: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
  },
  button: {
    marginTop: 17,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: palette.navy,
  },
  buttonText: {
    color: palette.white,
    fontSize: 11,
    fontWeight: '800',
  },
});
