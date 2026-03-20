import React, { PropsWithChildren } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, type } from '../theme/tokens';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Screen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const content = <View style={styles.screenInner}>{children}</View>;

  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

export function BottomActions({ children }: PropsWithChildren) {
  return <View style={styles.bottomActions}>{children}</View>;
}

export function Title({ children }: PropsWithChildren) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: PropsWithChildren) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Card({ children, tinted = false }: PropsWithChildren<{ tinted?: boolean }>) {
  return <View style={[styles.card, tinted && styles.cardTinted]}>{children}</View>;
}

export function Row({ children }: PropsWithChildren) {
  return <View style={styles.row}>{children}</View>;
}

export function SectionHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? <Text style={styles.sectionAction}>{actionLabel}</Text> : null}
    </View>
  );
}

export function ProgressBar({ value, fill = colors.bluePrimary }: { value: number; fill?: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${clamped}%`, backgroundColor: fill }]} />
    </View>
  );
}

export function ShieldRating({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  const filledColor = level === 5 ? colors.zone5 : level === 4 ? colors.zone4 : level === 3 ? colors.zone3 : level === 2 ? colors.zone2 : colors.zone1;
  return (
    <View style={styles.shieldRow}>
      {[1, 2, 3, 4, 5].map((index) => (
        <View key={index} style={[styles.shieldDot, { backgroundColor: index <= level ? filledColor : colors.grayLight }]} />
      ))}
    </View>
  );
}

export function ListRow({
  title,
  subtitle,
  rightTop,
  rightBottom,
}: {
  title: string;
  subtitle?: string;
  rightTop?: string;
  rightBottom?: string;
}) {
  return (
    <View style={styles.listRow}>
      <View style={styles.listAvatar} />
      <View style={styles.listCenter}>
        <Text style={styles.listTitle}>{title}</Text>
        {subtitle ? <Text style={styles.listSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.listRight}>
        {rightTop ? <Text style={styles.listRightTop}>{rightTop}</Text> : null}
        {rightBottom ? <Text style={styles.listRightBottom}>{rightBottom}</Text> : null}
      </View>
    </View>
  );
}

export function Chip({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  return <Text style={[styles.chip, toneStyles[tone]]}>{label}</Text>;
}

export function Amount({ children, hero = false }: PropsWithChildren<{ hero?: boolean }>) {
  return <Text style={[styles.amount, hero && styles.amountHero]}>{children}</Text>;
}

export function Button({ label, onPress, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyles[variant],
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonLabel, variantLabelStyles[variant], disabled && styles.buttonLabelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgWarm },
  scroll: { paddingBottom: spacing.x4 },
  screenInner: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, gap: spacing.lg },
  bottomActions: { marginTop: spacing.md, gap: spacing.sm },
  title: { fontSize: type.h1, fontFamily: 'DMSans_700Bold', color: colors.black, lineHeight: 34 },
  subtitle: { fontSize: type.body, color: colors.grayMid, fontFamily: 'DMSans_400Regular', lineHeight: 22 },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: '#F0EEE8',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  cardTinted: {
    backgroundColor: colors.blueLight,
    borderColor: colors.blueLight,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { fontSize: type.h3, color: colors.black, fontFamily: 'DMSans_700Bold' },
  sectionAction: { fontSize: type.body, color: colors.bluePrimary, fontFamily: 'DMSans_600SemiBold' },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: radius.chip,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: type.label,
    fontFamily: 'DMSans_600SemiBold',
  },
  amount: { fontSize: type.numberMd, fontFamily: 'DMMono_700Bold', color: colors.black },
  amountHero: { fontSize: type.numberLg },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.grayLight, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  shieldRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  shieldDot: { width: 16, height: 16, borderRadius: radius.circle },
  listRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0EEE8',
  },
  listAvatar: { width: 36, height: 36, borderRadius: radius.circle, backgroundColor: colors.blueLight },
  listCenter: { flex: 1, gap: 2 },
  listRight: { alignItems: 'flex-end', gap: 2 },
  listTitle: { fontSize: type.body, color: colors.black, fontFamily: 'DMSans_700Bold' },
  listSubtitle: { fontSize: type.label, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  listRightTop: { fontSize: type.bodyLg, color: colors.black, fontFamily: 'DMMono_700Bold' },
  listRightBottom: { fontSize: type.caption, color: colors.grayMid, fontFamily: 'DMSans_400Regular' },
  button: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { transform: [{ scale: 0.97 }] },
  buttonDisabled: { opacity: 0.45 },
  buttonLabel: { fontSize: type.bodyLg, fontFamily: 'DMSans_700Bold' },
  buttonLabelDisabled: { color: colors.grayMid },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.bluePrimary },
  secondary: { backgroundColor: colors.blueLight },
  ghost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.grayLight },
});

const variantLabelStyles = StyleSheet.create({
  primary: { color: '#FFFFFF' },
  secondary: { color: colors.bluePrimary },
  ghost: { color: colors.black },
});

const toneStyles = StyleSheet.create({
  blue: { backgroundColor: colors.blueLight, color: colors.bluePrimary },
  green: { backgroundColor: colors.greenLight, color: colors.green },
  amber: { backgroundColor: colors.amberLight, color: colors.amber },
  red: { backgroundColor: colors.redLight, color: colors.red },
});
