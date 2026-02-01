import { useState, useCallback, useRef } from 'react';
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

// Centro aproximado de Atalaya, Ucayali, Perú
const DEFAULT_LOCATION = { latitude: -10.7291, longitude: -73.7538 };

export function LocateAlertScreen() {
  const navigation = useNavigation<NavigationProp>();
  const storeLocation = useCreateAlertStore((s) => s.location);
  const storeAddress = useCreateAlertStore((s) => s.address);
  const setStoreLocation = useCreateAlertStore((s) => s.setLocation);
  const setStoreAddress = useCreateAlertStore((s) => s.setAddress);
  const reset = useCreateAlertStore((s) => s.reset);

  // Si ya había ubicación guardada en el store, usarla; si no, mostrar Atalaya por defecto
  const [selectedLocation, setSelectedLocation] = useState(storeLocation ?? DEFAULT_LOCATION);
  const [address, setAddress] = useState(storeAddress);
  const [searchText, setSearchText] = useState('');
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  // Control de scroll: se desactiva al tocar el mapa
  const [scrollEnabled, setScrollEnabled] = useState(true);
  // Incrementar para forzar recentrado del mapa (GPS / búsqueda)
  const [mapKey, setMapKey] = useState(0);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // GPS: solo cuando el usuario presiona el botón
  const fetchLocation = useCallback(async () => {
    setIsLoadingGPS(true);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación para continuar.');
        return;
      }
      const coords = await getCurrentLocation();
      setSelectedLocation(coords);
      setMapKey((k) => k + 1);
      const addr = await reverseGeocode(coords.latitude, coords.longitude);
      setAddress(addr);
    } catch (error) {
      console.error('[Location] Error:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación. Intenta de nuevo.');
    } finally {
      setIsLoadingGPS(false);
    }
  }, []);

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
        setSelectedLocation(result);
        setMapKey((k) => k + 1);
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

  // Cuando el usuario arrastra el mapa: actualizar ubicación + reverse geocode con debounce
  const handleMapLocationChange = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      try {
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
      } catch (error) {
        console.error('[Location] Error reverse geocode:', error);
      }
    }, 600);
  }, []);

  const handleNext = () => {
    if (!selectedLocation || !address) {
      Alert.alert('Ubicación requerida', 'Usa tu ubicación actual o arrastra el mapa para seleccionar dónde ocurre la emergencia.');
      return;
    }
    setStoreLocation(selectedLocation);
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
        scrollEnabled={scrollEnabled}
      >
        <Text style={styles.question}>¿Dónde ocurre la emergencia?</Text>

        {/* Mapa interactivo */}
        <View style={styles.section}>
          <MapPlaceholder
            key={mapKey}
            hasLocation={true}
            latitude={selectedLocation.latitude}
            longitude={selectedLocation.longitude}
            height={280}
            onLocationChange={handleMapLocationChange}
            onTouchStart={() => setScrollEnabled(false)}
            onTouchEnd={() => setScrollEnabled(true)}
          />
          <Text style={styles.mapHint}>Arrastra el mapa para ajustar la ubicación</Text>
        </View>

        {/* Dirección detectada */}
        {address ? (
          <View style={styles.section}>
            <LocationCard
              address={address}
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
            />
          </View>
        ) : null}

        {/* Botón GPS */}
        <View style={styles.section}>
          <GPSButton onPress={fetchLocation} loading={isLoadingGPS} />
        </View>

        {/* Buscador de dirección */}
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
          disabled={!address}
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
  mapHint: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
