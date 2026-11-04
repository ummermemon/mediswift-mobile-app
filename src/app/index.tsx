import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageShell, ProductCard, SectionTitle, palette } from '@/components/shop-ui';
import { categories, products } from '@/data/shop';

export default function HomeScreen() {
  return (
    <PageShell>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.headline}>Medicines</Text>
          <Text style={styles.headline}>Delivered</Text>
          <Text style={styles.headlineAccent}>in Minutes</Text>
          <View style={styles.headlineUnderline} />
          <Text style={styles.heroDescription}>Upload prescription or{'\n'}shop directly</Text>
        </View>
        <Image
          source={require('../../assets/images/mediswift-hero-upload.png')}
          style={styles.heroArt}
          resizeMode="contain"
          accessibilityLabel="MediSwift medicine and prescription"
        />
      </View>

      <Pressable
        onPress={() => router.push('/search')}
        accessibilityRole="button"
        accessibilityLabel="Upload Prescription — Get your medicines quickly"
        style={styles.uploadCard}>
        <View style={styles.uploadIllustration}>
          <View style={styles.prescriptionPage}>
            <View style={styles.pageFold} />
            <Text style={styles.rxText}>Rx</Text>
          </View>
          <View style={styles.uploadArrow}>
            <Text style={styles.uploadArrowText}>↑</Text>
          </View>
        </View>
        <View style={styles.uploadCopy}>
          <Text style={styles.uploadTitle}>Upload Prescription</Text>
          <Text style={styles.uploadDescription}>Get your medicines quickly</Text>
        </View>
        <View style={styles.cardArrow}>
          <Text style={styles.cardArrowText}>→</Text>
        </View>
      </Pressable>

      <SectionTitle title="Shop by Category" action="See All" onAction={() => router.push('/search')} />
      <View style={styles.categoryRow}>
        {categories.map((category) => (
          <Pressable
            key={category.slug}
            onPress={() =>
              router.push({ pathname: '/category/[slug]', params: { slug: category.slug } })
            }
            accessibilityRole="button"
            style={styles.category}>
            <Image source={category.image} style={styles.categoryImage} />
            <Text numberOfLines={1} style={styles.categoryName}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.promoCard}>
        <View style={styles.promoCopy}>
          <Text style={styles.promoTitle}>Healthcare</Text>
          <Text style={styles.promoTitle}>at Your Doorstep</Text>
          <Text style={styles.promoDescription}>Fast. Reliable. Convenient.</Text>
          <Pressable
            onPress={() => router.push('/search')}
            accessibilityRole="button"
            style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop Now</Text>
            <Text style={styles.shopButtonArrow}>→</Text>
          </Pressable>
        </View>
        <Image
          source={require('../../assets/images/medi-delivery-art.png')}
          style={styles.deliveryArt}
          resizeMode="contain"
          accessibilityLabel="MediSwift courier delivering healthcare"
        />
      </View>

      <SectionTitle title="Popular essentials" action="View all" onAction={() => router.push('/search')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productRow}>
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 167,
    marginTop: 16,
    position: 'relative',
  },
  heroCopy: {
    zIndex: 1,
    alignSelf: 'flex-start',
  },
  headline: {
    color: palette.navy,
    fontSize: 33,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -1.1,
  },
  headlineAccent: {
    color: palette.teal,
    fontSize: 33,
    lineHeight: 36,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: -1.2,
  },
  headlineUnderline: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.teal,
    marginLeft: 106,
    marginTop: -1,
  },
  heroDescription: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  heroArt: {
    position: 'absolute',
    top: -50,
    right: -20,
    width: 168,
    height: 204,
  },
  uploadCard: {
    minHeight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9FE5EC',
    borderRadius: 17,
    backgroundColor: '#F5FCFD',
  },
  uploadIllustration: {
    width: 89,
    height: 83,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF8F9',
  },
  prescriptionPage: {
    width: 30,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.navy,
    borderRadius: 4,
    backgroundColor: '#F7FCFD',
  },
  pageFold: {
    position: 'absolute',
    right: -1,
    top: -1,
    width: 11,
    height: 11,
    backgroundColor: '#EAF8F9',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: palette.navy,
  },
  rxText: {
    color: palette.navy,
    fontSize: 20,
    fontWeight: '500',
    marginTop: 5,
  },
  uploadArrow: {
    position: 'absolute',
    right: 12,
    bottom: 13,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: palette.teal,
  },
  uploadArrowText: {
    color: palette.white,
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 23,
  },
  uploadCopy: {
    flex: 1,
    paddingLeft: 15,
  },
  uploadTitle: {
    color: palette.navy,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  uploadDescription: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 4,
  },
  cardArrow: {
    width: 28,
    height: 28,
    borderRadius: 15,
    marginHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.navy,
  },
  cardArrowText: {
    color: palette.white,
    fontSize: 20,
    lineHeight: 22,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    width: '18%',
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 17,
  },
  categoryName: {
    color: palette.navy,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 6,
  },
  promoCard: {
    height: 140,
    overflow: 'hidden',
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 19,
    backgroundColor: '#DDF5F4',
    marginTop: 22,
  },
  promoCopy: {
    paddingLeft: 18,
    paddingTop: 18,
    zIndex: 1,
  },
  promoTitle: {
    color: palette.navy,
    fontSize: 21,
    lineHeight: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  promoDescription: {
    color: '#496684',
    fontSize: 12,
    marginTop: 7,
  },
  shopButton: {
    height: 27,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 15,
    backgroundColor: palette.navy,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  shopButtonText: {
    color: palette.white,
    fontSize: 11,
    fontWeight: '700',
  },
  shopButtonArrow: {
    color: palette.white,
    fontSize: 16,
    marginLeft: 6,
  },
  deliveryArt: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 155,
    height: 135,
  },
  productRow: {
    gap: 12,
    paddingBottom: 8,
  },
});
