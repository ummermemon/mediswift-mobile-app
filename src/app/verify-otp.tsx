import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Image as ExpoImage } from 'expo-image';
import {
  Keyboard,
  KeyboardAvoidingView,
  ImageBackground,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  findNodeHandle,
  type TextInputInstance,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const OTP_LENGTH = 4;
const OTP_EXPIRY_SECONDS = 5 * 60;
const BRAND_NAVY = '#0B1C58';
const BRAND_PURPLE = '#7040F5';

export default function VerifyOtpScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string | string[] }>();
  const email = Array.isArray(emailParam) ? emailParam[0] ?? '' : emailParam ?? '';
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const [formMessage, setFormMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRefs = useRef<(TextInputInstance | null)[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const heroHeight = keyboardVisible ? 0 : Math.min(Math.max(height * 0.35, 270), 305);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardVisible(false);
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: true }));
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  function handleOtpChange(value: string, index: number) {
    const digits = value.replace(/\D/g, '');

    if (digits.length > 1) {
      const pastedDigits = digits.slice(0, OTP_LENGTH).split('');
      setOtp(Array.from({ length: OTP_LENGTH }, (_, digitIndex) => pastedDigits[digitIndex] ?? ''));
      if (pastedDigits.length === OTP_LENGTH) {
        return;
      }
      const nextIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);
      TextInput.State.focusTextInput(inputRefs.current[nextIndex]?.getNativeRef());
      return;
    }

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      nextOtp[index] = digits;
      return nextOtp;
    });

    if (digits && index < OTP_LENGTH - 1) {
      TextInput.State.focusTextInput(inputRefs.current[index + 1]?.getNativeRef());
    }
  }

  function handleVerify() {
    if (otp.some((digit) => !digit)) {
      setFormMessage('Enter the 4-digit code to continue.');
      return;
    }
    setFormMessage('OTP verification is not connected yet.');
  }

  function handleResend() {
    setFormMessage('OTP resend is not connected yet.');
  }

  function handleScreenTouch(event: { nativeEvent: { target: number } }) {
    if (!keyboardVisible) {
      return;
    }

    const touchedOtpInput = inputRefs.current.some(
      (input) => input !== null && findNodeHandle(input) === event.nativeEvent.target,
    );
    if (!touchedOtpInput) {
      Keyboard.dismiss();
    }
  }

  const formattedExpiry = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.stickyHeader}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={8}
            >
              <Text style={styles.backChevron}>‹</Text>
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
          </View>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            onTouchStart={handleScreenTouch}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={[styles.hero, { height: heroHeight }]}>
              {!keyboardVisible ? (
                <>
                  <View style={styles.logoFrame}>
                    <ExpoImage
                      source={require('../../assets/images/mediswift-logo-transparent.png')}
                      style={styles.logo}
                      contentFit="contain"
                      loading="eager"
                      priority="high"
                      transition={0}
                      accessibilityLabel="MediSwift"
                    />
                  </View>
                  <View style={styles.heroCopy}>
                    <Text style={styles.heroTitle}>
                      Your Health,{'\n'}
                      <Text style={styles.heroTitleAccent}>Our Priority</Text>
                    </Text>
                    <Text style={styles.heroSubtitle}>
                      Get medicines, consult doctors{'\n'}
                      and more — all in one app.
                    </Text>
                  </View>
                </>
              ) : null}
            </View>

            <View style={[
              styles.panel,
              {
                paddingTop: keyboardVisible ? 8 : 12,
                paddingBottom: keyboardVisible ? 16 : Math.max(insets.bottom, 40),
              },
            ]}>
              <ExpoImage
                source={require('../../assets/images/email-verification-icon.png')}
                style={styles.verificationIcon}
                contentFit="contain"
                loading="eager"
                priority="high"
                transition={0}
                accessibilityLabel="Secure email verification"
              />

              <Text style={styles.title}>
                Verify Your <Text style={styles.titleAccent}>Email</Text>
              </Text>
              <Text style={styles.subtitle}>We’ve sent a 4-digit OTP to</Text>
              <Text style={styles.emailText} numberOfLines={1}>{email}</Text>

              <View style={[styles.otpRow, keyboardVisible && styles.otpRowCompact]}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(input) => {
                      inputRefs.current[index] = input;
                    }}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                        TextInput.State.focusTextInput(inputRefs.current[index - 1]?.getNativeRef());
                      }
                    }}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    autoFocus={index === 0}
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                    maxLength={OTP_LENGTH}
                    selectTextOnFocus
                    accessibilityLabel={`Verification code digit ${index + 1}`}
                  />
                ))}
              </View>

              <View
                style={[styles.expiryRow, keyboardVisible && styles.expiryRowCompact]}
                accessibilityLabel={`OTP will expire in ${formattedExpiry}`}
              >
                <View style={styles.clockIcon}>
                  <View style={styles.clockHandVertical} />
                  <View style={styles.clockHandHorizontal} />
                </View>
                <Text style={styles.expiryText}>OTP will expire in </Text>
                <Text style={styles.expiryTime}>{formattedExpiry}</Text>
              </View>

              {formMessage ? <Text accessibilityRole="alert" style={styles.formMessage}>{formMessage}</Text> : null}

              <Pressable
                style={[styles.verifyButton, keyboardVisible && styles.verifyButtonCompact]}
                onPress={handleVerify}
                accessibilityRole="button"
                accessibilityLabel="Verify OTP"
              >
                <LinearGradient
                  colors={['#168BFA', '#3B5CFA', '#8A32F5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verifyGradient}
                >
                  <Text style={styles.verifyText}>Verify OTP</Text>
                  <Text style={styles.arrow}>→</Text>
                </LinearGradient>
              </Pressable>

              <View style={[styles.resendRow, keyboardVisible && styles.resendRowCompact]}>
                <Text style={styles.resendHint}>Didn’t receive the code? </Text>
                <Pressable
                  onPress={handleResend}
                  accessibilityRole="button"
                  accessibilityLabel="Resend OTP"
                  hitSlop={8}
                >
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </Pressable>
              </View>
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
  stickyHeader: {
    height: 46,
    flexShrink: 0,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  heroTitle: {
    color: BRAND_NAVY,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  heroTitleAccent: {
    color: BRAND_PURPLE,
  },
  heroSubtitle: {
    color: '#68739E',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '500',
    marginTop: 5,
  },
  backButton: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backChevron: {
    color: '#5639F5',
    fontSize: 30,
    lineHeight: 34,
    marginRight: 5,
    marginTop: -3,
  },
  backLabel: {
    color: '#5639F5',
    fontSize: 14,
    fontWeight: '600',
  },
  panel: {
    flexGrow: 1,
    paddingTop: 12,
    paddingHorizontal: 21,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  verificationIcon: {
    width: 144,
    height: 108,
    marginTop: 0,
  },
  title: {
    color: BRAND_NAVY,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.55,
    textAlign: 'center',
    marginTop: 2,
  },
  titleAccent: {
    color: BRAND_PURPLE,
  },
  subtitle: {
    color: '#737DA7',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
  emailText: {
    maxWidth: '100%',
    color: BRAND_NAVY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 22,
  },
  otpRowCompact: {
    marginTop: 14,
  },
  otpInput: {
    flex: 1,
    maxWidth: 54,
    minWidth: 0,
    height: 52,
    borderWidth: 1.3,
    borderColor: '#B9B7FF',
    borderRadius: 14,
    color: BRAND_NAVY,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '700',
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  expiryRowCompact: {
    marginTop: 12,
  },
  clockIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: BRAND_PURPLE,
    marginRight: 8,
  },
  clockHandVertical: {
    position: 'absolute',
    width: 1.5,
    height: 6,
    top: 2,
    left: 7,
    borderRadius: 1,
    backgroundColor: BRAND_PURPLE,
  },
  clockHandHorizontal: {
    position: 'absolute',
    width: 5,
    height: 1.5,
    top: 8,
    left: 8,
    borderRadius: 1,
    backgroundColor: BRAND_PURPLE,
    transform: [{ rotate: '25deg' }],
  },
  expiryText: {
    color: '#737DA7',
    fontSize: 13,
    fontWeight: '500',
  },
  expiryTime: {
    color: BRAND_PURPLE,
    fontSize: 14,
    fontWeight: '800',
  },
  formMessage: {
    color: '#B4233B',
    fontSize: 11.5,
    lineHeight: 15,
    textAlign: 'center',
    marginTop: 8,
  },
  verifyButton: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#4937CE',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  verifyButtonCompact: {
    height: 46,
    marginTop: 12,
  },
  verifyGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  verifyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 27,
    marginTop: -2,
  },
  resendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  resendRowCompact: {
    marginTop: 10,
  },
  resendHint: {
    color: '#737DA7',
    fontSize: 12.5,
    fontWeight: '500',
  },
  resendLink: {
    color: BRAND_PURPLE,
    fontSize: 12.5,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
