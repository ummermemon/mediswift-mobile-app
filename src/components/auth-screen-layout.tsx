import { StatusBar } from 'expo-status-bar';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

type AuthScreenLayoutProps = {
  panelTitle: string;
  panelSubtitle: string;
  children: ReactNode;
};

export default function AuthScreenLayout({
  panelTitle,
  panelSubtitle,
  children,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = Math.min(Math.max(height * 0.35, 270), 305);

  return (
    <ImageBackground
      source={require('../../assets/images/login-background-waves.png')}
      style={styles.root}
      resizeMode="cover"
    >
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.hero, { height: heroHeight }]}>
              <View style={styles.logoFrame}>
                <Image
                  source={require('../../assets/images/mediswift-logo-transparent.png')}
                  style={styles.logo}
                  resizeMode="contain"
                  accessibilityLabel="MediSwift"
                />
              </View>
              <View style={styles.heroCopy}>
                <Text style={styles.title}>
                  Your Health,{'\n'}
                  <Text style={styles.titleAccent}>Our Priority</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Get medicines, consult doctors{'\n'}
                  and more — all in one app.
                </Text>
              </View>
            </View>

            <View style={[styles.panel, { paddingBottom: Math.max(insets.bottom, 18) }]}>
              <View style={styles.panelHandle} />
              <Text style={styles.panelTitle}>{panelTitle}</Text>
              <Text style={styles.panelSubtitle}>{panelSubtitle}</Text>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F7FF',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 28,
    justifyContent: 'center',
  },
  logoFrame: {
    width: 192,
    height: 52,
    overflow: 'hidden',
  },
  logo: {
    position: 'absolute',
    width: 390,
    height: 147,
    left: -98,
    top: -44,
  },
  heroCopy: {
    marginTop: 16,
    maxWidth: 260,
  },
  title: {
    color: '#0B1C58',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  titleAccent: {
    color: '#7040F5',
  },
  subtitle: {
    color: '#68739E',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
    marginTop: 5,
  },
  panel: {
    flex: 1,
    paddingTop: 13,
    paddingHorizontal: 21,
    paddingBottom: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  panelHandle: {
    width: 34,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EDF0FA',
    alignSelf: 'center',
    marginBottom: 11,
  },
  panelTitle: {
    color: '#0B1C58',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.55,
  },
  panelSubtitle: {
    color: '#737DA7',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    marginTop: 3,
    marginBottom: 13,
  },
});
