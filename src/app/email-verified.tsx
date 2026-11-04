import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/components/shop-ui';

export default function EmailVerifiedScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check authentication before navigating in production.
      router.replace('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Email Verified!</Text>

      <Text style={styles.description}>
        Your email address has been successfully verified.
      </Text>

      <ActivityIndicator
        color={palette.teal}
        size="large"
        style={{ marginTop: 25 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: '#E2F7F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: palette.teal,
    fontSize: 42,
    fontWeight: '800',
  },
  title: {
    color: palette.navy,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 24,
  },
  description: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});