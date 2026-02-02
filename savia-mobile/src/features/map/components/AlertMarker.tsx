import { useState, useEffect } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import {
  ShieldAlert,
  Car,
  Heart,
  Flame,
  Zap,
  Droplets,
  Search,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react-native';
import { useCategoryStore } from '@/features/alerts/store/categoryStore';
import { colors } from '@/shared/theme/colors';

interface AlertMarkerProps {
  coordinate: { latitude: number; longitude: number };
  categoryType: string;
  alertId: string;
  onPress: (alertId: string) => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  robbery: ShieldAlert,
  accident: Car,
  medical: Heart,
  fire: Flame,
  electrical: Zap,
  water: Droplets,
  lost: Search,
  other: HelpCircle,
};

export function AlertMarker({ coordinate, categoryType, alertId, onPress }: AlertMarkerProps) {
  const categories = useCategoryStore((s) => s.categories);
  const categoryColor = categories.find((c) => c.id === categoryType)?.color ?? colors.textSecondary;
  const Icon = CATEGORY_ICONS[categoryType] ?? HelpCircle;

  // En Android, tracksViewChanges debe ser true inicialmente para que el
  // bitmap del marker custom se capture. Después lo desactivamos para performance.
  const [tracked, setTracked] = useState(Platform.OS === 'android');

  useEffect(() => {
    if (tracked) {
      const timer = setTimeout(() => setTracked(false), 500);
      return () => clearTimeout(timer);
    }
  }, [tracked]);

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => onPress(alertId)}
      tracksViewChanges={tracked}
    >
      <View style={[styles.marker, { backgroundColor: categoryColor }]}>
        <Icon size={16} color={colors.surface} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
