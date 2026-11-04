import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PageShell, PageTitle, palette } from '@/components/shop-ui';

const accountOptions = ['Personal information', 'Saved addresses', 'Prescriptions', 'Help & support'];

export default function AccountScreen() {
  return (
    <PageShell>
      <PageTitle title="Your account" subtitle="Manage your MediSwift details and preferences." />
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <View>
          <Text style={styles.profileName}>Welcome to MediSwift</Text>
          <Text style={styles.profileHint}>Sign in to manage your account</Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push('/register')}
        accessibilityRole="button"
        style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Create an account</Text>
        <Text style={styles.registerButtonArrow}>→</Text>
      </Pressable>
      <View style={styles.options}>
        {accountOptions.map((option) => (
          <Pressable key={option} style={styles.option} accessibilityRole="button">
            <Text style={styles.optionText}>{option}</Text>
            <Text style={styles.optionArrow}>›</Text>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => router.push('/orders')} style={styles.ordersButton}>
        <Text style={styles.ordersButtonText}>View your orders</Text>
      </Pressable>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 17,
    backgroundColor: '#EAF8F8',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.white,
    marginRight: 12,
  },
  avatarText: {
    color: palette.teal,
    fontSize: 21,
    fontWeight: '800',
  },
  profileName: {
    color: palette.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  profileHint: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 4,
  },
  registerButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    borderRadius: 13,
    backgroundColor: palette.navy,
    marginTop: 13,
  },
  registerButtonText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '700',
  },
  registerButtonArrow: {
    color: palette.white,
    fontSize: 17,
    marginLeft: 8,
  },
  options: {
    marginTop: 17,
    borderRadius: 15,
    paddingHorizontal: 14,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#E6EDF2',
  },
  option: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6EDF2',
  },
  optionText: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '600',
  },
  optionArrow: {
    color: palette.muted,
    fontSize: 21,
  },
  ordersButton: {
    alignSelf: 'flex-start',
    marginTop: 17,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: palette.navy,
  },
  ordersButtonText: {
    color: palette.white,
    fontSize: 11,
    fontWeight: '700',
  },
});
