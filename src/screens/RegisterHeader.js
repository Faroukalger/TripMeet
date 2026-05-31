import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterHeader({ children }) {
  return (
    <ImageBackground
      source={require('../../assets/003.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(232,50,122,0.85)','rgba(240,112,48,0.85)']}
        style={styles.overlay}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { overflow:'hidden' },
  overlay: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
});
