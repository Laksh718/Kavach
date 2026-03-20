import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import {
  Amount,
  Button,
  Card,
  Chip,
  ListRow,
  ProgressBar,
  Row,
  Screen,
  SectionHeader,
  ShieldRating,
  Subtitle,
  Title,
} from '../components/KavachUI';
import { colors, spacing, type } from '../theme/tokens';

type TabProps<T extends keyof MainTabParamList> = BottomTabScreenProps<MainTabParamList, T>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen(_: TabProps<'Home'>) {
  const navigation = useNavigation<RootNav>();

  return (
    <Screen>
      <Row>
        <View>
          <Text style={styles.hello}>Hey, Rajan 👋</Text>
          <Subtitle>Aaj ka haal</Subtitle>
        </View>
        <Row>
          <Chip label='🔔' />
          <Chip label='Protected' tone='green' />
        </Row>
      </Row>

      <Card tinted>
        <Row>
          <View>
            <Text style={styles.cardTitle}>Protected until Sunday</Text>
            <Subtitle>Standard plan active</Subtitle>
          </View>
          <Amount>5 days</Amount>
        </Row>
      </Card>

      <Card>
        <SectionHeader title='Your zone today' actionLabel='Details →' />
        <Row>
          <View style={styles.flexOne}>
            <Text style={styles.zoneName}>Koramangala</Text>
            <Subtitle>Bengaluru</Subtitle>
            <ShieldRating level={3} />
            <Chip label='Moderate risk' tone='green' />
          </View>
          <View style={styles.weatherBlock}>
            <Text style={styles.weatherTop}>🌧 28°C</Text>
            <Subtitle>No rain expected</Subtitle>
            <Chip label='AQI 82' tone='green' />
          </View>
        </Row>
      </Card>

      <Card>
        <SectionHeader title="Today's earnings" actionLabel='Last 24hr data' />
        <Amount hero>₹380</Amount>
        <ProgressBar value={51} />
        <Subtitle>₹380 of expected ₹740</Subtitle>
        <Subtitle>Your 30-day baseline: ₹740/day</Subtitle>
      </Card>

      <Card>
        <SectionHeader title="This week's risk forecast" />
        <Row>
          <View style={styles.forecastCol}>
            <Text style={styles.forecastDay}>Today</Text>
            <Text>🌧</Text>
            <Chip label='24% rain' />
          </View>
          <View style={styles.forecastCol}>
            <Text style={styles.forecastDay}>Tomorrow</Text>
            <Text>☁️</Text>
            <Chip label='31% rain' tone='amber' />
          </View>
          <View style={styles.forecastCol}>
            <Text style={styles.forecastDay}>Day after</Text>
            <Text>☀️</Text>
            <Chip label='12% rain' tone='green' />
          </View>
        </Row>
      </Card>

      <Row>
        <Card>
          <Text style={styles.statsLabel}>This week's cost</Text>
          <Text style={styles.statsValue}>₹65 ✓</Text>
        </Card>
        <Card>
          <Text style={styles.statsLabel}>Payouts this week</Text>
          <Text style={styles.statsValue}>₹0</Text>
        </Card>
      </Row>

      <Card>
        <SectionHeader title='TrustKarma' actionLabel='See all' />
        <Row>
          <Text style={styles.rowText}>485 / 1000</Text>
          <Chip label='Silver tier' tone='amber' />
        </Row>
        <ProgressBar value={48.5} fill={colors.karmaGold} />
        <Text style={styles.karmaGain}>+5 points this week for active policy</Text>
      </Card>

      <Button label='Simulate Disruption State' onPress={() => navigation.navigate('HomeDisruption')} />
      <Button label='Open Notifications' variant='secondary' onPress={() => navigation.navigate('Notifications')} />
    </Screen>
  );
}

export function ProtectScreen(_: TabProps<'Protect'>) {
  return (
    <Screen>
      <Title>Your protection</Title>
      <Card tinted>
        <Row>
          <Text style={styles.cardTitle}>Standard plan</Text>
          <Chip label='Active ✓' tone='green' />
        </Row>
        <Amount hero>₹65 / week</Amount>
        <Subtitle>Next deduction: Monday</Subtitle>
      </Card>
      <Card>
        <SectionHeader title="What's covered this week" />
        <ListRow title='Heavy Rainfall' rightTop='Active' />
        <ListRow title='Severe AQI' rightTop='Active' />
        <ListRow title='Extreme Heat' rightTop='Monitoring' />
        <ListRow title='Flood Alert' rightTop='Active' />
        <ListRow title='Curfew/Bandh' rightTop='Active' />
      </Card>
      <Row>
        <Card>
          <Text style={styles.rowText}>Upgrade</Text>
        </Card>
        <Card>
          <Text style={styles.rowText}>Pause</Text>
        </Card>
        <Card>
          <Text style={styles.rowText}>Cancel</Text>
        </Card>
      </Row>
    </Screen>
  );
}

