import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PageShell, PageTitle, ProductCard, SectionTitle, palette } from '@/components/shop-ui';
import { categories, products } from '@/data/shop';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return products;
    }
    return products.filter((product) =>
      [product.name, product.category, product.subcategory, product.description]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  return (
    <PageShell>
      <PageTitle title="Search" subtitle="Find medicines and everyday wellness essentials." />
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search medicines, vitamins..."
          placeholderTextColor="#97A5B6"
          style={styles.searchInput}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel="Search products"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} accessibilityRole="button">
            <Text style={styles.clearButton}>×</Text>
          </Pressable>
        )}
      </View>

      <SectionTitle title={query ? `${results.length} results` : 'Browse categories'} />
      {!query && (
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.slug}
              onPress={() =>
                router.push({ pathname: '/category/[slug]', params: { slug: category.slug } })
              }
              accessibilityRole="button"
              style={styles.categoryCard}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.subcategories.length} collections</Text>
              <Text style={styles.categoryArrow}>→</Text>
            </Pressable>
          ))}
        </View>
      )}

      {results.length > 0 ? (
        <View style={styles.results}>
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⌕</Text>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptyCopy}>Try another product or category name.</Text>
        </View>
      )}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EBF1',
    backgroundColor: palette.white,
  },
  searchIcon: {
    color: palette.teal,
    fontSize: 26,
    lineHeight: 30,
    marginRight: 9,
  },
  searchInput: {
    flex: 1,
    color: palette.navy,
    fontSize: 13,
  },
  clearButton: {
    color: palette.muted,
    fontSize: 22,
    paddingHorizontal: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    minHeight: 82,
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderRadius: 15,
    backgroundColor: '#F0FAFA',
  },
  categoryName: {
    color: palette.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  categoryCount: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
  },
  categoryArrow: {
    position: 'absolute',
    right: 12,
    top: 26,
    color: palette.teal,
    fontSize: 17,
  },
  results: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 42,
  },
  emptyIcon: {
    color: '#91DADD',
    fontSize: 38,
  },
  emptyTitle: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyCopy: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 5,
  },
});
