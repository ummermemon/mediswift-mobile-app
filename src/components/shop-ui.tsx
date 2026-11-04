import { router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { PropsWithChildren } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCart } from '@/context/cart-context';
import { formatPrice, type Product } from '@/data/shop';

export const palette = {
  navy: '#10284C',
  teal: '#08B2B4',
  muted: '#566986',
  pale: '#E8F7F9',
  border: '#E6EDF2',
  white: '#FFFFFF',
  background: '#F6F9FB',
};

const navigation = [
  { name: 'Home', path: '/', image: require('../../assets/images/medi-nav-home.png') },
  { name: 'Search', path: '/search', image: require('../../assets/images/medi-nav-search.png') },
  { name: 'Orders', path: '/orders' },
  { name: 'Cart', path: '/cart', image: require('../../assets/images/medi-nav-cart.png') },
  { name: 'Account', path: '/account', image: require('../../assets/images/medi-nav-account.png') },
] as const;

export function PageShell({ children }: PropsWithChildren) {
  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <HeaderArtwork />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <AppHeader />
          {children}
        </ScrollView>
        <AppFooter />
      </SafeAreaView>
    </View>
  );
}

function HeaderArtwork() {
  return (
    <View pointerEvents="none" style={styles.headerArtwork}>
      <View style={styles.artworkOrb} />
      <View style={styles.artworkOrbAccent} />
      <View style={styles.artworkCross}>
        <View style={styles.artworkCrossVertical} />
        <View style={styles.artworkCrossHorizontal} />
      </View>
      <View style={styles.artworkDot} />
      <View style={styles.artworkDotSmall} />
    </View>
  );
}

