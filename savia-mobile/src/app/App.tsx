import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck } from 'lucide-react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import { APP_NAME, APP_TAGLINE, APP_SUBTITLE, APP_COPYRIGHT, SPLASH_DURATION_MS } from '@/shared/config/constants';

SplashScreen.preventAutoHideAsync().catch(() => {});

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
    <View style={splashStyles.dotsContainer}>
      {[dot1, dot2, dot3].map((opacity, i) => (
        <Animated.View key={i} style={[splashStyles.dot, { opacity }]} />
      ))}
    </View>
  );
}

function SplashView({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={splashStyles.container}
    >
      <StatusBar style="light" />

      <View style={splashStyles.topSpacer} />

      <View style={splashStyles.centerContent}>
        <View style={splashStyles.logoGlow}>
          <ShieldCheck size={96} color={colors.surface} strokeWidth={1.5} />
        </View>
        <Text style={splashStyles.appName}>{APP_NAME}</Text>
        <Text style={splashStyles.tagline}>{APP_TAGLINE}</Text>
        <Text style={splashStyles.subtitle}>{APP_SUBTITLE}</Text>
      </View>

      <View style={splashStyles.bottomSection}>
        <View style={splashStyles.loadingSection}>
          <LoadingDots />
          <Text style={splashStyles.loadingText}>Cargando...</Text>
        </View>
        <Text style={splashStyles.footerText}>{APP_COPYRIGHT}</Text>
      </View>
    </LinearGradient>
  );
}

function LoginPlaceholder() {
  return (
    <View style={loginStyles.container}>
      <StatusBar style="dark" />
      <ShieldCheck size={64} color={colors.primary} />
      <Text style={loginStyles.title}>{APP_NAME}</Text>
      <Text style={loginStyles.subtitle}>Pantalla de Login</Text>
      <Text style={loginStyles.hint}>
        (Placeholder — se implementará en la siguiente rama)
      </Text>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return <SplashView onFinish={() => setShowSplash(false)} />;
  }

  return <LoginPlaceholder />;
}

const splashStyles = StyleSheet.create({
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

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.h1,
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.h4,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  hint: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