export function EarningsScreen(_: TabProps<'Earnings'>) {
  return (
    <Screen>
      <Title>Your earnings</Title>
      <Card tinted>
        <Subtitle>30-day earnings</Subtitle>
        <Amount hero>₹18,400</Amount>
        <Chip label='Verified via Account Aggregator' tone='green' />
        <Row>
          <Chip label='30 days' />
          <Chip label='7 days' tone='amber' />
          <Chip label='Today' tone='green' />
        </Row>
      </Card>
      <Card>
        <ListRow title='Zomato' subtitle='14 active days' rightTop='₹11,200' />
        <ProgressBar value={61} />
        <ListRow title='Swiggy' subtitle='11 active days' rightTop='₹7,200' />
        <ProgressBar value={39} />
      </Card>
      <Card>
        <SectionHeader title='Daily trend this month' />
        <View style={styles.chartStub} />
      </Card>
      <Row>
        <Chip label='Avg/day: ₹613' />
        <Chip label='Expected: ₹740' tone='amber' />
        <Chip label='Difference: -₹127' tone='red' />
      </Row>
    </Screen>
  );
}

export function ZonesScreen(_: TabProps<'Zones'>) {
  return (
    <Screen>
      <Title>Zone safety</Title>
      <Card>
        <View style={styles.mapStub} />
        <Subtitle>Bengaluru 500m risk grid</Subtitle>
      </Card>
      <Card>
        <SectionHeader title="Today's conditions" />
        <Row>
          <Chip label='Heavy rain in Koramangala' tone='red' />
          <Chip label='High AQI in Electronic City' tone='amber' />
        </Row>
        <Row>
          <Chip label='Clear in Whitefield' tone='green' />
        </Row>
      </Card>
      <Card>
        <SectionHeader title='Your frequent zones' />
        <ListRow title='Koramangala' subtitle='3/5 shields · Moderate risk' rightTop='→' />
        <ListRow title='HSR Layout' subtitle='4/5 shields · Safe' rightTop='→' />
      </Card>
    </Screen>
  );
}

export function ProfileScreen(_: TabProps<'Profile'>) {
  const navigation = useNavigation<RootNav>();

  return (
    <Screen>
      <Title>Profile</Title>
      <Card>
        <Text style={styles.cardTitle}>Rajan Kumar</Text>
        <Subtitle>+91 98765 43210</Subtitle>
        <Chip label='KYC verified' tone='green' />
      </Card>
      <Card>
        <SectionHeader title='TrustKarma Score' />
        <Row>
          <Amount hero>485</Amount>
          <Chip label='Silver tier' tone='amber' />
        </Row>
        <ProgressBar value={48.5} fill={colors.karmaGold} />
      </Card>
      <Pressable style={styles.linkCard} onPress={() => navigation.navigate('TrustKarmaDetail')}>
        <Text style={styles.cardTitle}>TrustKarma · 485</Text>
        <Subtitle>Silver tier</Subtitle>
      </Pressable>
      <Pressable style={styles.linkCard} onPress={() => navigation.navigate('ClaimsHistory')}>
        <Text style={styles.cardTitle}>Claims history</Text>
      </Pressable>
      <Pressable style={styles.linkCard} onPress={() => navigation.navigate('Notifications')}>
        <Text style={styles.cardTitle}>Notifications</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: type.h3, fontFamily: 'DMSans_700Bold', color: colors.black },
  flexOne: { flex: 1, gap: 6 },
  zoneName: { fontSize: type.bodyLg, fontFamily: 'DMSans_700Bold', color: colors.black },
  weatherBlock: { alignItems: 'flex-end', gap: 6 },
  weatherTop: { fontSize: type.bodyLg, fontFamily: 'DMSans_600SemiBold', color: colors.black },
  forecastCol: { flex: 1, alignItems: 'center', gap: 6, borderRadius: 12, backgroundColor: '#F5F9FF', paddingVertical: 8 },
  forecastDay: { fontSize: type.label, color: colors.grayMid, fontFamily: 'DMSans_600SemiBold' },
  statsLabel: { fontSize: type.label, color: colors.grayMid, fontFamily: 'DMSans_500Medium' },
  statsValue: { fontSize: type.bodyLg, color: colors.black, fontFamily: 'DMMono_700Bold' },
  karmaGain: { fontSize: type.label, color: colors.green, fontFamily: 'DMSans_500Medium' },
  cardTitle: { fontSize: type.bodyLg, color: colors.black, fontFamily: 'DMSans_700Bold' },
  rowText: { fontSize: type.body, color: colors.black, fontFamily: 'DMSans_600SemiBold' },
  chartStub: { height: 140, borderRadius: 12, backgroundColor: '#EDF4FF' },
  mapStub: { height: 260, borderRadius: 16, backgroundColor: colors.blueMid },
  linkCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0EEE8',
    backgroundColor: '#FFFFFF',
    padding: spacing.xl,
    gap: spacing.xs,
  },
});
