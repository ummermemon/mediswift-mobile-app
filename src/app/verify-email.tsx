import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/components/shop-ui';

export default function VerifyEmailScreen() {
  const { email, verified } = useLocalSearchParams<{
    email?: string;
    verified?: string | string[];
  }>();
  const isVerified = Array.isArray(verified) ? verified.includes('1') : verified === '1';

  useEffect(() => {
    if (isVerified) {
      router.replace('/');
    }
  }, [isVerified]);

  if (isVerified) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back to registration"
            style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Image
            source={require('../../assets/images/mediswift-full-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="MediSwift"
          />
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.message}>
          <View style={styles.mailIcon}>
            <Text style={styles.mailIconText}>@</Text>
          </View>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.description}>
            We sent you an email{email ? ' to' : ''}{' '}
            {email ? <Text style={styles.email}>{email}</Text> : 'with a verification link'}.
            {'\n'}Open it and tap the button to verify your email address.
          </Text>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              If you don’t see the email, check your spam or junk folder.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EBF0',
    backgroundColor: palette.white,
  },
  backArrow: {
    color: palette.navy,
    fontSize: 30,
    lineHeight: 34,
    marginTop: -4,
  },
  logo: {
    width: 142,
    height: 38,
  },
  headerSpacer: {
    width: 40,
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 56,
  },
  mailIcon: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#E2F7F7',
    marginBottom: 25,
  },
  mailIconText: {
    color: palette.teal,
    fontSize: 34,
    fontWeight: '700',
  },
  title: {
    color: palette.navy,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  description: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
  },
  email: {
    color: palette.navy,
    fontWeight: '700',
  },
  tip: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: palette.white,
  },
  tipText: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
