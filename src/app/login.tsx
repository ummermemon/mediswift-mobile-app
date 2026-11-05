import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, type ComponentProps, type ReactNode } from 'react';
import {
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
import Svg, {
    Circle,
    Path,
    Rect,
} from 'react-native-svg';

const BRAND_BLUE = '#095BFA';
const BRAND_NAVY = '#0B126B';

function MailIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3.2" y="5.3" width="17.6" height="13.7" rx="2" stroke={BRAND_BLUE} strokeWidth="2.2" />
      <Path d="m4.2 7 7.8 6.2L19.8 7" stroke={BRAND_BLUE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="4.3" y="10" width="15.4" height="10" rx="1.7" stroke={BRAND_BLUE} strokeWidth="2.2" />
      <Path d="M8 10V7.4a4 4 0 0 1 8 0V10" stroke={BRAND_BLUE} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function EyeOffIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2.5 12S5.9 6.7 12 6.7c1.4 0 2.7.3 3.8.9M21.5 12S18.1 17.3 12 17.3c-1.2 0-2.3-.2-3.3-.7" stroke="#8C94C6" strokeWidth="2.1" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2.8" stroke="#8C94C6" strokeWidth="2.1" />
      <Path d="M3.2 3.3 20.8 20.7" stroke="#8C94C6" strokeWidth="2.3" strokeLinecap="round" />
    </Svg>
  );
}

function EyeIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2.5 12S5.9 6.7 12 6.7 21.5 12 21.5 12 18.1 17.3 12 17.3 2.5 12 2.5 12Z"
        stroke="#8C94C6"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="2.8" stroke="#8C94C6" strokeWidth="2.1" />
    </Svg>
  );
}

function ArrowIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12h17M13 5l7 7-7 7" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.7 4.7 0 0 1-2 3v2.5h3.3c1.9-1.8 2.9-4.3 2.9-7.3Z" />
      <Path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.7-2.5l-3.3-2.5c-.9.6-2.1 1-3.4 1a6 6 0 0 1-5.6-4.2H3v2.6A10 10 0 0 0 12 22Z" />
      <Path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.7V7.5H3A10 10 0 0 0 3 16.4l3.4-2.6Z" />
      <Path fill="#EA4335" d="M12 6a5.5 5.5 0 0 1 3.9 1.5l2.9-2.9A10 10 0 0 0 3 7.5l3.4 2.6A6 6 0 0 1 12 6Z" />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={20} height={23} viewBox="0 0 24 24">
      <Path d="M16.7 12.6c0-2.6 2.2-3.9 2.3-4-1.2-1.8-3.2-2-3.9-2.1-1.7-.2-3.3 1-4.1 1s-2.1-1-3.4-1c-1.8 0-3.4 1-4.3 2.6-1.8 3.1-.5 7.8 1.3 10.4.9 1.3 1.9 2.8 3.2 2.7 1.3-.1 1.8-.8 3.3-.8 1.5 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.5-3 1.5-3.1-.1 0-2.5-1-2.5-3.9ZM14 4.8c.7-.9 1.2-2.1 1.1-3.3-1.1 0-2.3.7-3.1 1.6-.7.8-1.3 2-1.2 3.2 1.2.1 2.5-.6 3.2-1.5Z" />
    </Svg>
  );
}

function BackgroundArt() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#11AFF5', '#095BFA', '#812AFC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topOrb} />
      <View style={styles.topOrbInner} />
      <View style={styles.bottomWaveOne} />
      <View style={styles.bottomWaveTwo} />
    </View>
  );
}

