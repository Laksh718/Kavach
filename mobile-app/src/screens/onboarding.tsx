import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  Amount,
  BottomActions,
  Button,
  Card,
  Chip,
  ListRow,
  ProgressBar,
  Row,
  Screen,
  SectionHeader,
  Subtitle,
  Title,
} from '../components/KavachUI';
import { colors, spacing, type } from '../theme/tokens';
import { useAppStore } from '../store/appStore';

type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export function SplashScreen({ navigation }: Props<'Splash'>) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('LanguageSelection'), 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen scroll={false}>
      <View style={styles.splashWrap}>
        <View style={styles.logo} />
        <Text style={styles.splashTitle}>KAVACH</Text>
        <Text style={styles.splashHindi}>कवच</Text>
        <Text style={styles.splashTag}>Rain ko mat daro.</Text>
        <View style={styles.loaderRow}>
          <View style={[styles.loaderDot, styles.loaderDotActive]} />
          <View style={styles.loaderDot} />
          <View style={styles.loaderDot} />
        </View>
      </View>
    </Screen>
  );
}

const languages = ['हिंदी', 'English', 'தமிழ்', 'తెలుగు', 'বাংলা', 'ಕನ್ನಡ'];

export function LanguageSelectionScreen({ navigation }: Props<'LanguageSelection'>) {
  const { language, setLanguage } = useAppStore();

  return (
    <Screen>
      <Title>अपनी भाषा चुनें{`\n`}Choose your language</Title>
      <Subtitle>You can change this anytime</Subtitle>
      <View style={styles.grid}>
        {languages.map((value) => {
          const selected = language === value;
          return (
            <Pressable key={value} onPress={() => setLanguage(value)} style={[styles.langCard, selected && styles.langCardSelected]}>
              <Text style={[styles.langNative, selected && styles.langNativeSelected]}>{value}</Text>
              <Text style={styles.langEnglish}>{value === 'हिंदी' ? 'Hindi' : value === 'தமிழ்' ? 'Tamil' : value === 'తెలుగు' ? 'Telugu' : value === 'বাংলা' ? 'Bengali' : value === 'ಕನ್ನಡ' ? 'Kannada' : 'English'}</Text>
            </Pressable>
          );
        })}
      </View>
      <BottomActions>
        <Button label='Continue / आगे बढ़ें' onPress={() => navigation.navigate('Value1')} />
      </BottomActions>
    </Screen>
  );
}

function ValueBase({
  title,
  body,
  badge,
  tint,
  onNext,
  step,
}: {
  title: string;
  body: string;
  badge: string;
  tint?: 'blue' | 'green' | 'amber';
  onNext: () => void;
  step: '1' | '2' | '3';
}) {
  const tintStyle = tint === 'green' ? styles.illustrationGreen : tint === 'amber' ? styles.illustrationAmber : styles.illustrationBlue;

  return (
    <Screen>
      <View style={[styles.illustrationPanel, tintStyle]}>
        <View style={styles.dotSteps}>
          <View style={[styles.stepDot, step === '1' && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === '2' && styles.stepDotActive]} />
          <View style={[styles.stepDot, step === '3' && styles.stepDotActive]} />
        </View>
      </View>
      <Card>
        <Title>{title}</Title>
        <Subtitle>{body}</Subtitle>
        <Chip label={badge} />
      </Card>
      <BottomActions>
        <Button label='Next' onPress={onNext} />
      </BottomActions>
    </Screen>
  );
}

export function Value1Screen({ navigation }: Props<'Value1'>) {
  return (
    <ValueBase
      step='1'
      tint='blue'
      title='Baarish aaye, paisa aaye'
      body='When heavy rain, severe pollution, or floods stop your deliveries, KAVACH sends payout automatically.'
      badge='₹ arrives in 4 minutes'
      onNext={() => navigation.navigate('Value2')}
    />
  );
}

