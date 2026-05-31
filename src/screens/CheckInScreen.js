import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

const STEP_SCAN   = 'scan';
const STEP_MANUAL = 'manual';
const STEP_CONFIRM = 'confirm';

const MOCK_HOTEL = {
  name: 'Mercure Toulouse Centre Wilson',
  stars: 4, brand: 'Accor Hotels',
  address: '7 Rue Labéda, Toulouse',
  room: '412', checkin: '12 août 2025',
  checkout: '17 août 2025', nights: 5,
  solosHere: 4, solosNear: 9,
};

const HOTEL_SUGGESTIONS = [
  { id:1, name:'Mercure Toulouse Centre Wilson', stars:4, brand:'Accor Hotels', address:'7 Rue Labéda, Toulouse', icon:'🏨' },
  { id:2, name:'Mercure Toulouse Aéroport',      stars:4, brand:'Accor Hotels', address:'2 Rue de la Compagnie, Blagnac', icon:'🏩' },
];

export default function CheckInScreen({ navigation }) {
  const { t } = useLanguage();
  const [step,          setStep]          = useState(STEP_SCAN);
  const [hotelSearch,   setHotelSearch]   = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [resaNumber,    setResaNumber]    = useState('');
  const [checkinDate,   setCheckinDate]   = useState('');
  const [checkoutDate,  setCheckoutDate]  = useState('');
  const [loading,       setLoading]       = useState(false);
  const [showPicker,    setShowPicker]    = useState(false);
  const [pickerField,   setPickerField]   = useState(null);

  const handleQRScan = () => setStep(STEP_CONFIRM);

  const handleManualSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(STEP_CONFIRM); }, 1400);
  };

  if (step === STEP_CONFIRM) return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <ScrollView contentContainerStyle={{ padding:20, paddingTop:60 }}>
        <View style={styles.successRing}><Text style={{ fontSize:32 }}>✓</Text></View>
        <Text style={styles.successTitle}>{t('checkinConfirmed')}</Text>
        <Text style={styles.successSub}>{t('connectedHotel')}</Text>

        <View style={[styles.confCard, { shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, elevation:4 }]}>
          <View style={styles.confHotelTop}>
            <View style={styles.confHotelAv}><Text style={{ fontSize:24 }}>🏨</Text></View>
            <View style={{ flex:1 }}>
              <Text style={styles.confHotelName}>{MOCK_HOTEL.name}</Text>
              <Text style={styles.confHotelStars}>{'★'.repeat(MOCK_HOTEL.stars)} · {MOCK_HOTEL.brand}</Text>
              <Text style={styles.confHotelLoc}>📍 {MOCK_HOTEL.address}</Text>
            </View>
            <View style={styles.confBadge}><Text style={styles.confBadgeTxt}>{t('verified')}</Text></View>
          </View>
          <View style={styles.confGrid}>
            {[['Chambre', MOCK_HOTEL.room],[t('checkin'), MOCK_HOTEL.checkin],[t('checkout'), MOCK_HOTEL.checkout],['Durée', `${MOCK_HOTEL.nights} nuits`]].map(([lbl, val]) => (
              <View key={lbl} style={styles.confDetail}>
                <Text style={styles.confDetailLbl}>{lbl}</Text>
                <Text style={styles.confDetailVal}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient colors={['#E8327A','#F07030']} style={styles.solosTeaser}>
          <View style={styles.solosAvs}>
            {['#FFD4E8','#D4EEF7','#D4FFD4'].map((bg, i) => (
              <View key={i} style={[styles.soloAv, { backgroundColor:bg, marginLeft: i > 0 ? -10 : 0 }]}>
                <Text>🙂</Text>
              </View>
            ))}
          </View>
          <View style={{ flex:1, marginLeft:12 }}>
            <Text style={styles.solosTitle}>{MOCK_HOTEL.solosHere} {t('solos')} · {t('inMyHotel')}</Text>
            <Text style={styles.solosSub}>+ {MOCK_HOTEL.solosNear} {t('nearby')}</Text>
          </View>
          <TouchableOpacity style={styles.solosBtn} onPress={() => navigation.navigate('Hotel')}>
            <Text style={styles.solosBtnTxt}>Voir →</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity onPress={() => navigation.navigate('Hotel')}>
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.btn}>
            <Text style={styles.btnTxt}>🌍 {t('exploreSolos')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  if (step === STEP_MANUAL) return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
        <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setStep(STEP_SCAN)} style={styles.backBtn}>
              <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
            </TouchableOpacity>
            <View style={styles.logoRow}><View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View><Text style={styles.logoTxt}>TripMeet</Text></View>
            <View style={{ width:36 }} />
          </View>
          <Text style={styles.headerTitle}>{t('hotelCheckin')} 🏨</Text>
          <Text style={styles.headerSub}>{t('connectHotel')}</Text>
          <View style={styles.headerWave} />
        </LinearGradient>
        <ScrollView style={{ padding:16 }} keyboardShouldPersistTaps="handled">
          <View style={styles.methodTabs}>
            <TouchableOpacity style={styles.methodTab} onPress={() => setStep(STEP_SCAN)}>
              <Text style={styles.methodTabTxt}>📷 {t('scanQR')}</Text>
            </TouchableOpacity>
            <LinearGradient colors={['#E8327A','#F07030']} style={styles.methodTab}>
              <Text style={styles.methodTabTxtActive}>🔢 {t('resaNumber')}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.label}>{t('hotelName')}</Text>
          <TextInput style={[styles.input, hotelSearch && styles.inputFilled]} value={hotelSearch} onChangeText={setHotelSearch} placeholder="Ex. Mercure Toulouse..." placeholderTextColor="#ccc" />

          {HOTEL_SUGGESTIONS.filter(h => !hotelSearch || h.name.toLowerCase().includes(hotelSearch.toLowerCase())).map(h => (
            <TouchableOpacity key={h.id} style={[styles.hotelResult, selectedHotel?.id === h.id && styles.hotelResultSelected]} onPress={() => { setSelectedHotel(h); setHotelSearch(h.name); }}>
              <Text style={{ fontSize:22 }}>{h.icon}</Text>
              <View style={{ flex:1 }}>
                <Text style={styles.hotelResultName}>{h.name}</Text>
                <Text style={styles.hotelResultStars}>{'★'.repeat(h.stars)} · {h.brand}</Text>
                <Text style={styles.hotelResultLoc}>📍 {h.address}</Text>
              </View>
              {selectedHotel?.id === h.id
                ? <View style={styles.selectedBadge}><Text style={{ color:'#fff', fontSize:11 }}>✓</Text></View>
                : <Text style={{ fontSize:18, color:'#5E9DB8' }}>›</Text>}
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop:12 }]}>{t('resaNumber')}</Text>
          <TextInput style={[styles.input, resaNumber && styles.inputFilled]} value={resaNumber} onChangeText={setResaNumber} placeholder="Ex. MCR-2025-48291" placeholderTextColor="#ccc" autoCapitalize="characters" />

          <View style={styles.dateRow}>
            <View style={{ flex:1 }}>
              <Text style={styles.label}>{t('checkin')}</Text>
              <TextInput style={[styles.input, checkinDate && styles.inputFilled]} value={checkinDate} onChangeText={setCheckinDate} placeholder="12 août 2025" placeholderTextColor="#ccc" />
            </View>
            <View style={{ width:10 }} />
            <View style={{ flex:1 }}>
              <Text style={styles.label}>{t('checkout')}</Text>
              <TextInput style={[styles.input, checkoutDate && styles.inputFilled]} value={checkoutDate} onChangeText={setCheckoutDate} placeholder="17 août 2025" placeholderTextColor="#ccc" />
            </View>
          </View>

          <View style={styles.infoBanner}>
            <Text>ℹ️</Text>
            <Text style={styles.infoTxt}>Ton numéro de réservation confirme que tu séjournes bien dans cet hôtel.</Text>
          </View>

          <TouchableOpacity onPress={handleManualSubmit} disabled={loading}>
            <LinearGradient colors={['#E8327A','#F07030']} style={[styles.btn, loading && { opacity:0.7 }]}>
              <Text style={styles.btnTxt}>🏨 {t('validateCheckin')}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={{ height:40 }} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}><View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View><Text style={styles.logoTxt}>TripMeet</Text></View>
          <View style={{ width:36 }} />
        </View>
        <Text style={styles.headerTitle}>{t('hotelCheckin')} 🏨</Text>
        <Text style={styles.headerSub}>{t('connectHotel')}</Text>
        <View style={styles.headerWave} />
      </LinearGradient>

      <ScrollView style={{ padding:16 }}>
        <View style={styles.methodTabs}>
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.methodTab}>
            <Text style={styles.methodTabTxtActive}>📷 {t('scanQR')}</Text>
          </LinearGradient>
          <TouchableOpacity style={styles.methodTab} onPress={() => setStep(STEP_MANUAL)}>
            <Text style={styles.methodTabTxt}>🔢 {t('resaNumber')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleQRScan}>
          <View style={styles.qrZone}>
            <Text style={{ fontSize:60 }}>📷</Text>
            <Text style={{ color:'#fff', marginTop:12, fontWeight:'bold' }}>{t('scanInstruction')}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.orLine} /><Text style={styles.orTxt}>{t('orText')}</Text><View style={styles.orLine} />
        </View>

        <TouchableOpacity style={styles.manualBtn} onPress={() => setStep(STEP_MANUAL)}>
          <Text style={styles.manualBtnTxt}>🔢 {t('enterResa')}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection:'row', gap:6, marginTop:12 }}>
          <Text>🔒</Text>
          <Text style={{ color:'#5E9DB8', fontSize:11, flex:1 }}>Ton numéro de chambre n'est jamais partagé.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  logoRow: { flexDirection:'row', alignItems:'center', gap:6 },
  logoRing: { width:24, height:24, borderRadius:12, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  headerTitle: { color:'#fff', fontSize:20, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,0.72)', fontSize:11, marginTop:2 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  methodTabs: { flexDirection:'row', backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', overflow:'hidden', marginBottom:14 },
  methodTab: { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:11 },
  methodTabTxt: { fontWeight:'800', fontSize:11, color:'#5E9DB8' },
  methodTabTxtActive: { fontWeight:'800', fontSize:11, color:'#fff' },
  qrZone: { backgroundColor:'#0D1B2A', borderRadius:18, height:200, alignItems:'center', justifyContent:'center', marginBottom:16 },
  orRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:16 },
  orLine: { flex:1, height:1, backgroundColor:'#B5DCEA' },
  orTxt: { color:'#5E9DB8', fontWeight:'800', fontSize:12 },
  manualBtn: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:26, paddingVertical:13, alignItems:'center', backgroundColor:'#fff' },
  manualBtnTxt: { color:'#2AABDC', fontWeight:'800', fontSize:13 },
  btn: { borderRadius:26, paddingVertical:14, alignItems:'center', marginTop:16 },
  btnTxt: { color:'#fff', fontWeight:'900', fontSize:14 },
  label: { fontSize:10, fontWeight:'800', color:'#0D3547', textTransform:'uppercase', letterSpacing:1, marginBottom:5 },
  input: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:13, padding:11, fontSize:13, color:'#0D3547', backgroundColor:'#fff', marginBottom:8 },
  inputFilled: { borderColor:'#2AABDC' },
  dateRow: { flexDirection:'row', marginTop:4 },
  hotelResult: { backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', padding:11, flexDirection:'row', alignItems:'center', gap:10, marginTop:8 },
  hotelResultSelected: { borderColor:'#2AABDC', backgroundColor:'#EAF7FD' },
  hotelResultName: { fontSize:12, fontWeight:'900', color:'#0D3547' },
  hotelResultStars: { fontSize:9, color:'#C9A84C' },
  hotelResultLoc: { fontSize:9, color:'#5E9DB8', marginTop:1 },
  selectedBadge: { width:20, height:20, borderRadius:10, backgroundColor:'#2AABDC', alignItems:'center', justifyContent:'center' },
  infoBanner: { flexDirection:'row', gap:8, backgroundColor:'#EAF7FD', borderRadius:12, padding:12, borderWidth:1, borderColor:'#B5DCEA', marginTop:10, alignItems:'flex-start' },
  infoTxt: { flex:1, fontSize:11, color:'#1A8BB8', lineHeight:17, fontWeight:'600' },
  successRing: { width:70, height:70, borderRadius:35, backgroundColor:'#EAFAF1', borderWidth:3, borderColor:'#2ECC71', alignItems:'center', justifyContent:'center', alignSelf:'center', marginBottom:16 },
  successTitle: { fontSize:22, fontWeight:'900', color:'#0D3547', textAlign:'center', marginBottom:8 },
  successSub: { fontSize:13, color:'#5E9DB8', textAlign:'center', marginBottom:20, lineHeight:20 },
  confCard: { backgroundColor:'#fff', borderRadius:18, borderWidth:1.5, borderColor:'#B5DCEA', padding:13, marginBottom:12 },
  confHotelTop: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  confHotelAv: { width:48, height:48, borderRadius:12, backgroundColor:'#FFF8E8', borderWidth:1, borderColor:'#F0E0B0', alignItems:'center', justifyContent:'center' },
  confHotelName: { fontSize:13, fontWeight:'900', color:'#0D3547' },
  confHotelStars: { fontSize:9, color:'#C9A84C', marginTop:1 },
  confHotelLoc: { fontSize:9, color:'#5E9DB8', marginTop:1 },
  confBadge: { backgroundColor:'#EAFAF1', borderWidth:1, borderColor:'#A8E6C0', borderRadius:20, paddingHorizontal:8, paddingVertical:4 },
  confBadgeTxt: { fontSize:9, fontWeight:'800', color:'#2ECC71' },
  confGrid: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  confDetail: { flex:1, minWidth:'44%', backgroundColor:'#FDF9F4', borderRadius:10, padding:9 },
  confDetailLbl: { fontSize:8, fontWeight:'800', color:'#5E9DB8', letterSpacing:0.8, textTransform:'uppercase', marginBottom:3 },
  confDetailVal: { fontSize:13, fontWeight:'900', color:'#0D3547' },
  solosTeaser: { borderRadius:16, padding:13, flexDirection:'row', alignItems:'center', marginBottom:12 },
  solosAvs: { flexDirection:'row' },
  soloAv: { width:34, height:34, borderRadius:17, borderWidth:2, borderColor:'rgba(255,255,255,0.5)', alignItems:'center', justifyContent:'center' },
  solosTitle: { fontSize:13, fontWeight:'900', color:'#fff' },
  solosSub: { fontSize:10, color:'rgba(255,255,255,0.75)', marginTop:2 },
  solosBtn: { backgroundColor:'#fff', borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  solosBtnTxt: { fontSize:11, fontWeight:'800', color:'#E8327A' },
});