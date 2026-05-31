// ============================================================
//  TripMeet — Composants réutilisables
// ============================================================
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';

// ── Bouton principal dégradé ──────────────────────────────────
export function GradientButton({ label, onPress, loading, style }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.gradBtn}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.gradBtnTxt}>{label}</Text>
        }
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ── Bouton outline ────────────────────────────────────────────
export function OutlineButton({ label, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[styles.outlineBtn, style]}>
      <Text style={styles.outlineBtnTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Logo TripMeet ─────────────────────────────────────────────
export function TripMeetLogo({ size = 'md', dark = false }) {
  const iconSize  = size === 'sm' ? 20 : 28;
  const innerSize = size === 'sm' ? 15 : 22;
  const fontSize  = size === 'sm' ? 14 : 17;
  return (
    <View style={styles.logoRow}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={[styles.logoRing, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}
      >
        <View style={[styles.logoInner, { width: innerSize, height: innerSize, borderRadius: innerSize / 2 }]}>
          <Text style={{ fontSize: innerSize * 0.55 }}>✈️</Text>
        </View>
      </LinearGradient>
      <Text style={[styles.logoTxt, { fontSize, color: dark ? Colors.text : '#fff' }]}>
        TripMeet
      </Text>
    </View>
  );
}

// ── Header gradient ───────────────────────────────────────────
export function GradientHeader({ children }) {
  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.gradHeader}
    >
      {children}
    </LinearGradient>
  );
}

// ── Chip / badge ──────────────────────────────────────────────
export function Chip({ label, active, style }) {
  return (
    <View style={[styles.chip, active && styles.chipActive, style]}>
      <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>{label}</Text>
    </View>
  );
}

// ── Input field ───────────────────────────────────────────────
export function InputField({ label, value, onChangeText, placeholder, style, ...rest }) {
  return (
    <View style={[{ marginBottom: Spacing.md }, style]}>
      {label && <Text style={styles.fieldLbl}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.greyText}
        style={[styles.fieldInput, value && styles.fieldInputFilled]}
        {...rest}
      />
    </View>
  );
}

// ── Carte hôtel ───────────────────────────────────────────────
export function HotelTag({ label, type = 'near' }) {
  const isHere = type === 'here';
  return (
    <LinearGradient
      colors={isHere ? [Colors.gradientStart, Colors.gradientEnd] : ['transparent', 'transparent']}
      style={[styles.hotelTag, !isHere && { borderWidth: 1, borderColor: Colors.border }]}
    >
      <Text style={[styles.hotelTagTxt, !isHere && { color: Colors.blueDark }]}>{label}</Text>
    </LinearGradient>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // GradientButton
  gradBtn: {
    paddingVertical: 13,
    borderRadius: Radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradBtnTxt: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.extraBold,
    letterSpacing: 0.3,
  },

  // OutlineButton
  outlineBtn: {
    paddingVertical: 12,
    borderRadius: Radius.xxl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineBtnTxt: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.bold,
  },

  // Logo
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  logoRing: { alignItems: 'center', justifyContent: 'center' },
  logoInner: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  logoTxt: { fontFamily: Fonts.black, letterSpacing: -0.3 },

  // GradientHeader
  gradHeader: { paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16 },

  // Chip
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.bluePale,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  chipTxt: { fontSize: 9, fontFamily: Fonts.bold, color: Colors.blueDark },
  chipTxtActive: { color: '#fff' },

  // Input
  fieldLbl: {
    fontSize: 9,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  fieldInput: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#fff',
    fontSize: 12,
    color: Colors.text,
    fontFamily: Fonts.body,
  },
  fieldInputFilled: { borderColor: Colors.blue },

  // HotelTag
  hotelTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  hotelTagTxt: {
    fontSize: 9,
    fontFamily: Fonts.extraBold,
    color: '#fff',
  },
});