export function Value2Screen({ navigation }: Props<'Value2'>) {
  return (
    <ValueBase
      step='2'
      tint='green'
      title='Sirf ₹65/hafte. Automatic.'
      body='Every Monday, weekly cost is deducted. When disruption hits your zone, money arrives automatically.'
      badge='Rain, AQI, flood, heatwave covered'
      onNext={() => navigation.navigate('Value3')}
    />
  );
}

export function Value3Screen({ navigation }: Props<'Value3'>) {
  return (
    <ValueBase
      step='3'
      tint='amber'
      title='Choose your protection level'
      body='Cancel or pause anytime. Your coverage moves with you across platforms.'
      badge='Starter ₹35 · Standard ₹65 · Shield ₹99'
      onNext={() => navigation.navigate('MobileEntry')}
    />
  );
}

export function MobileEntryScreen({ navigation }: Props<'MobileEntry'>) {
  const { mobile, setMobile } = useAppStore();
  const isValid = useMemo(() => /^\d{10}$/.test(mobile), [mobile]);

  return (
    <Screen>
      <Title>Your mobile number</Title>
      <Subtitle>Enter your Zomato/Swiggy registered number</Subtitle>
      <Card>
        <Text style={styles.inputLabel}>+91</Text>
        <TextInput
          value={mobile}
          onChangeText={(value) => setMobile(value.replace(/\D/g, '').slice(0, 10))}
          keyboardType='number-pad'
          placeholder='98765 43210'
          style={styles.input}
        />
      </Card>
      <Subtitle>By continuing, you agree to our Terms & Privacy Policy</Subtitle>
      <BottomActions>
        <Button label='Send OTP' disabled={!isValid} onPress={() => navigation.navigate('OtpVerification')} />
        <Button label='Skip for now' variant='ghost' onPress={() => navigation.replace('MainTabs')} />
      </BottomActions>
    </Screen>
  );
}

export function OtpVerificationScreen({ navigation }: Props<'OtpVerification'>) {
  const [otp, setOtp] = useState('');
  const complete = otp.length === 6;

  useEffect(() => {
    if (complete) {
      const timer = setTimeout(() => navigation.navigate('KycSelfie'), 450);
      return () => clearTimeout(timer);
    }
    return;
  }, [complete, navigation]);

  return (
    <Screen>
      <Title>Verify your number</Title>
      <Subtitle>We sent a 6-digit OTP to your mobile number</Subtitle>
      <Row>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={[styles.otpCell, otp[index] ? styles.otpCellFilled : undefined]}>
            <Text style={styles.otpText}>{otp[index] ?? ''}</Text>
          </View>
        ))}
      </Row>
      <TextInput
        value={otp}
        onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
        keyboardType='number-pad'
        style={styles.otpHiddenInput}
      />
      <Chip label='Reading OTP automatically...' />
      <Subtitle>{complete ? 'Verified ✓' : 'Resend OTP in 00:28'}</Subtitle>
      <BottomActions>
        <Button label='Verify' disabled={!complete} onPress={() => navigation.navigate('KycSelfie')} />
      </BottomActions>
    </Screen>
  );
}

export function KycSelfieScreen({ navigation }: Props<'KycSelfie'>) {
  return (
    <Screen>
      <Title>Verify your identity</Title>
      <ProgressBar value={50} />
      <Card>
        <Subtitle>Position your face within the oval</Subtitle>
        <View style={styles.oval} />
        <Row>
          <Chip label='Good lighting' />
          <Chip label='Remove glasses' />
        </Row>
        <Chip label='Face detected ✓' tone='green' />
      </Card>
      <BottomActions>
        <Button label='Take Selfie' onPress={() => navigation.navigate('KycPan')} />
      </BottomActions>
    </Screen>
  );
}

