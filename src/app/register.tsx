import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { palette } from '@/components/shop-ui';

export default function RegisterScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [submissionSucceeded, setSubmissionSucceeded] = useState(false);

  async function handleSubmit() {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_URL}/mobile/customer/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      }
    );

    const data = await response.json();

    
    if (response.ok) {
      alert("Registration successful!");
    } else {
      alert('Something went wrong. Please try again later.');
    }

  } catch (error) {
    // console.error("Registration error:", error);
  }
}

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
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

          <View style={styles.intro}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>YOUR HEALTH, MADE EASIER</Text>
            </View>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Join MediSwift for convenient care and{'\n'}health essentials, delivered.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="e.g. Alex"
                placeholderTextColor="#9AA8B8"
                style={styles.input}
                autoCapitalize="words"
                autoComplete="given-name"
                accessibilityLabel="First name"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="e.g. Morgan"
                placeholderTextColor="#9AA8B8"
                style={styles.input}
                autoCapitalize="words"
                autoComplete="family-name"
                accessibilityLabel="Last name"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9AA8B8"
                style={styles.input}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                accessibilityLabel="Email address"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor="#9AA8B8"
                  style={styles.passwordTextInput}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  secureTextEntry={!passwordVisible}
                  accessibilityLabel="Password"
                />
                <Pressable
                  onPress={() => setPasswordVisible((visible) => !visible)}
                  accessibilityRole="button"
                  accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                  style={styles.passwordToggle}>
                  <Text style={styles.passwordToggleText}>
                    {passwordVisible ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.passwordHint}>Use at least 8 characters.</Text>
            </View>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
            accessibilityLabel="Create account"
            style={[styles.createButton, isSubmitting && styles.createButtonDisabled]}>
            {isSubmitting ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <>
                <Text style={styles.createButtonText}>Create account</Text>
                <Text style={styles.createButtonArrow}>→</Text>
              </>
            )}
          </Pressable>

          {formMessage ? (
            <Text
              accessibilityRole="alert"
              style={[
                styles.formMessage,
                submissionSucceeded ? styles.successMessage : styles.errorMessage,
              ]}>
              {formMessage}
            </Text>
          ) : null}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign up with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
              style={styles.socialButton}>
              <Text style={styles.googleMark}>G</Text>
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              style={styles.socialButton}>
              <View style={styles.appleMark}>
                <View style={styles.appleLeaf} />
              </View>
              <Text style={styles.socialButtonText}>Apple</Text>
            </Pressable>
          </View>

          <Text style={styles.terms}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <View style={styles.signInPrompt}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <Pressable accessibilityRole="button">
              <Text style={styles.signInLink}> Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
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
  intro: {
    marginTop: 23,
    marginBottom: 23,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.teal,
    marginRight: 7,
  },
  eyebrowText: {
    color: palette.teal,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  title: {
    color: palette.navy,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 7,
  },
  label: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 49,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E1E9EF',
    borderRadius: 13,
    backgroundColor: palette.white,
    color: palette.navy,
    fontSize: 13,
  },
  passwordInput: {
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: '#E1E9EF',
    borderRadius: 13,
    backgroundColor: palette.white,
  },
  passwordTextInput: {
    flex: 1,
    color: palette.navy,
    fontSize: 13,
  },
  passwordToggle: {
    paddingVertical: 8,
    paddingLeft: 10,
  },
  passwordToggleText: {
    color: palette.teal,
    fontSize: 12,
    fontWeight: '700',
  },
  passwordHint: {
    color: '#8190A1',
    fontSize: 10,
    marginTop: -2,
  },
  createButton: {
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: palette.navy,
    marginTop: 19,
    shadowColor: palette.navy,
    shadowOpacity: 0.16,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: '800',
  },
  createButtonArrow: {
    color: palette.white,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  formMessage: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  successMessage: {
    color: '#16845B',
  },
  errorMessage: {
    color: '#C23B42',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DDE6ED',
  },
  dividerText: {
    color: '#8290A0',
    fontSize: 11,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 11,
    marginTop: 15,
  },
  socialButton: {
    height: 47,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: '#E1E9EF',
    borderRadius: 13,
    backgroundColor: palette.white,
  },
  googleMark: {
    color: '#4285F4',
    fontSize: 17,
    fontWeight: '800',
  },
  appleMark: {
    width: 14,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#15191F',
  },
  appleLeaf: {
    position: 'absolute',
    width: 5,
    height: 3,
    top: -3,
    right: 1,
    borderRadius: 2,
    backgroundColor: '#15191F',
    transform: [{ rotate: '-35deg' }],
  },
  socialButtonText: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: '700',
  },
  terms: {
    color: '#8996A5',
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 17,
  },
  termsLink: {
    color: palette.muted,
    fontWeight: '700',
  },
  signInPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  signInText: {
    color: palette.muted,
    fontSize: 12,
  },
  signInLink: {
    color: palette.teal,
    fontSize: 12,
    fontWeight: '800',
  },
});
