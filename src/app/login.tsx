import AuthScreenLayout from '@/components/auth-screen-layout';
import { useAuth } from '@/context/auth-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import {
  ActivityIndicator,
  findNodeHandle,
  Keyboard,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type GestureResponderEvent,
  type TextInputInstance
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';


const BRAND_BLUE = '#095BFA';
const BRAND_PURPLE = '#7040F5';

function MailIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3.2" y="5.3" width="17.6" height="13.7" rx="2" stroke={BRAND_PURPLE} strokeWidth="2.2" />
      <Path d="m4.2 7 7.8 6.2L19.8 7" stroke={BRAND_PURPLE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ArrowIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h17M13 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function Field({
  children,
  inputRef,
  ...inputProps
}: ComponentProps<typeof TextInput> & {
  children: ReactNode;
  inputRef?: ComponentProps<typeof TextInput>['ref'];
}) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>{children}</View>
      <TextInput
        ref={inputRef}
        {...inputProps}
        placeholderTextColor="#7A84AF"
        style={styles.fieldInput}
      />
    </View>
  );
}

function TermsCheckbox({
  accepted,
  onToggle,
}: {
  accepted: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      style={styles.termsRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: accepted }}
      accessibilityLabel="Agree to the Terms and Conditions and Privacy Policy"
    >
      <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
        {accepted ? <Text style={styles.checkboxCheck}>✓</Text> : null}
      </View>
      <Text style={styles.termsText}>
        By logging in, I agree to our{' '}
        <Text style={styles.termsLink}>Terms &amp; Conditions</Text>
        {'\nand '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
    </Pressable>
  );
}

function PrimaryButton({
  label,
  isSubmitting,
  onPress,
}: {
  label: string;
  isSubmitting: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.continueButton, isSubmitting && styles.buttonDisabled]}
      disabled={isSubmitting}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
    >
      <LinearGradient
        colors={['#078BFA', '#3B5CFA', '#8A32F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.continueGradient}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.continueText}>{label}</Text>
            <ArrowIcon />
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export default function LoginScreen() {
  const { token, isLoading: isAuthLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);
  const inputRef = useRef<TextInputInstance>(null);

  useEffect(() => {
    if (!isAuthLoading && token) {
      router.replace('/');
    }
  }, [isAuthLoading, token]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsInputActive(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsInputActive(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function updateInputActive(active: boolean) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsInputActive(active);
  }

  function handleScreenTouch(event: GestureResponderEvent) {
    if (
      isInputActive &&
      inputRef.current &&
      findNodeHandle(inputRef.current) !== event.nativeEvent.target
    ) {
      Keyboard.dismiss();
    }
  }

  async function handleContinue() {
    if (isSubmitting) return;

    if (!hasAcceptedTerms) {
      setFormMessage('Please agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setFormMessage('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setFormMessage('');

    try {
      const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
      if (!baseUrl) {
        throw new Error('API_BASE_URL_MISSING');
      }
      await SecureStore.setItemAsync('email', normalizedEmail);
      const response = await fetch(`${baseUrl}/mobile/patient/auth/send-otp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        setFormMessage('Unable to send OTP. Please try again.');
        return;
      }

      router.push({ pathname: '/verify-otp', params: { email: normalizedEmail } });
    } catch {
      setFormMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreenLayout
      panelTitle="Login / Sign up"
      isKeyboardActive={isInputActive}
      onTouchStart={handleScreenTouch}
      panelSubtitle="Enter your email address to get started"
    >
      <Field
        inputRef={inputRef}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email address"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={true}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="go"
        onFocus={() => updateInputActive(true)}
        onBlur={() => updateInputActive(false)}
        onSubmitEditing={handleContinue}
        accessibilityLabel="Email address"
      >
        <MailIcon />
      </Field>

      <TermsCheckbox
        accepted={hasAcceptedTerms}
        onToggle={() => setHasAcceptedTerms((accepted) => !accepted)}
      />
      {formMessage ? <Text accessibilityRole="alert" style={styles.formMessage}>{formMessage}</Text> : null}
      <PrimaryButton
        label="Continue"
        isSubmitting={isSubmitting}
        onPress={handleContinue}
      />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 46,
    borderWidth: 1.3,
    borderColor: BRAND_PURPLE,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fieldIcon: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fieldInput: {
    flex: 1,
    color: '#29386D',
    fontSize: 14,
    paddingVertical: 9,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    minHeight: 34,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 1.5,
    borderColor: '#A8B2D3',
    borderRadius: 4,
    marginTop: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: BRAND_BLUE,
    borderColor: BRAND_BLUE,
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
  },
  termsText: {
    flex: 1,
    color: '#67739F',
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '500',
  },
  termsLink: {
    color: BRAND_BLUE,
    textDecorationLine: 'underline',
  },
  formMessage: {
    color: '#B4233B',
    fontSize: 11.5,
    lineHeight: 15,
    marginTop: 6,
  },
  continueButton: {
    height: 50,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 12,
    shadowColor: '#4937CE',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  continueGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
