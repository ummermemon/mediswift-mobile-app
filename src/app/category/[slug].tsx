import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageShell, PageTitle, ProductCard, SectionTitle, palette } from '@/components/shop-ui';
import { categories, products } from '@/data/shop';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = categories.find((item) => item.slug === slug);
  const [subcategorySelection, setSubcategorySelection] = useState({ slug: '', name: 'All' });
  const selectedSubcategory = subcategorySelection.slug === slug ? subcategorySelection.name : 'All';

  const categoryProducts = useMemo(() => {
    if (!category) {
      return [];
    }
    return products.filter(
      (product) =>
        product.category === category.name &&
        (selectedSubcategory === 'All' || product.subcategory === selectedSubcategory),
    );
  }, [category, selectedSubcategory]);

  if (!category) {
    return (
      <PageShell>
        <PageTitle title="Category not found" subtitle="Choose a category to explore." />
        <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to home</Text>
        </Pressable>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <View style={styles.categoryHero}>
        <Image source={category.image} style={styles.categoryImage} />
        <View style={styles.categoryCopy}>
          <Text style={styles.categoryEyebrow}>SHOP CATEGORY</Text>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categorySubtitle}>Explore trusted everyday essentials.</Text>
        </View>
      </View>

      <SectionTitle title="Shop by subcategory" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {['All', ...category.subcategories].map((subcategory) => {
          const active = selectedSubcategory === subcategory;
          return (
            <Pressable
              key={subcategory}
              onPress={() => setSubcategorySelection({ slug, name: subcategory })}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{subcategory}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionTitle title={`${category.name} essentials`} />
      {categoryProducts.length > 0 ? (
        <View style={styles.products}>
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyCopy}>More products are coming soon.</Text>
        </View>
      )}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  categoryHero: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#EAF8F8',
    marginTop: 2,
  },
  categoryImage: {
    width: 76,
    height: 76,
    borderRadius: 19,
  },
  categoryCopy: {
    flex: 1,
    marginLeft: 13,
  },
  categoryEyebrow: {
    color: palette.teal,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  categoryTitle: {
    color: palette.navy,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 4,
  },
  categorySubtitle: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 3,
  },
  chipRow: {
    gap: 8,
    paddingBottom: 2,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE8EE',
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: palette.white,
  },
  chipActive: {
    backgroundColor: palette.navy,
    borderColor: palette.navy,
  },
  chipText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: palette.white,
  },
  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  emptyState: {
    paddingVertical: 26,
    alignItems: 'center',
  },
  emptyCopy: {
    color: palette.muted,
    fontSize: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: palette.teal,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: {
    color: palette.white,
    fontWeight: '700',
  },
});