function AppHeader() {
  return (
    <View style={styles.header}>
      {Platform.OS === 'web' && (
        <View style={styles.systemStatus} accessibilityLabel="Status bar">
          <Text style={styles.systemTime}>9:41</Text>
          <View style={styles.systemIndicators}>
            <View style={styles.signalBars}>
              <View style={[styles.signalBar, styles.signalBarOne]} />
              <View style={[styles.signalBar, styles.signalBarTwo]} />
              <View style={[styles.signalBar, styles.signalBarThree]} />
              <View style={[styles.signalBar, styles.signalBarFour]} />
            </View>
            <View style={styles.wifiIcon}>
              <View style={styles.wifiArcOuter} />
              <View style={styles.wifiArcInner} />
              <View style={styles.wifiDot} />
            </View>
            <View style={styles.batteryIcon}>
              <View style={styles.batteryLevel} />
              <View style={styles.batteryNub} />
            </View>
          </View>
        </View>
      )}
      <View style={styles.brandRow}>
        <Image
          source={require('../../assets/images/mediswift-full-logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="MediSwift — Where Healthcare Meets Technology"
        />
        <Pressable
          onPress={() => router.push('/account')}
          accessibilityRole="button"
          accessibilityLabel="Account"
          style={styles.accountButton}>
          <Image
            source={require('../../assets/images/medi-nav-account.png')}
            style={styles.accountIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
}

function AppFooter() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <SafeAreaView style={styles.bottomSafeArea} edges={['bottom']}>
      <View style={styles.bottomBar}>
        {navigation.map((item) => {
          const active =
            item.path === '/'
              ? pathname === '/'
              : item.name === 'Cart'
                ? pathname === '/cart'
                : pathname.startsWith(item.path);
          return (
            <Pressable
              key={item.name}
              onPress={() => router.push(item.path)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={styles.tab}>
              <View style={styles.tabIconBox}>
                {'image' in item ? (
                  <Image
                    source={item.image}
                    style={[styles.tabIcon, active && styles.tabIconActive]}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[styles.ordersIcon, active && styles.ordersIconActive]}>
                    <View style={styles.ordersLine} />
                    <View style={styles.ordersLine} />
                    <View style={styles.ordersLineShort} />
                  </View>
                )}
                {item.name === 'Cart' && itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.name}</Text>
              {active && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <View style={styles.productCard}>
      <Image source={product.image} style={styles.productImage} resizeMode="contain" />
      <Text style={styles.productName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.productDescription} numberOfLines={1}>
        {product.description}
      </Text>
      <View style={styles.productBottom}>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        <Pressable
          onPress={() => addItem(product)}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name} to cart`}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.pageTitle}>
      <Text style={styles.pageTitleText}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Text style={styles.sectionAction}>{action} →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: palette.white,
  },
  headerArtwork: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 390,
    overflow: 'hidden',
  },
  artworkOrb: {
    position: 'absolute',
    top: -126,
    right: -118,
    width: 365,
    height: 365,
    borderRadius: 183,
    backgroundColor: '#E4F7F9',
  },
  artworkOrbAccent: {
    position: 'absolute',
    top: 97,
    right: -116,
    width: 248,
    height: 248,
    borderRadius: 124,
    backgroundColor: '#D7F3F6',
    opacity: 0.78,
  },
  artworkCross: {
    position: 'absolute',
    top: 112,
    right: 30,
    width: 25,
    height: 25,
    opacity: 0.48,
  },
  artworkCrossVertical: {
    position: 'absolute',
    width: 3,
    height: 25,
    left: 11,
    borderRadius: 2,
    backgroundColor: '#80DCE0',
  },
  artworkCrossHorizontal: {
    position: 'absolute',
    width: 25,
    height: 3,
    top: 11,
    borderRadius: 2,
    backgroundColor: '#80DCE0',
  },
  artworkDot: {
    position: 'absolute',
    top: 74,
    right: 72,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#8DE0E2',
  },
  artworkDotSmall: {
    position: 'absolute',
    top: 97,
    right: 19,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#8DE0E2',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 14 : 16,
    paddingBottom: 28,
  },
  header: {
    marginBottom: 25,
  },
  systemStatus: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 19,
    paddingHorizontal: 5,
  },
  systemTime: {
    color: '#101828',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  systemIndicators: {
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  signalBars: {
    height: 13,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  signalBar: {
    width: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#101828',
  },
  signalBarOne: { height: 5 },
  signalBarTwo: { height: 8 },
  signalBarThree: { height: 10 },
  signalBarFour: { height: 13 },
  wifiIcon: {
    width: 17,
    height: 15,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  wifiArcOuter: {
    position: 'absolute',
    top: 1,
    width: 16,
    height: 12,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#101828',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
  wifiArcInner: {
    position: 'absolute',
    bottom: 3,
    width: 8,
    height: 7,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#101828',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  wifiDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#101828',
  },
  batteryIcon: {
    width: 19,
    height: 10,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#101828',
    borderRadius: 3,
    padding: 1.5,
  },
  batteryLevel: {
    width: '78%',
    height: '100%',
    borderRadius: 1,
    backgroundColor: '#101828',
  },
  batteryNub: {
    position: 'absolute',
    right: -3,
    width: 2,
    height: 4,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor: '#101828',
  },
  brandRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 194,
    height: 52,
  },
  accountButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F7F8',
  },
  accountIcon: {
    width: 23,
    height: 23,
    tintColor: palette.navy,
  },
  pageTitle: {
    marginTop: 1,
    marginBottom: 18,
  },
  pageTitleText: {
    color: palette.navy,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  pageSubtitle: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: palette.navy,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  sectionAction: {
    color: palette.teal,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomSafeArea: {
    backgroundColor: palette.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    paddingBottom: Platform.OS === 'web' ? 19 : 0,
  },
  bottomBar: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 3,
  },
  tab: {
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  tabIconBox: {
    height: 29,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    tintColor: '#65748A',
  },
  tabIconActive: {
    tintColor: palette.teal,
  },
  ordersIcon: {
    width: 19,
    height: 22,
    borderWidth: 1.8,
    borderRadius: 4,
    borderColor: '#65748A',
    paddingHorizontal: 3,
    paddingTop: 5,
    gap: 3,
  },
  ordersIconActive: {
    borderColor: palette.teal,
  },
  ordersLine: {
    height: 1.5,
    borderRadius: 1,
    backgroundColor: '#65748A',
  },
  ordersLineShort: {
    width: '70%',
    height: 1.5,
    borderRadius: 1,
    backgroundColor: '#65748A',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -3,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#F27463',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: palette.white,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '800',
  },
  tabLabel: {
    color: '#65748A',
    fontSize: 9,
    marginTop: 2,
  },
  tabLabelActive: {
    color: palette.teal,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '70%',
    height: 2,
    borderRadius: 2,
    backgroundColor: palette.teal,
  },
  productCard: {
    width: 168,
    padding: 11,
    borderRadius: 16,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#EFF9FA',
  },
  productName: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 9,
  },
  productDescription: {
    color: palette.muted,
    fontSize: 9,
    marginTop: 3,
  },
  productBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  productPrice: {
    color: palette.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: palette.pale,
  },
  addButtonText: {
    color: palette.teal,
    fontSize: 10,
    fontWeight: '800',
  },
});
