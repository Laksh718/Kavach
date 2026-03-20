import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
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
  Subtitle,
  Title,
} from '../components/KavachUI';
import { colors, type } from '../theme/tokens';

type Props<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export function HomeDisruptionScreen({ navigation }: Props<'HomeDisruption'>) {
  return (
    <Screen>
      <Card>
        <Chip label='Heavy rain in your zone' tone='red' />
        <Subtitle>Detected 12 minutes ago</Subtitle>
        <Subtitle>47mm/hr rainfall — WeatherUnion</Subtitle>
        <Button label='View live disruption' onPress={() => navigation.navigate('DisruptionLive')} />
      </Card>
      <Card tinted>
        <Text style={styles.label}>Estimated payout if disruption continues</Text>
        <Amount hero>₹371</Amount>
        <Subtitle>Processing starts when score hits 70/100</Subtitle>
        <ProgressBar value={64} fill={colors.orange} />
        <Subtitle>Current score: 64 / 100</Subtitle>
      </Card>
      <Button label='Back to Home' variant='ghost' onPress={() => navigation.goBack()} />
    </Screen>
  );
}

export function DisruptionLiveScreen({ navigation }: Props<'DisruptionLive'>) {
  return (
    <Screen>
      <Title>Live disruption</Title>
      <Subtitle>Zone: Koramangala</Subtitle>
      <Card>
        <View style={styles.mapStub} />
        <Row>
          <Chip label='52mm/hr' tone='amber' />
          <Chip label='64/100 risk score' tone='amber' />
          <Chip label='38 min' />
        </Row>
      </Card>
      <Card>
        <SectionHeader title='Your live estimate' />
        <Amount hero>₹371</Amount>
        <Subtitle>Based on ₹530 shortfall × 70% coverage</Subtitle>
        <ProgressBar value={64} fill={colors.orange} />
        <Subtitle>Score updates every 15 minutes from WeatherUnion + IMD</Subtitle>
      </Card>
      <Card>
        <SectionHeader title='Verified by' />
        <Row>
          <Chip label='WeatherUnion ✓' tone='green' />
          <Chip label='IMD ✓' tone='green' />
          <Chip label='CPCB' />
        </Row>
      </Card>
      <Button label='Start payout processing' onPress={() => navigation.navigate('PayoutProcessing')} />
    </Screen>
  );
}

export function PayoutProcessingScreen({ navigation }: Props<'PayoutProcessing'>) {
  return (
    <Screen>
      <Title>Processing your payout</Title>
      <Subtitle>₹371 is being sent to your PhonePe</Subtitle>
      <Card>
        <ListRow title='Disruption verified' subtitle='WeatherUnion + IMD confirmed' rightTop='✓' />
        <ListRow title='Earnings shortfall confirmed' subtitle='₹530 below baseline' rightTop='✓' />
        <ListRow title='Sending to your UPI account' subtitle='Usually under 2 minutes' rightTop='⟳' />
        <ListRow title='Payout received' rightTop='○' />
      </Card>
      <Button label='Mark as received' onPress={() => navigation.navigate('PayoutReceived')} />
    </Screen>
  );
}

export function PayoutReceivedScreen({ navigation }: Props<'PayoutReceived'>) {
  return (
    <Screen>
      <Chip label='Success' tone='green' />
      <Amount hero>₹371 received!</Amount>
      <Subtitle>Sent to PhonePe · Just now</Subtitle>
      <Card>
        <SectionHeader title='How your payout was calculated' />
        <Row>
          <Text style={styles.row}>Expected earnings today</Text>
          <Amount>₹740</Amount>
        </Row>
        <Row>
          <Text style={styles.row}>Actual earnings</Text>
          <Amount>₹210</Amount>
        </Row>
        <Row>
          <Text style={styles.row}>Shortfall</Text>
          <Amount>₹530</Amount>
        </Row>
        <Row>
          <Text style={styles.row}>Payout (70%)</Text>
          <Text style={styles.total}>₹371</Text>
        </Row>
      </Card>
      <Card>
        <Row>
          <Chip label='WeatherUnion 52mm/hr' tone='green' />
          <Chip label='IMD Red Alert' tone='green' />
          <Chip label='Score: 78/100' />
        </Row>
      </Card>
      <Card tinted>
        <Row>
          <Text style={styles.label}>+10 TrustKarma points earned</Text>
          <Text style={styles.total}>485 → 495</Text>
        </Row>
      </Card>
      <Button label='Back to dashboard' onPress={() => navigation.navigate('MainTabs')} />
    </Screen>
  );
}

