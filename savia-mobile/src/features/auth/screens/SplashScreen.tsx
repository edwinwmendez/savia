import { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import { useAuthStore } from '@/shared/store/authStore';
import {
  APP_NAME,
  APP_TAGLINE,
  APP_SUBTITLE,
  APP_COPYRIGHT,
  SPLASH_DURATION_MS,
} from '@/shared/config/constants';
import type { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(1)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.4,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.dotsContainer}>
      {[dot1, dot2, dot3].map((opacity, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity }]} />
      ))}
    </View>
  );
}

export function SplashScreen({ navigation }: Props) {
  const isLoading = useAuthStore((s) => s.isLoading);
  const splashTimerDone = useRef(false);
  const authResolved = useRef(false);

  const tryNavigate = useCallback(() => {
    if (splashTimerDone.current && authResolved.current) {
      navigation.replace('Login');
    }
  }, [navigation]);

  // Timer mínimo del splash
  useEffect(() => {
    const timer = setTimeout(() => {
      splashTimerDone.current = true;
      tryNavigate();
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [tryNavigate]);

  // Esperar a que auth se resuelva
  useEffect(() => {
    if (!isLoading) {
      authResolved.current = true;
      tryNavigate();
    }
  }, [isLoading, tryNavigate]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}
    >
      <StatusBar style="light" />

      <View style={styles.topSpacer} />

      <View style={styles.centerContent}>
        <View style={styles.logoGlow}>
          <ShieldCheck size={96} color={colors.surface} strokeWidth={1.5} />
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        <Text style={styles.subtitle}>{APP_SUBTITLE}</Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.loadingSection}>
          <LoadingDots />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
        <Text style={styles.footerText}>{APP_COPYRIGHT}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSpacer: {
    flex: 1,
  },
  centerContent: {
    alignItems: 'center',
  },
  logoGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surfaceOnPrimary10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 48,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    letterSpacing: 4,
    marginTop: spacing.lg,
  },
  tagline: {
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.surfaceOnPrimary90,
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.surfaceOnPrimary70,
    marginTop: spacing.xs,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 80,
    paddingBottom: spacing.xl,
  },
  loadingSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
  },
  loadingText: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.surfaceOnPrimary80,
  },
  footerText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.surfaceOnPrimary50,
  },
});
