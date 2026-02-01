import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, Search } from 'lucide-react-native';
import { HeaderMobile } from '@/shared/components/HeaderMobile';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { ButtonPrimary } from '@/shared/components/ButtonPrimary';
import { InputField } from '@/shared/components/InputField';
import { MapPlaceholder } from '@/features/alerts/components/MapPlaceholder';
import { LocationCard } from '@/features/alerts/components/LocationCard';
import { GPSButton } from '@/features/alerts/components/GPSButton';
import { useCreateAlertStore } from '@/features/alerts/store/createAlertStore';
import {
  requestLocationPermission,
  getCurrentLocation,
  reverseGeocode,
  geocodeAddress,
} from '@/features/alerts/services/locationService';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing } from '@/shared/theme/spacing';
import type { CitizenStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<CitizenStackParamList>;

export function LocateAlertScreen() {
  const navigation = useNavigation<NavigationProp>();
  const storeLocation = useCreateAlertStore((s) => s.location);
  const storeAddress = useCreateAlertStore((s) => s.address);
  const setStoreLocation = useCreateAlertStore((s) => s.setLocation);
  const setStoreAddress = useCreateAlertStore((s) => s.setAddress);
  const reset = useCreateAlertStore((s) => s.reset);

  const [location, setLocation] = useState(storeLocation);
  const [address, setAddress] = useState(storeAddress);
  const [searchText, setSearchText] = useState('');
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);

  const fetchLocation = useCallback(async () => {
    setIsLoadingGPS(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para continuar.');
        return;
      }
      const coords = await getCurrentLocation();
      setLocation(coords);
      const addr = await reverseGeocode(coords.latitude, coords.longitude);
      setAddress(addr);
    } catch (error) {
      console.error('[Location] Error:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación. Intenta de nuevo.');
    } finally {
      setIsLoadingGPS(false);
    }
  }, []);

  useEffect(() => {
    if (!location) {
      fetchLocation();
    }
  }, [fetchLocation, location]);

  const handleCancel = () => {
    Alert.alert(
      'Cancelar alerta',
      '¿Estás seguro de que deseas cancelar? Se perderá el progreso.',
      [
        { text: 'Continuar', style: 'cancel' },
        {
          text: 'Cancelar',
          style: 'destructive',
          onPress: () => {
            reset();
            navigation.popToTop();
          },
        },
      ],
    );
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setIsLoadingGPS(true);
    try {
      const result = await geocodeAddress(searchText.trim());
      if (result) {
        setLocation(result);
        const addr = await reverseGeocode(result.latitude, result.longitude);
        setAddress(addr);
        setSearchText('');
      } else {
        Alert.alert('No encontrada', 'No se encontró la dirección. Intenta con otra búsqueda.');
      }
    } catch (error) {
      console.error('[Location] Error en búsqueda:', error);
    } finally {
      setIsLoadingGPS(false);
    }
  };

  const handleNext = () => {
    if (!location || !address) return;
    setStoreLocation(location);
    setStoreAddress(address);
    console.log('[Alerts] Ubicación guardada:', address);
    navigation.navigate('ConfirmAlert');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMobile
        title="Nueva Alerta"
        leftSlot="back"
        onLeftPress={() => navigation.goBack()}
        rightText="Cancelar"
        onRightTextPress={handleCancel}
      />
      <ProgressBar currentStep={3} totalSteps={4} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.question}>¿Dónde ocurre la emergencia?</Text>

        <View style={styles.section}>
          <MapPlaceholder hasLocation={!!location} />
        </View>

        {location && (
          <View style={styles.section}>
            <LocationCard
              address={address}
              latitude={location.latitude}
              longitude={location.longitude}
            />
          </View>
        )}

        <View style={styles.section}>
          <GPSButton onPress={fetchLocation} loading={isLoadingGPS} />
        </View>

        <View style={styles.section}>
          <InputField
            label=""
            iconLeft={Search}
            placeholder="Buscar dirección..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomSection}>
        <ButtonPrimary
          title="SIGUIENTE"
          icon={ArrowRight}
          onPress={handleNext}
          disabled={!location}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  question: {
    fontSize: fontSize.h3,
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
