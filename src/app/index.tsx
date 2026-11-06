import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { categories, formatPrice, products, type Product } from '@/data/shop';

type HomeTab = 'Home' | 'Search' | 'Cart' | 'Offers' | 'Account';

const pharmacies = [
  { name: 'Apollo', detail: 'Pharmacy', rating: '4.8', time: '2 min', color: '#00899B' },
  { name: 'MedPlus', detail: '', rating: '4.7', time: '3 min', color: '#E21E27' },
  { name: '1mg', detail: '', rating: '4.8', time: '4 min', color: '#171717' },
  { name: 'Netmeds', detail: '', rating: '4.6', time: '4 min', color: '#42C933' },
];

const categoryLabels: Record<string, string> = {
  'pain-relief': 'Medicines',
  vitamins: 'Vitamins',
  skincare: 'Skin & Hair',
  'baby-care': 'Baby Care',
  'first-aid': 'Wellness',
};

function SectionHeading({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress} accessibilityRole="button">
          <Text style={styles.sectionAction}>{action}  ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ProductTile({
  product,
  quantity,
  onAdd,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const [favorite, setFavorite] = useState(false);

  return (
    <View style={styles.productCard}>
      <View style={styles.productTopRow}>
        <Text style={styles.discountBadge}>
          {product.discount ? `${product.discount}% OFF` : 'POPULAR'}
        </Text>
        <Pressable
          onPress={() => setFavorite((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={favorite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}>
          <Text style={[styles.favorite, favorite && styles.favoriteActive]}>{favorite ? '♥' : '♡'}</Text>
        </Pressable>
      </View>
      <Image source={product.image} style={styles.productImage} resizeMode="contain" />
      <Text style={styles.deliveryNote}>⚡ 15 MINS</Text>
      <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.productDescription} numberOfLines={1}>{product.description}</Text>
      <View style={styles.productBottomRow}>
        <View style={styles.productPriceGroup}>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          {product.originalPrice ? (
            <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
          ) : null}
        </View>
        {quantity > 0 ? (
          <View style={styles.quantityControl}>
            <Pressable onPress={onRemove} accessibilityRole="button" accessibilityLabel={`Remove one ${product.name}`}>
              <Text style={styles.quantityButton}>−</Text>
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable onPress={onAdd} accessibilityRole="button" accessibilityLabel={`Add one ${product.name}`}>
              <Text style={styles.quantityButton}>+</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={onAdd} style={styles.addButton} accessibilityRole="button" accessibilityLabel={`Add ${product.name} to cart`}>
            <Text style={styles.addButtonText}>Add  +</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { token, signOut } = useAuth();
  const { items, itemCount, subtotal, addItem, changeQuantity } = useCart();
  const searchRef = useRef<TextInputInstance>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<HomeTab>('Home');
  const [deliveryAddress, setDeliveryAddress] = useState('Home');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [draftAddress, setDraftAddress] = useState(deliveryAddress);
  const [prescription, setPrescription] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isPickingPrescription, setIsPickingPrescription] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.description} ${product.category} ${product.subcategory}`
        .toLocaleLowerCase()
        .includes(query)
    );
  }, [search]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  async function choosePrescription() {
    setIsPickingPrescription(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Photo access needed',
          'Allow access to your photos to choose a prescription image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.85,
      });
      if (!result.canceled) {
        setPrescription(result.assets[0]);
      }
    } catch {
      Alert.alert('Could not open photos', 'Please try selecting your prescription again.');
    } finally {
      setIsPickingPrescription(false);
    }
  }

  function openSearch() {
    setActiveTab('Search');
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  function selectCategory(categoryName: string) {
    const category = categories.find(
      (item) => (categoryLabels[item.slug] ?? item.name) === categoryName
    );
    setSearch(category?.name ?? categoryName);
    setActiveTab('Search');
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch {
      Alert.alert('Could not sign out', 'Please try again.');
    }
  }

  const homeContent = (
    <>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/mediswift-logo-transparent.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="MediSwift"
        />
        <Pressable
          onPress={() => setActiveTab('Account')}
          style={styles.accountButton}
          accessibilityRole="button"
          accessibilityLabel="Open account">
          <Text style={styles.accountIcon}>♙</Text>
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          ref={searchRef}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            if (text) setActiveTab('Search');
          }}
          placeholder="Search medicines, wellness & more..."
          placeholderTextColor="#7280A8"
          style={styles.searchInput}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search medicines, wellness products, and more"
        />
        <View style={styles.searchDivider} />
        <Pressable
          onPress={openSearch}
          accessibilityRole="button"
          accessibilityLabel="Start search">
          <Text style={styles.micIcon}>⌕</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          setDraftAddress(deliveryAddress);
          setAddressModalVisible(true);
        }}
        style={styles.deliveryCard}
        accessibilityRole="button"
        accessibilityLabel={`Deliver to ${deliveryAddress}. Change address`}>
        <Text style={styles.pinIcon}>●</Text>
        <View style={styles.deliveryCopy}>
          <Text style={styles.deliveryLabel}>Deliver to</Text>
          <Text style={styles.deliveryAddress}>{deliveryAddress} · 15 min⌄</Text>
        </View>
        <Image
          source={require('../../assets/images/medi-delivery-art.png')}
          style={styles.riderImage}
          resizeMode="contain"
          accessibilityLabel="Medicine delivery rider"
        />
        <Text style={styles.changeAddress}>Change</Text>
      </Pressable>

      <Pressable
        onPress={choosePrescription}
        disabled={isPickingPrescription}
        style={styles.prescriptionCard}
        accessibilityRole="button"
        accessibilityLabel="Choose a prescription image to upload">
        {prescription ? (
          <Image source={{ uri: prescription.uri }} style={styles.prescriptionPreview} />
        ) : (
          <View style={styles.prescriptionIconBox}>
            {isPickingPrescription ? (
              <ActivityIndicator color="#1264F5" />
            ) : (
              <Text style={styles.prescriptionPlus}>＋</Text>
            )}
          </View>
        )}
        <View style={styles.prescriptionCopy}>
          <Text style={styles.prescriptionTitle}>
            {prescription ? 'Prescription selected' : 'Upload Prescription'}
          </Text>
          <Text style={styles.prescriptionSubtitle} numberOfLines={1}>
            {prescription?.fileName ?? 'Get your medicines faster'}
          </Text>
        </View>
        <View style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>{prescription ? 'Change' : 'Upload'}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => setActiveTab('Offers')}
        style={styles.promoBanner}
        accessibilityRole="button"
        accessibilityLabel="View medicine and wellness offers">
        <View style={styles.promoCopy}>
          <Text style={styles.promoEyebrow}>BIG SAVINGS, BIGGER CARE!</Text>
          <Text style={styles.promoTitle}>Flat <Text style={styles.promoPercent}>25%</Text> OFF</Text>
          <Text style={styles.promoSubtitle}>on Medicines & Wellness Products</Text>
          <Text style={styles.promoCode}>Use Code: <Text style={styles.promoCodeValue}>MED25</Text></Text>
        </View>
        <Image
          source={require('../../assets/images/login-hero-realistic.png')}
          style={styles.promoImage}
          resizeMode="contain"
          accessible={false}
        />
      </Pressable>

      <View style={styles.carouselDots}>
        <View style={[styles.carouselDot, styles.carouselDotActive]} />
        <View style={styles.carouselDot} />
        <View style={styles.carouselDot} />
      </View>

      <SectionHeading title="Online Pharmacies" action="View all" onPress={() => setActiveTab('Search')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pharmacyRow}>
        {pharmacies.map((pharmacy) => (
          <Pressable
            key={pharmacy.name}
            style={styles.pharmacyCard}
            onPress={() => Alert.alert(pharmacy.name, 'Partner pharmacy browsing is not connected yet.')}
            accessibilityRole="button"
            accessibilityLabel={`${pharmacy.name}, rating ${pharmacy.rating}, ${pharmacy.time} delivery`}>
            <Text style={[styles.pharmacyLogo, { color: pharmacy.color }]}>{pharmacy.name}</Text>
            {pharmacy.detail ? <Text style={styles.pharmacyDetail}>{pharmacy.detail}</Text> : <View style={styles.pharmacySpacer} />}
            <Text style={styles.pharmacyMeta}>⭐ {pharmacy.rating}  │  {pharmacy.time}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeading title="Shop by Category" action="See all" onPress={() => setActiveTab('Search')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((category, index) => (
          <Pressable
            key={category.slug}
            onPress={() => selectCategory(categoryLabels[category.slug] ?? category.name)}
            style={[styles.categoryCard, categoryBackgrounds[index % categoryBackgrounds.length]]}
            accessibilityRole="button"
            accessibilityLabel={`Shop ${categoryLabels[category.slug] ?? category.name}`}>
            <Image source={category.image} style={styles.categoryImage} resizeMode="contain" />
            <Text style={styles.categoryName}>{categoryLabels[category.slug] ?? category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeading title={search ? 'Search Results' : 'Popular Products'} action="See all" onPress={() => setActiveTab('Search')} />
      {filteredProducts.length ? (
        <View style={styles.productGrid}>
          {(search ? filteredProducts : filteredProducts.slice(0, 4)).map((product) => (
            <ProductTile
              key={product.id}
              product={product}
              quantity={items.find((item) => item.product.id === product.id)?.quantity ?? 0}
              onAdd={() => addItem(product)}
              onRemove={() => changeQuantity(product.id, -1)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptySearch}>
          <Text style={styles.emptySearchTitle}>No matching products yet</Text>
          <Text style={styles.emptySearchText}>Try a different medicine or category.</Text>
        </View>
      )}
    </>
  );

  const cartContent = (
    <View style={styles.secondaryPage}>
      <Text style={styles.pageTitle}>Your Cart</Text>
      {items.length ? (
        <>
          {items.map(({ product, quantity }) => (
            <View style={styles.cartLine} key={product.id}>
              <Image source={product.image} style={styles.cartProductImage} resizeMode="contain" />
              <View style={styles.cartLineCopy}>
                <Text style={styles.cartProductName}>{product.name}</Text>
                <Text style={styles.cartProductPrice}>{formatPrice(product.price)}</Text>
              </View>
              <View style={styles.quantityControl}>
                <Pressable onPress={() => changeQuantity(product.id, -1)} accessibilityRole="button">
                  <Text style={styles.quantityButton}>−</Text>
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable onPress={() => addItem(product)} accessibilityRole="button">
                  <Text style={styles.quantityButton}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal · {itemCount} items</Text>
            <Text style={styles.subtotalAmount}>{formatPrice(subtotal)}</Text>
          </View>
          <Pressable
            onPress={() => Alert.alert('Checkout', 'Checkout is not connected yet.')}
            style={styles.checkoutButton}
            accessibilityRole="button">
            <Text style={styles.checkoutText}>Continue to checkout</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.emptySearch}>
          <Text style={styles.emptySearchTitle}>Your cart is empty</Text>
          <Text style={styles.emptySearchText}>Add products from the home screen to get started.</Text>
          <Pressable onPress={() => setActiveTab('Home')} style={styles.checkoutButton}>
            <Text style={styles.checkoutText}>Browse products</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const accountContent = (
    <View style={styles.secondaryPage}>
      <Text style={styles.pageTitle}>Your Account</Text>
      <Text style={styles.accountIntro}>Manage your MediSwift account and preferences.</Text>
      <Pressable onPress={handleSignOut} style={styles.signOutButton} accessibilityRole="button">
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );

  const offersContent = (
    <View style={styles.secondaryPage}>
      <Text style={styles.pageTitle}>Offers for you</Text>
      <View style={styles.offerCard}>
        <Text style={styles.offerHeadline}>25% OFF</Text>
        <Text style={styles.offerDescription}>on medicines and wellness products</Text>
        <Text style={styles.offerCode}>Use code MED25</Text>
      </View>
      <SectionHeading
        title="Products on offer"
        action="Browse"
        onPress={() => setActiveTab('Search')}
      />
      <View style={styles.productGrid}>
        {products.filter((product) => product.discount).map((product) => (
          <ProductTile
            key={product.id}
            product={product}
            quantity={items.find((item) => item.product.id === product.id)?.quantity ?? 0}
            onAdd={() => addItem(product)}
            onRemove={() => changeQuantity(product.id, -1)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {activeTab === 'Cart'
            ? cartContent
            : activeTab === 'Account'
              ? accountContent
              : activeTab === 'Offers'
                ? offersContent
                : homeContent}
        </ScrollView>
        <View style={styles.bottomBar}>
          {(['Home', 'Search', 'Cart', 'Offers', 'Account'] as HomeTab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => (tab === 'Search' ? openSearch() : setActiveTab(tab))}
              style={[styles.bottomTab, tab === 'Cart' && styles.cartTab]}
              accessibilityRole="button"
              accessibilityState={{ selected: activeTab === tab }}
              accessibilityLabel={tab === 'Cart' ? `Cart, ${itemCount} items` : tab}>
              {tab === 'Cart' ? (
                <View style={[styles.cartTabIcon, activeTab === 'Cart' && styles.cartTabIconActive]}>
                  <Text style={styles.cartGlyph}>🛒</Text>
                  {itemCount > 0 ? (
                    <View style={styles.cartCountBadge}>
                      <Text style={styles.cartCountText}>{itemCount > 9 ? '9+' : itemCount}</Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <Text style={[styles.tabGlyph, activeTab === tab && styles.tabGlyphActive]}>
                  {tab === 'Home' ? '⌂' : tab === 'Search' ? '⌕' : tab === 'Offers' ? '◇' : '♙'}
                </Text>
              )}
              <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</Text>
              {activeTab === tab && tab !== 'Cart' ? <View style={styles.tabIndicator} /> : null}
            </Pressable>
          ))}
        </View>
      </SafeAreaView>

      <Modal
        transparent
        visible={addressModalVisible}
        animationType="fade"
        onRequestClose={() => setAddressModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.addressModal}>
            <Text style={styles.addressModalTitle}>Delivery address</Text>
            <TextInput
              value={draftAddress}
              onChangeText={setDraftAddress}
              placeholder="Enter address label"
              style={styles.addressInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable onPress={() => setAddressModalVisible(false)} style={styles.modalCancel}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (draftAddress.trim()) setDeliveryAddress(draftAddress.trim());
                  setAddressModalVisible(false);
                }}
                style={styles.modalSave}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FDFDFF' },
  safeArea: { flex: 1 },
  loading: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 66, marginBottom: 8 },
  logo: { width: 194, height: 60, marginLeft: -9 },
  accountButton: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E5E9FA', elevation: 3 },
  accountIcon: { color: '#075CFF', fontSize: 32, lineHeight: 36 },
  searchBar: { height: 52, borderRadius: 27, borderWidth: 1, borderColor: '#DDE3FF', backgroundColor: '#FAFBFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 14, elevation: 2 },
  searchIcon: { color: '#0B2B80', fontSize: 28, width: 32, textAlign: 'center' },
  searchInput: { flex: 1, height: '100%', color: '#172A66', fontSize: 14, paddingHorizontal: 7 },
  searchDivider: { width: 1, height: 28, backgroundColor: '#C8D1F2', marginHorizontal: 10 },
  micIcon: { color: '#075CFF', fontSize: 25, width: 26, textAlign: 'center' },
  deliveryCard: { height: 73, borderRadius: 25, backgroundColor: '#EDF1FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 12, overflow: 'hidden' },
  pinIcon: { color: '#0864F8', fontSize: 27, width: 32, textAlign: 'center' },
  deliveryCopy: { flex: 1, paddingLeft: 8 },
  deliveryLabel: { color: '#11245F', fontSize: 13 },
  deliveryAddress: { color: '#0B1C57', fontSize: 15, fontWeight: '700', marginTop: 2 },
  riderImage: { width: 96, height: 58, marginRight: 6 },
  changeAddress: { color: '#075CFF', backgroundColor: '#DDE6FF', overflow: 'hidden', borderRadius: 24, paddingHorizontal: 15, paddingVertical: 10, fontSize: 13, fontWeight: '700' },
  prescriptionCard: { minHeight: 74, borderRadius: 22, backgroundColor: '#F0F3FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 16 },
  prescriptionIconBox: { width: 58, height: 58, borderRadius: 15, borderWidth: 1.5, borderColor: '#AFC4FF', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  prescriptionPlus: { fontSize: 37, color: '#075CFF', lineHeight: 42 },
  prescriptionPreview: { width: 56, height: 56, borderRadius: 12 },
  prescriptionCopy: { flex: 1, marginLeft: 14 },
  prescriptionTitle: { color: '#10245E', fontSize: 14, fontWeight: '800' },
  prescriptionSubtitle: { color: '#5D6A98', fontSize: 12, marginTop: 4 },
  uploadButton: { minWidth: 94, height: 44, borderRadius: 24, backgroundColor: '#075CFF', alignItems: 'center', justifyContent: 'center' },
  uploadButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  promoBanner: { minHeight: 165, borderRadius: 24, overflow: 'hidden', backgroundColor: '#0759F8', marginBottom: 10, justifyContent: 'center' },
  promoCopy: { zIndex: 1, paddingLeft: 20, paddingVertical: 16, width: '74%' },
  promoEyebrow: { alignSelf: 'flex-start', color: '#FFFFFF', backgroundColor: '#0B75F6', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4, fontSize: 10, fontWeight: '700' },
  promoTitle: { color: '#FFFFFF', fontSize: 29, fontWeight: '800', marginTop: 7 },
  promoPercent: { color: '#12D7FF', fontSize: 37 },
  promoSubtitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginTop: 1 },
  promoCode: { color: '#EAF2FF', fontSize: 13, borderWidth: 1, borderColor: '#16BDFB', borderRadius: 12, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, marginTop: 10 },
  promoCodeValue: { color: '#13D9FF', fontWeight: '800' },
  promoImage: { position: 'absolute', right: -3, bottom: 1, width: '39%', height: '92%' },
  carouselDots: { flexDirection: 'row', justifyContent: 'center', gap: 9, marginBottom: 12, marginTop: 1 },
  carouselDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#D5DCF5' },
  carouselDotActive: { width: 25, backgroundColor: '#075CFF' },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 4 },
  sectionTitle: { color: '#0B1D61', fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionAction: { color: '#075CFF', fontSize: 13, fontWeight: '700' },
  pharmacyRow: { gap: 8, paddingBottom: 12 },
  pharmacyCard: { width: 113, height: 102, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E9ECFA', alignItems: 'center', justifyContent: 'center', padding: 8, elevation: 2 },
  pharmacyLogo: { fontSize: 17, fontWeight: '900' },
  pharmacyDetail: { color: '#19285C', fontSize: 10, fontWeight: '600', marginTop: 2 },
  pharmacySpacer: { height: 15 },
  pharmacyMeta: { color: '#59688F', fontSize: 10, marginTop: 8 },
  categoryRow: { gap: 9, paddingBottom: 14 },
  categoryCard: { width: 100, height: 120, borderRadius: 22, alignItems: 'center', justifyContent: 'center', padding: 8 },
  categoryBlue: { backgroundColor: '#EEF3FF' },
  categoryYellow: { backgroundColor: '#FFF7E9' },
  categoryLavender: { backgroundColor: '#F0F1FF' },
  categoryPink: { backgroundColor: '#FFF0F5' },
  categoryMint: { backgroundColor: '#EAF8F2' },
  categoryImage: { width: 62, height: 64 },
  categoryName: { color: '#10245F', textAlign: 'center', fontSize: 12, lineHeight: 15, fontWeight: '700', marginTop: 5 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  productCard: { width: '49%', minHeight: 226, borderRadius: 22, borderWidth: 1, borderColor: '#E5E9FA', backgroundColor: '#FFFFFF', padding: 11, elevation: 2 },
  productTopRow: { height: 25, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  discountBadge: { color: '#17652E', backgroundColor: '#D7F9C7', borderRadius: 14, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 4, fontSize: 10, fontWeight: '800' },
  favorite: { color: '#53669E', fontSize: 24, lineHeight: 24 },
  favoriteActive: { color: '#F34A68' },
  productImage: { alignSelf: 'center', width: 100, height: 94, marginTop: 2, marginBottom: 2 },
  deliveryNote: { color: '#075CFF', fontSize: 9, fontWeight: '800', marginBottom: 4 },
  productName: { color: '#0B1D61', fontSize: 12, fontWeight: '800' },
  productDescription: { color: '#7783A6', fontSize: 10, marginTop: 3 },
  productBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  productPrice: { color: '#101D53', fontSize: 17, fontWeight: '900' },
  productPriceGroup: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  originalPrice: { color: '#8792B0', fontSize: 11, textDecorationLine: 'line-through' },
  addButton: { borderWidth: 1.5, borderColor: '#075CFF', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 5 },
  addButtonText: { color: '#075CFF', fontSize: 12, fontWeight: '800' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#BFD0FF', borderRadius: 18, paddingHorizontal: 8, paddingVertical: 2 },
  quantityButton: { color: '#075CFF', fontSize: 18, fontWeight: '700' },
  quantityText: { color: '#10245F', fontSize: 12, fontWeight: '700' },
  emptySearch: { alignItems: 'center', padding: 26, backgroundColor: '#F3F6FF', borderRadius: 20, marginVertical: 10 },
  emptySearchTitle: { color: '#11245F', fontSize: 16, fontWeight: '800' },
  emptySearchText: { color: '#68799D', fontSize: 13, marginTop: 6, textAlign: 'center' },
  bottomBar: { height: 76, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderRadius: 38, marginHorizontal: 12, marginBottom: 4, elevation: 10, shadowColor: '#9AACEA', shadowOpacity: 0.16, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  bottomTab: { minWidth: 55, alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' },
  tabGlyph: { color: '#101D53', fontSize: 27, lineHeight: 31 },
  tabGlyphActive: { color: '#075CFF' },
  tabLabel: { color: '#101D53', fontSize: 11, marginTop: 1 },
  tabLabelActive: { color: '#075CFF', fontWeight: '700' },
  tabIndicator: { position: 'absolute', bottom: 4, width: 33, height: 4, borderRadius: 3, backgroundColor: '#075CFF' },
  cartTab: { marginTop: -13 },
  cartTabIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#075CFF', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  cartTabIconActive: { backgroundColor: '#1746EA' },
  cartGlyph: { color: '#FFFFFF', fontSize: 23 },
  cartCountBadge: { position: 'absolute', top: -4, right: -4, minWidth: 22, height: 22, paddingHorizontal: 4, borderRadius: 12, backgroundColor: '#F52D4E', alignItems: 'center', justifyContent: 'center' },
  cartCountText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  secondaryPage: { minHeight: 500, paddingTop: 24 },
  pageTitle: { color: '#0B1D61', fontSize: 24, fontWeight: '800', marginBottom: 20 },
  cartLine: { minHeight: 86, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E9ECF7', paddingVertical: 8 },
  cartProductImage: { width: 64, height: 64 },
  cartLineCopy: { flex: 1, marginLeft: 10 },
  cartProductName: { color: '#0B1D61', fontWeight: '700' },
  cartProductPrice: { color: '#66769A', marginTop: 5 },
  subtotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 16 },
  subtotalLabel: { color: '#263867', fontSize: 14, fontWeight: '600' },
  subtotalAmount: { color: '#10245F', fontSize: 17, fontWeight: '800' },
  checkoutButton: { backgroundColor: '#075CFF', borderRadius: 24, alignItems: 'center', padding: 14, marginTop: 14 },
  checkoutText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  accountIntro: { color: '#647395', fontSize: 14 },
  signOutButton: { alignSelf: 'flex-start', borderColor: '#D5DFF5', borderWidth: 1, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 11, marginTop: 24 },
  signOutText: { color: '#1747A6', fontWeight: '700' },
  offerCard: { backgroundColor: '#0A5AFA', borderRadius: 24, padding: 22, marginBottom: 22 },
  offerHeadline: { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  offerDescription: { color: '#FFFFFF', fontSize: 14, marginTop: 4 },
  offerCode: { color: '#B6F4FF', fontSize: 15, fontWeight: '800', marginTop: 12 },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(9,20,60,0.35)', padding: 24 },
  addressModal: { width: '100%', borderRadius: 22, backgroundColor: '#FFFFFF', padding: 20 },
  addressModalTitle: { color: '#10245F', fontSize: 18, fontWeight: '800' },
  addressInput: { height: 48, borderColor: '#D5DDF2', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, marginTop: 16, color: '#10245F' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 18 },
  modalCancel: { paddingHorizontal: 14, paddingVertical: 10 },
  modalCancelText: { color: '#5A6789', fontWeight: '600' },
  modalSave: { backgroundColor: '#075CFF', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 10 },
  modalSaveText: { color: '#FFFFFF', fontWeight: '700' },
});

const categoryBackgrounds = [
  styles.categoryBlue,
  styles.categoryYellow,
  styles.categoryLavender,
  styles.categoryPink,
  styles.categoryMint,
];
