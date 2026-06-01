import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function TripMeetLogo({ size = 24, showText = true }) {
  return (
    <View style={styles.row}>
      <Image
        source={require('../../assets/Logo.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
      {showText && <Text style={[styles.txt, { fontSize: size * 0.67 }]}>TripMeet</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection:'row', alignItems:'center', gap:6 },
  txt: { color:'#fff', fontWeight:'900' },
});