export function KycPanScreen({ navigation }: Props<'KycPan'>) {
  const [pan, setPan] = useState('');
  const valid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);

  return (
    <Screen>
      <Title>PAN verification</Title>
      <ProgressBar value={100} />
      <Subtitle>Required for IRDAI-compliant protection policy</Subtitle>
      <TextInput
        value={pan}
        onChangeText={(value) => setPan(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
        style={styles.panInput}
        placeholder='ABCDE1234F'
      />
      <BottomActions>
        <Button label='Verify PAN' disabled={!valid} onPress={() => navigation.navigate('PlatformSelection')} />
      </BottomActions>
    </Screen>
  );
}

const platforms = ['Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Amazon Flex', 'Flipkart Quick'];

export function PlatformSelectionScreen({ navigation }: Props<'PlatformSelection'>) {
  const { platforms: selected, togglePlatform } = useAppStore();

  return (
    <Screen>
      <Title>Which apps do you work on?</Title>
      <Subtitle>Select all that apply</Subtitle>
      <View style={styles.grid}>
        {platforms.map((value) => {
          const active = selected.includes(value);
          return (
            <Pressable key={value} onPress={() => togglePlatform(value)} style={[styles.platformCard, active && styles.platformCardActive]}>
              <Text style={[styles.platformText, active && styles.platformTextActive]}>{value}</Text>
            </Pressable>
          );
        })}
      </View>
      {selected.length ? <Chip label={`${selected.length} platforms selected`} /> : null}
      <BottomActions>
        <Button
          label={selected.length ? 'Continue' : 'Continue'}
          disabled={!selected.length}
          onPress={() => navigation.navigate('EarningsUpload')}
        />
      </BottomActions>
    </Screen>
  );
}

export function EarningsUploadScreen({ navigation }: Props<'EarningsUpload'>) {
  const selected = useAppStore((state) => state.platforms);
  const [uploaded, setUploaded] = useState(false);

  return (
    <Screen>
      <Title>Show us your earnings</Title>
      <Subtitle>Step 1 of 2 · Upload screenshot for each selected platform</Subtitle>
      <Card tinted>
        <Row>
          <Chip label='Zomato' />
          <Chip label='Swiggy' />
        </Row>
      </Card>
      <Card>
        <SectionHeader title='Screenshot your earnings' />
        <View style={styles.uploadZone}>
          <Text style={styles.uploadTitle}>{uploaded ? 'Screenshot uploaded' : 'Tap to upload screenshot'}</Text>
          <Text style={styles.uploadSub}>{uploaded ? 'Reading your earnings...' : 'or take photo'}</Text>
        </View>
        {uploaded ? (
          <Card tinted>
            <Text style={styles.rowValue}>We found ₹18,400 from your last 30 days</Text>
            <Row>
              <Button label='Yes, looks right ✓' variant='secondary' />
              <Button label='Re-upload' variant='ghost' onPress={() => setUploaded(false)} />
            </Row>
          </Card>
        ) : (
          <Button label='Upload now' variant='secondary' onPress={() => setUploaded(true)} />
        )}
        <Subtitle>Selected: {selected.join(', ') || 'None selected'}</Subtitle>
      </Card>
      <BottomActions>
        <Button label='Next' disabled={!uploaded} onPress={() => navigation.navigate('AAConsent')} />
      </BottomActions>
    </Screen>
  );
}

export function AAConsentScreen({ navigation }: Props<'AAConsent'>) {
  return (
    <Screen>
      <Title>Verify with your bank</Title>
      <Chip label='Approved by RBI' tone='green' />
      <Card>
        <SectionHeader title='Why we need this' />
        <Subtitle>KAVACH connects to your bank to verify your earnings automatically through RBI-approved Account Aggregator flow.</Subtitle>
        <ListRow title='You give one-time permission' rightTop='1' />
        <ListRow title='Bank shares UPI payment data' rightTop='2' />
        <ListRow title='KAVACH reads only gig app payments' rightTop='3' />
        <Row>
          <Chip label='RBI regulated' tone='green' />
          <Chip label='Cancel anytime' tone='green' />
        </Row>
      </Card>
      <BottomActions>
        <Button label='Connect via Finvu / OneMoney' onPress={() => navigation.navigate('PlanSelection')} />
        <Button label='Skip for now — I will do this later' variant='ghost' onPress={() => navigation.navigate('PlanSelection')} />
      </BottomActions>
    </Screen>
  );
}

const plans: Array<{ name: 'Starter' | 'Standard' | 'Shield'; weekly: string; payout: string }> = [
  { name: 'Starter', weekly: '₹35/week', payout: 'Up to ₹1,500' },
  { name: 'Standard', weekly: '₹65/week', payout: 'Up to ₹2,500' },
  { name: 'Shield', weekly: '₹99/week', payout: 'Up to ₹3,500' },
];

export function PlanSelectionScreen({ navigation }: Props<'PlanSelection'>) {
  const selectedPlan = useAppStore((state) => state.selectedPlan);
  const setSelectedPlan = useAppStore((state) => state.setSelectedPlan);

  return (
    <Screen>
      <Title>Choose your protection</Title>
      <Subtitle>Deducted every Monday. Cancel anytime.</Subtitle>
      <Chip label='Your zone has moderate risk this week — personalized pricing' />
      {plans.map((plan) => {
        const active = selectedPlan === plan.name;
        return (
          <Pressable
            key={plan.name}
            onPress={() => setSelectedPlan(plan.name)}
            style={[styles.planCard, active && styles.planCardActive, plan.name === 'Standard' && styles.planCardFeatured]}
          >
            <Row>
              <Text style={[styles.planTitle, plan.name === 'Standard' && styles.planTitleFeatured]}>{plan.name}</Text>
              <Amount>{plan.weekly}</Amount>
            </Row>
            <Text style={[styles.planSub, plan.name === 'Standard' && styles.planSubFeatured]}>{plan.payout}</Text>
            {plan.name === 'Standard' ? <Chip label='Most popular' /> : null}
          </Pressable>
        );
      })}
      <Text style={styles.compareText}>Compare all features →</Text>
      <BottomActions>
        <Button label={`Start with ${selectedPlan}`} onPress={() => navigation.navigate('UpiAutopay')} />
      </BottomActions>
    </Screen>
  );
}

export function UpiAutopayScreen({ navigation }: Props<'UpiAutopay'>) {
  const selectedPlan = useAppStore((state) => state.selectedPlan);
  const [upi, setUpi] = useState('');
  const weekly = selectedPlan === 'Starter' ? '₹35' : selectedPlan === 'Standard' ? '₹65' : '₹99';

  return (
    <Screen>
      <Title>Set up weekly payment</Title>
      <Card tinted>
        <Subtitle>Your {selectedPlan} plan</Subtitle>
        <Amount hero>{weekly} every Monday</Amount>
        <Subtitle>Starting next Monday</Subtitle>
      </Card>
      <Card>
        <Text style={styles.rowLabel}>Your UPI ID</Text>
        <TextInput value={upi} onChangeText={setUpi} placeholder='yourname@upi' style={styles.upiInput} />
      </Card>
      <BottomActions>
        <Button label={`Authorize ${weekly}/week`} disabled={!upi.includes('@')} onPress={() => navigation.navigate('Welcome')} />
      </BottomActions>
    </Screen>
  );
}

export function WelcomeScreen({ navigation }: Props<'Welcome'>) {
  const selectedPlan = useAppStore((state) => state.selectedPlan);
  return (
    <Screen>
      <View style={styles.centerHero}>
        <Chip label='कवच active' tone='green' />
        <Title>You are protected!</Title>
      </View>
      <Card>
        <Row>
          <Text style={styles.rowLabel}>Your plan</Text>
          <Text style={styles.rowValue}>{selectedPlan}</Text>
        </Row>
        <Row>
          <Text style={styles.rowLabel}>Weekly cost</Text>
          <Text style={styles.rowValue}>{selectedPlan === 'Starter' ? '₹35' : selectedPlan === 'Standard' ? '₹65' : '₹99'}</Text>
        </Row>
        <Row>
          <Text style={styles.rowLabel}>Coverage starts</Text>
          <Text style={styles.rowValue}>Right now ✓</Text>
        </Row>
        <Row>
          <Text style={styles.rowLabel}>Your baseline</Text>
          <Text style={styles.rowValue}>₹18,400 / month</Text>
        </Row>
      </Card>
      <Chip label='Policy sent to your WhatsApp' tone='green' />
      <BottomActions>
        <Button label='Go to Dashboard' onPress={() => navigation.replace('MainTabs')} />
      </BottomActions>
    </Screen>
  );
}

const styles = StyleSheet.create({
  splashWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  loaderRow: { flexDirection: 'row', gap: 8, marginTop: spacing.sm },
  loaderDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: colors.blueMid },
  loaderDotActive: { backgroundColor: colors.bluePrimary, width: 20 },
  logo: { width: 72, height: 72, borderRadius: 16, backgroundColor: colors.bluePrimary },
  splashTitle: { fontSize: 36, fontFamily: 'DMSans_800ExtraBold', color: colors.black },
  splashHindi: { fontSize: 18, color: colors.bluePrimary, fontFamily: 'DMSans_500Medium' },
  splashTag: { fontSize: type.body, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  langCard: {
    width: '48%',
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: 2,
  },
  langCardSelected: { borderColor: colors.bluePrimary, backgroundColor: colors.blueLight },
  langNative: { fontSize: type.h3, color: colors.black, fontFamily: 'DMSans_700Bold' },
  langEnglish: { fontSize: type.label, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  langNativeSelected: { color: colors.bluePrimary },
  illustrationPanel: { height: 280, borderRadius: 20, padding: spacing.lg, justifyContent: 'flex-start' },
  illustrationBlue: { backgroundColor: colors.blueLight },
  illustrationGreen: { backgroundColor: colors.greenLight },
  illustrationAmber: { backgroundColor: colors.amberLight },
  dotSteps: { flexDirection: 'row', gap: 8, alignSelf: 'flex-end' },
  stepDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: colors.grayLight },
  stepDotActive: { width: 20, backgroundColor: colors.bluePrimary },
  inputLabel: { fontSize: type.bodyLg, color: colors.grayMid, fontFamily: 'DMSans_600SemiBold' },
  input: {
    marginTop: spacing.sm,
    backgroundColor: colors.grayFaint,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontSize: 24,
    fontFamily: 'DMMono_700Bold',
    color: colors.black,
  },
  otpCell: {
    width: 52,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: colors.grayFaint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpCellFilled: { backgroundColor: '#FFFFFF', borderColor: colors.bluePrimary, borderWidth: 2 },
  otpText: { fontSize: 28, color: colors.black, fontFamily: 'DMMono_700Bold' },
  otpHiddenInput: { height: 0, width: 0, opacity: 0 },
  oval: {
    height: 280,
    borderRadius: 160,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.bluePrimary,
    backgroundColor: colors.grayFaint,
  },
  panInput: {
    height: 72,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: 'DMMono_700Bold',
    fontSize: 28,
  },
  platformCard: {
    width: '48%',
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  platformCardActive: { borderColor: colors.bluePrimary, backgroundColor: colors.blueLight },
  platformText: { textAlign: 'center', fontFamily: 'DMSans_700Bold', color: colors.black },
  platformTextActive: { color: colors.bluePrimary },
  planCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: '#FFFFFF',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  planCardActive: { borderColor: colors.bluePrimary, backgroundColor: colors.blueLight },
  planCardFeatured: { backgroundColor: colors.bluePrimary, borderColor: colors.bluePrimary },
  planTitle: { fontSize: type.h3, color: colors.black, fontFamily: 'DMSans_700Bold' },
  planTitleFeatured: { color: '#FFFFFF' },
  planSub: { fontSize: type.body, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  planSubFeatured: { color: '#DDE9FF' },
  compareText: { textAlign: 'center', color: colors.bluePrimary },
  upiInput: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    backgroundColor: colors.grayFaint,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.black,
    fontFamily: 'DMSans_500Medium',
  },
  uploadZone: {
    minHeight: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.bluePrimary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  uploadTitle: { fontSize: type.bodyLg, color: colors.bluePrimary, fontFamily: 'DMSans_700Bold' },
  uploadSub: { fontSize: type.body, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  centerHero: { alignItems: 'center', gap: spacing.sm },
  rowLabel: { fontSize: type.body, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  rowValue: { fontSize: type.bodyLg, color: colors.black, fontFamily: 'DMSans_700Bold' },
});