export function TrustKarmaDetailScreen(_: Props<'TrustKarmaDetail'>) {
  return (
    <Screen>
      <Title>TrustKarma</Title>
      <Card>
        <Text style={styles.label}>Score</Text>
        <Amount hero>485 / 1000</Amount>
        <Chip label='Silver tier' tone='amber' />
        <ProgressBar value={48.5} fill={colors.karmaGold} />
      </Card>
      <Card>
        <SectionHeader title='Recent activity' />
        <ListRow title='Active policy — week 8' subtitle='Mar 15' rightTop='+5' />
        <ListRow title='Clean payout verified' subtitle='Mar 12' rightTop='+10' />
        <ListRow title='13-week streak' subtitle='Mar 1' rightTop='+20' />
      </Card>
      <Card>
        <SectionHeader title='Earn more points' />
        <Text style={styles.row}>• Maintain active policy every week: +5</Text>
        <Text style={styles.row}>• Verified clean payout: +10</Text>
        <Text style={styles.row}>• Quarterly coverage streak: +20</Text>
      </Card>
    </Screen>
  );
}

export function ClaimsHistoryScreen({ navigation }: Props<'ClaimsHistory'>) {
  return (
    <Screen>
      <Title>Claims history</Title>
      <Row>
        <Card>
          <Text style={styles.row}>Total payouts</Text>
          <Amount>₹2,840</Amount>
        </Card>
        <Card>
          <Text style={styles.row}>Claims this year</Text>
          <Text style={styles.row}>4 events</Text>
        </Card>
      </Row>
      <Card>
        <Chip label='Heavy Rainfall · ₹371 received' tone='green' />
        <Subtitle>WeatherUnion verified · Score 78/100</Subtitle>
        <Button label='Open claim detail' variant='secondary' onPress={() => navigation.navigate('ClaimDetail')} />
      </Card>
    </Screen>
  );
}

export function ClaimDetailScreen(_: Props<'ClaimDetail'>) {
  return (
    <Screen>
      <Title>Claim details</Title>
      <Chip label='₹371 Received' tone='green' />
      <Card>
        <Text style={styles.label}>What caused this payout</Text>
        <ListRow title='WeatherUnion' subtitle='52mm/hr recorded at 5:12 PM' rightTop='✓' />
        <ListRow title='IMD' subtitle='District red alert issued' rightTop='✓' />
        <ListRow title='Disruption score' subtitle='78/100 (threshold 70)' rightTop='✓' />
        <ListRow title='Zone activity drop' subtitle='71% workers went offline' rightTop='✓' />
      </Card>
      <Card>
        <SectionHeader title='Your earnings on this day' />
        <Row>
          <Text style={styles.row}>Zomato</Text>
          <Text style={styles.row}>₹210 vs ₹480</Text>
        </Row>
        <Row>
          <Text style={styles.row}>Amazon Flex</Text>
          <Text style={styles.row}>₹0 vs ₹260</Text>
        </Row>
        <Row>
          <Text style={styles.label}>Total</Text>
          <Amount>₹210 vs ₹740</Amount>
        </Row>
      </Card>
      <Button label='Download receipt (PDF)' variant='ghost' />
    </Screen>
  );
}

export function NotificationsScreen(_: Props<'Notifications'>) {
  return (
    <Screen>
      <Title>Notifications</Title>
      <Card>
        <ListRow title='₹371 received!' subtitle='Heavy rain payout sent to PhonePe' rightTop='2 min' />
        <ListRow title='Heavy rain alert — Koramangala' subtitle='Your ₹740 baseline is protected' rightTop='4 hrs' />
        <ListRow title='Kavach deducted ₹65' subtitle='Standard plan renewed for this week' rightTop='Mon' />
        <ListRow title='+10 TrustKarma earned' subtitle='Now 495 points (Silver)' rightTop='Yesterday' />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapStub: { height: 280, borderRadius: 16, backgroundColor: colors.blueMid },
  label: { fontSize: type.bodyLg, fontFamily: 'DMSans_700Bold', color: colors.black },
  row: { fontSize: type.body, fontFamily: 'DMSans_400Regular', color: colors.grayDark },
  total: { fontSize: type.numberMd, fontFamily: 'DMMono_700Bold', color: colors.green },
  step: { fontSize: type.body, color: colors.black, fontFamily: 'DMSans_600SemiBold' },
});
