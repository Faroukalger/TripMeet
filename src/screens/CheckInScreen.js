import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const STEP_SCAN = 'scan';
const STEP_MANUAL = 'manual';
const STEP_CONFIRM = 'confirm';

export default function CheckInScreen({ navigation }) {
  const [step, setStep] = useState(STEP_SCAN);
  const [resaNumber, setResaNumber] = useState('');

  if (step === STEP_CONFIRM) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FDF9F4' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
        <View style={styles.successRing}>
          <Text style={{ fontSize: 32 }}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Check-in confirmé ! 🎉</Text>
        <Text style={styles.successSub}>Tu es connecté à ton hôtel.{'\n'}Découvre les voyageurs solo près de toi.</Text>
        <View style={styles.confCard}>
          <Text style={styles.confHotelName}>Mercure Toulouse Centre Wilson</Text>
          <Text style={styles.confDetail}>★★★★ · Chambre 412</Text>
          <Text style={styles.confDetail}>📅 12 août → 17 août 2025</Text>
        </View>
        <LinearGradient colors={['#E8327A','#F07030']} style={styles.solosTeaser}>
          <Text style={styles.solosTitle}>4 solos dans ton hôtel 🎉</Text>
          <Text style={styles.solosSub}>+ 9 dans un rayon de 500 m</Text>
        </LinearGradient>
        <TouchableOpacity onPress={() => navigation.navigate('Hotel')}>
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.btn}>
            <Text style={styles.btnTxt}>🌍 Explorer les voyageurs solo</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  if (step === STEP_MANUAL) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FDF9F4' }}>
      <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
        <TouchableOpacity onPress={() => setStep(STEP_SCAN)} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>N° Réservation 🔢</Text>
        <Text style={styles.headerSub}>Saisis ton numéro de réservation</Text>
      </LinearGradient>
      <ScrollView style={{ padding: 16 }}>
        <Text style={styles.label}>Nom de l'hôtel</Text>
        <TextInput style={styles.input} placeholder="Ex. Mercure Toulouse..." placeholderTextColor="#ccc" />
        <Text style={styles.label}>N° de réservation</Text>
        <TextInput style={styles.input} value={resaNumber} onChangeText={setResaNumber} placeholder="Ex. MCR-2025-48291" placeholderTextColor="#ccc" />
        <Text style={styles.label}>Check-in</Text>
        <TextInput style={styles.input} placeholder="12 août 2025" placeholderTextColor="#ccc" />
        <Text style={styles.label}>Check-out</Text>
        <TextInput style={styles.input} placeholder="17 août 2025" placeholderTextColor="#ccc" />
        <TouchableOpacity onPress={() => setStep(STEP_CONFIRM)}>
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.btn}>
            <Text style={styles.btnTxt}>🏨 Valider le check-in</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FDF9F4' }}>
      <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 20 }}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-in hôtel 🏨</Text>
        <Text style={styles.headerSub}>Connecte-toi à ton hôtel</Text>
      </LinearGradient>
      <ScrollView style={{ padding: 16 }}>
        <View style={styles.tabs}>
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.tabActive}>
            <Text style={styles.tabActiveTxt}>📷 Scanner QR</Text>
          </LinearGradient>
          <TouchableOpacity style={styles.tabInactive} onPress={() => setStep(STEP_MANUAL)}>
            <Text style={styles.tabInactiveTxt}>🔢 N° Réservation</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setStep(STEP_CONFIRM)}>
          <View style={styles.qrZone}>
            <Text style={{ fontSize: 60 }}>📷</Text>
            <Text style={{ color: '#fff', marginTop: 12, fontWeight: 'bold' }}>Appuie pour simuler un scan</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orTxt}>OU</Text>
          <View style={styles.orLine} />
        </View>
        <TouchableOpacity style={styles.manualBtn} onPress={() => setStep(STEP_MANUAL)}>
          <Text style={styles.manualBtnTxt}>🔢 Saisir le numéro de réservation</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
          <Text>🔒</Text>
          <Text style={{ color: '#5E9DB8', fontSize: 11, flex: 1 }}>Ton numéro de chambre n'est jamais partagé avec les autres voyageurs.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingTop: 50 },
  backBtn: { marginBottom: 8 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1.5, borderColor: '#B5DCEA', overflow: 'hidden', marginBottom: 16 },
  tabActive: { flex: 1, alignItems: 'center', paddingVertical: 11 },
  tabActiveTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  tabInactive: { flex: 1, alignItems: 'center', paddingVertical: 11 },
  tabInactiveTxt: { color: '#5E9DB8', fontWeight: '800', fontSize: 13 },
  qrZone: { backgroundColor: '#0D1B2A', borderRadius: 18, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: '#B5DCEA' },
  orTxt: { color: '#5E9DB8', fontWeight: '800', fontSize: 12 },
  manualBtn: { borderWidth: 1.5, borderColor: '#B5DCEA', borderRadius: 26, paddingVertical: 13, alignItems: 'center', backgroundColor: '#fff' },
  manualBtnTxt: { color: '#2AABDC', fontWeight: '800', fontSize: 13 },
  btn: { borderRadius: 26, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  btnTxt: { color: '#fff', fontWeight: '900', fontSize: 14 },
  label: { fontSize: 11, fontWeight: '800', color: '#0D3547', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, marginTop: 12 },
  input: { borderWidth: 1.5, borderColor: '#2AABDC', borderRadius: 12, padding: 11, fontSize: 13, color: '#0D3547', backgroundColor: '#fff' },
  successRing: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#EAFAF1', borderWidth: 3, borderColor: '#2ECC71', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#0D3547', textAlign: 'center', marginBottom: 8 },
  successSub: { fontSize: 13, color: '#5E9DB8', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  confCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#B5DCEA', padding: 16, marginBottom: 16 },
  confHotelName: { fontSize: 15, fontWeight: '900', color: '#0D3547', marginBottom: 6 },
  confDetail: { fontSize: 12, color: '#5E9DB8', marginTop: 4 },
  solosTeaser: { borderRadius: 16, padding: 16, marginBottom: 16 },
  solosTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
  solosSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
});
