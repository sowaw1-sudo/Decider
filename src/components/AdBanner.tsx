import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';

/**
 * Placeholder AdMob banner — replace with react-native-google-mobile-ads
 * <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.BANNER} />
 * when AdMob app IDs are configured in app.json.
 *
 * Google Mobile Ads SDK: Apache 2.0 license (no breach)
 */
export default function AdBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.adTag}>
        <Text style={styles.adTagText}>Ad</Text>
      </View>
      <Text style={styles.placeholder}>AdMob Banner</Text>
      <Text style={styles.sub}>Configure app IDs in app.json to enable live ads</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    backgroundColor: '#0D0D1A',
    borderTopWidth: 1,
    borderTopColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  adTag: {
    backgroundColor: '#333',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  adTagText: {
    color: '#888',
    fontSize: 9,
    fontWeight: '700',
  },
  placeholder: {
    color: '#555',
    fontSize: 12,
  },
  sub: {
    color: '#3a3a5a',
    fontSize: 10,
  },
});
