import { StatusBar } from 'expo-status-bar';
import { Image as ExpoImage } from 'expo-image';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps, ReactNode } from 'react';

type AuthScreenLayoutProps = {
  panelTitle: string;
  panelSubtitle: string;
  isKeyboardActive?: boolean;
  onTouchStart?: ComponentProps<typeof ScrollView>['onTouchStart'];
  centerArtwork?: ReactNode;
  children: ReactNode;
};

export default function AuthScreenLayout({
  panelTitle,
  panelSubtitle,
  isKeyboardActive,
  onTouchStart,
  centerArtwork,
  children,
}: AuthScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroHeight = isKeyboardActive
    ? Math.min(Math.max(height * 0.2, 140), 180)
    : Math.min(Math.max(height * 0.28, 150), 230);

  return (
    <View style={styles.root}>
      <ExpoImage
        source={require('../../assets/images/login-background-waves.png')}
        style={styles.backgroundImage}
        contentFit="cover"
        contentPosition="center"
        allowDownscaling={false}
        loading="eager"
        priority="high"
        transition={0}
        accessible={false}
        pointerEvents="none"
      />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            scrollEnabled={isKeyboardActive === undefined}
            onTouchStart={onTouchStart}
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
                {!isKeyboardActive ? (
                  <Text style={styles.subtitle}>
                    Get medicines, consult doctors{'\n'}
                    and more — all in one app.
                  </Text>
                ) : null}
              </View>
            </View>

            {centerArtwork && !isKeyboardActive ? (
              <View style={styles.centerArtwork}>{centerArtwork}</View>
            ) : null}

            <View style={[
              styles.panel,
              isKeyboardActive !== undefined && styles.bottomAnchoredPanel,
              {
                paddingTop: isKeyboardActive ? 8 : 12,
                paddingBottom:
                  isKeyboardActive === undefined
                    ? Math.max(insets.bottom, 18)
                    : isKeyboardActive
                      ? 12
                      : 19,
              },
            ]}>
              <View style={styles.panelHandle} />
              <Text style={styles.panelTitle}>{panelTitle}</Text>
              <Text style={styles.panelSubtitle}>{panelSubtitle}</Text>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F7FF',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
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
  centerArtwork: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  bottomAnchoredPanel: {
    flex: 0,
    marginTop: 'auto',
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
