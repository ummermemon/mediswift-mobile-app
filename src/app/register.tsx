import AuthScreenLayout from '@/components/auth-screen-layout';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const BRAND_BLUE = '#095BFA';
const BRAND_PURPLE = '#7040F5';
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

type RegistrationDetails = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  bloodGroup: (typeof BLOOD_GROUPS)[number] | '';
};

const STEP_TITLES = ['Your name', 'Phone number', 'Health details'];
const STEP_LABELS = ['Personal Details', 'Contact Details', 'Health Details'];
const STEP_SUBTITLES = [
  'Tell us what to call you.',
  'Add a number we can reach you on.',
  'Your blood group is optional.',
];

function isValidDateOfBirth(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date()
  );
}

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<RegistrationDetails>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    bloodGroup: '',
  });
  const [formMessage, setFormMessage] = useState('');

  function updateDetails<K extends keyof RegistrationDetails>(
    key: K,
    value: RegistrationDetails[K]
  ) {
    setDetails((current) => ({ ...current, [key]: value }));
    setFormMessage('');
  }

  function continueToNextStep() {
    Keyboard.dismiss();
    setFormMessage('');

    if (step === 1 && (!details.firstName.trim() || !details.lastName.trim())) {
      setFormMessage('Enter your first and last name to continue.');
      return;
    }

    if (step === 2) {
      const digits = details.phoneNumber.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        setFormMessage('Enter a valid phone number with 10 to 15 digits.');
        return;
      }
    }

    if (step === 3) {
      if (!isValidDateOfBirth(details.dateOfBirth)) {
        setFormMessage('Enter a valid date of birth in DD/MM/YYYY format.');
        return;
      }

      Alert.alert(
        'Registration not submitted',
        'Account creation is not connected yet. Your details have not been saved.',
        [{ text: 'OK' }]
      );
      return;
    }

    setStep((current) => current + 1);
  }

  function goBack() {
    Keyboard.dismiss();
    setFormMessage('');
    if (step > 1) {
      setStep((current) => current - 1);
    } else {
      router.replace('/login');
    }
  }

  return (
    <AuthScreenLayout
      panelTitle={STEP_TITLES[step - 1]}
      panelSubtitle={STEP_SUBTITLES[step - 1]}
    >
      <View style={styles.stepHeader}>
        <View
          style={styles.stepper}
          accessibilityLabel={`Step ${step} of 3: ${STEP_LABELS[step - 1]}`}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 1, max: 3, now: step }}
        >
          <View style={styles.progressTrack}>
            <View style={styles.progressLine} />
            <View
              style={[
                styles.progressLineActive,
                { width: `${((step - 1) / 2) * 100}%` },
              ]}
            />
          </View>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  item <= step && styles.stepCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    item <= step && styles.stepNumberActive,
                  ]}
                >
                  {item}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepName,
                  item === step && styles.stepNameActive,
                ]}
              >
                {STEP_LABELS[item - 1]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {step === 1 ? (
        <>
          <TextInput
            value={details.firstName}
            onChangeText={(value) => updateDetails('firstName', value)}
            placeholder="First name"
            placeholderTextColor="#7A84AF"
            autoCapitalize="words"
            autoComplete="given-name"
            returnKeyType="next"
            accessibilityLabel="First name"
            style={styles.input}
          />
          <TextInput
            value={details.lastName}
            onChangeText={(value) => updateDetails('lastName', value)}
            placeholder="Last name"
            placeholderTextColor="#7A84AF"
            autoCapitalize="words"
            autoComplete="family-name"
            returnKeyType="done"
            onSubmitEditing={continueToNextStep}
            accessibilityLabel="Last name"
            style={styles.input}
          />
        </>
      ) : null}

      {step === 2 ? (
        <TextInput
          value={details.phoneNumber}
          onChangeText={(value) => updateDetails('phoneNumber', value)}
          placeholder="Phone number"
          placeholderTextColor="#7A84AF"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          maxLength={20}
          returnKeyType="done"
          onSubmitEditing={continueToNextStep}
          accessibilityLabel="Phone number"
          style={styles.input}
        />
      ) : null}

      {step === 3 ? (
        <>
          <TextInput
            value={details.dateOfBirth}
            onChangeText={(value) => updateDetails('dateOfBirth', value)}
            placeholder="Date of birth (DD/MM/YYYY)"
            placeholderTextColor="#7A84AF"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            returnKeyType="done"
            accessibilityLabel="Date of birth, day month year"
            style={styles.input}
          />
          <Text style={styles.groupLabel}>Blood group <Text style={styles.optional}>(optional)</Text></Text>
          <View style={styles.bloodGroupGrid}>
            {BLOOD_GROUPS.map((group) => {
              const isSelected = details.bloodGroup === group;
              return (
                <Pressable
                  key={group}
                  onPress={() => updateDetails('bloodGroup', isSelected ? '' : group)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${group} blood group`}
                  style={[styles.bloodGroupOption, isSelected && styles.bloodGroupOptionSelected]}
                >
                  <Text style={[styles.bloodGroupText, isSelected && styles.bloodGroupTextSelected]}>
                    {group}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      {formMessage ? (
        <Text accessibilityRole="alert" style={styles.formMessage}>
          {formMessage}
        </Text>
      ) : null}

      <Pressable
        style={styles.primaryButton}
        onPress={continueToNextStep}
        accessibilityRole="button"
        accessibilityLabel={step === 3 ? 'Finish registration' : 'Continue'}
      >
        <LinearGradient
          colors={['#078BFA', '#3B5CFA', '#8A32F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryGradient}
        >
          <Text style={styles.primaryText}>{step === 3 ? 'Finish' : 'Continue'}</Text>
          <Text style={styles.arrow}>›</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel={step === 1 ? 'Back to sign in' : 'Previous step'}
      >
        <Text style={styles.backText}>{step === 1 ? 'Back to sign in' : 'Back'}</Text>
      </Pressable>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  stepHeader: {
    marginBottom: 16,
  },
  stepper: {
    minHeight: 82,
    flexDirection: 'row',
    position: 'relative',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressTrack: {
    position: 'absolute',
    top: 20,
    left: '16.667%',
    right: '16.667%',
    height: 3,
    overflow: 'hidden',
  },
  progressLine: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#DEE2F7',
  },
  progressLineActive: {
    height: '100%',
    backgroundColor: BRAND_BLUE,
  },
  stepCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9ECFC',
  },
  stepCircleActive: {
    backgroundColor: BRAND_BLUE,
  },
  stepNumber: {
    color: '#666A9B',
    fontSize: 18,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepName: {
    maxWidth: '100%',
    marginTop: 7,
    color: '#686B9C',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepNameActive: {
    color: BRAND_BLUE,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: 1.3,
    borderColor: '#D9DDF0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    color: '#29386D',
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  groupLabel: {
    color: '#29386D',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
    marginBottom: 9,
  },
  optional: {
    color: '#8992AC',
    fontSize: 12,
    fontWeight: '500',
  },
  bloodGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodGroupOption: {
    minWidth: 54,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9DDF0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  bloodGroupOptionSelected: {
    borderColor: BRAND_PURPLE,
    backgroundColor: '#F3F0FF',
  },
  bloodGroupText: {
    color: '#66708C',
    fontSize: 13,
    fontWeight: '700',
  },
  bloodGroupTextSelected: {
    color: BRAND_PURPLE,
  },
  formMessage: {
    color: '#B4233B',
    fontSize: 11.5,
    lineHeight: 15,
    marginTop: 2,
  },
  primaryButton: {
    height: 50,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 14,
    shadowColor: '#4937CE',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 27,
    marginTop: -2,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 12,
  },
  backText: {
    color: BRAND_BLUE,
    fontSize: 13,
    fontWeight: '700',
  },
});
