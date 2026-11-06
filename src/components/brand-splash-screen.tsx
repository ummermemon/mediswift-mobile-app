import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrandSplashScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.topAccent} />
        <View style={styles.bottomAccent} />

        <View style={styles.brand}>
          <Image
            source={require('../../assets/images/mediswift-logo-transparent.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="MediSwift"
          />
          <Text style={styles.tagline}>Healthcare, delivered in a flash.</Text>
        </View>

        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#095BFA" />
          <Text style={styles.loadingText}>Getting things ready</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
  },
  topAccent: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEF3FF',
    top: -168,
    right: -112,
  },
  bottomAccent: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#F0EDFF',
    bottom: -132,
    left: -102,
  },
  brand: {
    alignItems: 'center',
    marginTop: -18,
  },
  logo: {
    width: 360,
    height: 180,
    maxWidth: '100%',
  },
  tagline: {
    color: '#66708C',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: -8,
  },
  loading: {
    position: 'absolute',
    bottom: 42,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#8891A8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
