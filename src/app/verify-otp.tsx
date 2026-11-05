import AuthScreenLayout from '@/components/auth-screen-layout';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';

const OTP_LENGTH = 4;
const BRAND_BLUE = '#095BFA';
const BRAND_NAVY = '#0B1C58';
const BRAND_PURPLE = '#7040F5';

export default function VerifyOtpScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string | string[] }>();
  const email = Array.isArray(emailParam) ? emailParam[0] ?? '' : emailParam ?? '';
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(true);
  const [formMessage, setFormMessage] = useState('');
  const inputRefs = useRef<(TextInputInstance | null)[]>([]);

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
    if (!hasAcceptedTerms) {
      setFormMessage('Please agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    if (otp.some((digit) => !digit)) {
      setFormMessage('Enter the 4-digit code to continue.');
      return;
    }
    setFormMessage('OTP verification is not connected yet.');
  }

  return (
    <AuthScreenLayout
      panelTitle="Verify your email"
      panelSubtitle="Enter the 4-digit verification code"
    >
      <View style={styles.emailSummary}>
        <Text style={styles.emailText} numberOfLines={1}>{email}</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Change email address"
          hitSlop={8}
        >
          <Text style={styles.changeEmailText}>Change email</Text>
        </Pressable>
      </View>

      <View style={styles.otpRow}>
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

      <Pressable
        style={styles.termsRow}
        onPress={() => setHasAcceptedTerms((accepted) => !accepted)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: hasAcceptedTerms }}
        accessibilityLabel="Agree to the Terms and Conditions and Privacy Policy"
      >
        <View style={[styles.checkbox, hasAcceptedTerms && styles.checkboxChecked]}>
          {hasAcceptedTerms ? <Text style={styles.checkboxCheck}>✓</Text> : null}
        </View>
        <Text style={styles.termsText}>
          By logging in, I agree to our{' '}
          <Text style={styles.termsLink}>Terms &amp; Conditions</Text>
          {'\nand '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Pressable>

      {formMessage ? <Text accessibilityRole="alert" style={styles.formMessage}>{formMessage}</Text> : null}

      <Pressable
        style={styles.continueButton}
        onPress={handleVerify}
        accessibilityRole="button"
        accessibilityLabel="Verify OTP"
      >
        <LinearGradient
          colors={['#078BFA', '#3B5CFA', '#8A32F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueGradient}
        >
          <Text style={styles.continueText}>Verify OTP</Text>
          <Text style={styles.arrow}>→</Text>
        </LinearGradient>
      </Pressable>

    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  emailSummary: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DFE3F4',
    borderRadius: 14,
    paddingHorizontal: 13,
    marginBottom: 14,
  },
  emailText: {
    flex: 1,
    color: '#536087',
    fontSize: 13,
    marginRight: 8,
  },
  changeEmailText: {
    color: BRAND_BLUE,
    fontSize: 12,
    fontWeight: '700',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 2,
  },
  otpInput: {
    width: 52,
    height: 52,
    borderWidth: 1.3,
    borderColor: BRAND_PURPLE,
    borderRadius: 12,
    color: BRAND_NAVY,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
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
  arrow: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 28,
    marginTop: -3,
  },
});
