import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

  return {
    ...config,
    name: 'SAVIA',
    slug: 'savia-mobile',
    plugins: [
      ...(config.plugins || []),
    ],
    ios: {
      ...config.ios,
      config: {
        googleMapsApiKey,
      },
    },
    android: {
      ...config.android,
      config: {
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