function Field({ children, right, ...inputProps }: ComponentProps<typeof TextInput> & { children: ReactNode; right?: ReactNode }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>{children}</View>
      <View style={styles.fieldDivider} />
      <TextInput {...inputProps} placeholderTextColor="#747DB8" style={styles.fieldInput} />
      {right ? <View style={styles.fieldRight}>{right}</View> : null}
    </View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <BackgroundArt />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.logoFrame}>
              <Image source={require('../../assets/images/mediswift-logo-transparent.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="MediSwift" />
            </View>

            <View style={styles.heroCopy}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue your{`\n`}quick medicine delivery</Text>
              <LinearGradient colors={['#0569FF', '#8330F4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accentLine} />
            </View>
            <View pointerEvents="none" style={styles.heroArtworkWrap}>
              <Image
                source={require('../../assets/images/login-hero-realistic.png')}
                style={styles.heroArtwork}
                resizeMode="contain"
                accessibilityLabel="Medicine bottle, tablets, and capsule"
              />
            </View>

            <View style={styles.form}>
              <Field value={email} onChangeText={setEmail} placeholder="Email or Phone" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="next" accessibilityLabel="Email or Phone">
                <MailIcon />
              </Field>
              <Field value={password} onChangeText={setPassword} placeholder="Password" autoCapitalize="none" autoComplete="current-password" textContentType="password" secureTextEntry={!passwordVisible} returnKeyType="done" accessibilityLabel="Password" right={<Pressable onPress={() => setPasswordVisible((visible) => !visible)} accessibilityRole="button" accessibilityState={{ selected: passwordVisible }} accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'} style={styles.passwordToggle}>{passwordVisible ? <EyeIcon /> : <EyeOffIcon />}</Pressable>}>
                <LockIcon />
              </Field>
              <Pressable style={styles.forgotButton} accessibilityRole="button"><Text style={styles.forgotText}>Forgot Password?</Text></Pressable>
              <Pressable style={styles.loginButton} accessibilityRole="button" accessibilityLabel="Log in">
                <LinearGradient colors={['#0864FA', '#2838FA', '#9828EC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginGradient}>
                  <Text style={styles.loginText}>Login</Text><ArrowIcon />
                </LinearGradient>
              </Pressable>
            </View>

            <View style={styles.orRow}><View style={styles.orLine} /><Text style={styles.orText}>or continue with</Text><View style={styles.orLine} /></View>
            <View style={styles.socialRow}>
              <Pressable style={styles.socialButton} accessibilityRole="button" accessibilityLabel="Continue with Google"><GoogleIcon /><Text style={styles.socialText}>Continue with Google</Text></Pressable>
              <Pressable style={styles.socialButton} accessibilityRole="button" accessibilityLabel="Continue with Apple"><AppleIcon /><Text style={styles.socialText}>Continue with Apple</Text></Pressable>
            </View>
            <Pressable style={styles.signUpButton} accessibilityRole="button" accessibilityLabel="Sign up"><Text style={styles.signUpPrompt}>Don’t have an account? </Text><Text style={styles.signUpText}>Sign Up</Text><Text style={styles.signUpArrow}> →</Text></Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FEFEFF' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { minHeight: '100%', paddingHorizontal: 22, paddingTop: 38, paddingBottom: 24 },
  topOrb: { position: 'absolute', width: 470, height: 470, borderRadius: 235, top: -293, right: -242 },
  topOrbInner: { position: 'absolute', width: 325, height: 325, borderRadius: 170, top: -230, right: -185, backgroundColor: '#252BFE', opacity: .52 },
  bottomWaveOne: { position: 'absolute', width: 560, height: 210, borderRadius: 280, bottom: -142, left: -142, backgroundColor: '#DCEAFF', opacity: .68, transform: [{ rotate: '9deg' }] },
  bottomWaveTwo: { position: 'absolute', width: 565, height: 185, borderRadius: 280, bottom: -125, right: -165, backgroundColor: '#BBD7FF', opacity: .58, transform: [{ rotate: '-10deg' }] },
  logoFrame: { width: 184, height: 44, overflow: 'hidden', marginLeft: 3 },
  logo: { position: 'absolute', width: 378, height: 114, left: -98, top: -34 },
  heroCopy: { marginTop: 43 },
  title: { color: BRAND_NAVY, fontSize: 27, lineHeight: 32, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#5E659D', fontSize: 16, lineHeight: 21, fontWeight: '600', letterSpacing: -0.3, marginTop: 7 },
  accentLine: { width: 38, height: 4, borderRadius: 8, marginTop: 15 },
  heroArtworkWrap: { position: 'absolute', width: 154, height: 164, top: 0, right: 0 },
  heroArtwork: { width: 154, height: 164 },
  form: { marginTop: 12 },
  field: { height: 48, borderWidth: 1.4, borderColor: '#CED6FF', borderRadius: 17, backgroundColor: 'rgba(244,246,255,0.83)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10 },
  fieldIcon: { width: 22, alignItems: 'center' },
  fieldDivider: { height: 24, width: 1.4, backgroundColor: '#C3CBFA', marginLeft: 9, marginRight: 12 },
  fieldInput: { flex: 1, color: '#303B83', fontSize: 15, padding: 0, height: '100%', fontWeight: '400' },
  fieldRight: { marginLeft: 4, marginRight: -8 },
  passwordToggle: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  forgotButton: { alignSelf: 'flex-end', marginTop: -6 },
  forgotText: { color: '#095BFA', fontSize: 14, fontWeight: '700' },
  loginButton: { height: 46, borderRadius: 23, overflow: 'hidden', marginTop: 20, shadowColor: '#1C3CC9', shadowOpacity: .18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  loginGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 11 },
  loginText: { color: 'white', fontSize: 20, fontWeight: '700', letterSpacing: -0.5 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 17 },
  orLine: { flex: 1, height: 1.5, backgroundColor: '#D8DDF5' },
  orText: { color: '#777FB8', fontSize: 14, fontWeight: '500' },
  socialRow: { flexDirection: 'column', gap: 8, marginTop: 8 },
  socialButton: { flex: 1, height: 40, borderWidth: 1.4, borderColor: '#D0D6F0', borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,.65)' },
  socialText: { color: '#0B126B', fontSize: 11.5, fontWeight: '500' },
  signUpButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 29 },
  signUpPrompt: { color: '#303B83', fontSize: 14, fontWeight: '500' },
  signUpText: { color: '#095BFA', fontSize: 15, fontWeight: '800' },
  signUpArrow: { color: '#095BFA', fontSize: 19, fontWeight: '400', marginTop: -2 },
});
