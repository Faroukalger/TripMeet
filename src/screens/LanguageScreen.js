import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';

export default function LanguageScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();

  const selectLanguage = async (code) => {
    await setLanguage(code);
    navigation.navigate('Hotel');
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
            <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
            <Text style={styles.logoTxt}>TripMeet</Text>
          </View>
          <View style={{ width:34 }} />
        </View>
        <Text style={styles.headerTitle}>🌍 {t('selectLanguage')}</Text>
        <Text style={styles.headerSub}>Choose · اختر · Wählen · Choisir</Text>
        <View style={styles.headerWave} />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding:16 }}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.langCard, language === lang.code && styles.langCardActive]}
            onPress={() => selectLanguage(lang.code)}
          >
            <Text style={styles.langFlag}>{lang.flag}</Text>
            <View style={{ flex:1 }}>
              <Text style={[styles.langName, language === lang.code && { color:'#1A8BB8' }]}>
                {lang.name}
              </Text>
              {lang.rtl && <Text style={styles.rtlBadge}>RTL · De droite à gauche</Text>}
            </View>
            {language === lang.code && (
              <LinearGradient colors={['#E8327A','#F07030']} style={styles.checkBadge}>
                <Text style={{ color:'#fff', fontSize:14, fontWeight:'800' }}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.infoBanner}>
          <Text>ℹ️</Text>
          <Text style={styles.infoTxt}>
            La langue sélectionnée sera mémorisée pour tes prochaines visites.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  logoRing: { width:24, height:24, borderRadius:12, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  headerTitle: { color:'#fff', fontSize:20, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,0.75)', fontSize:10, marginTop:2 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  langCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:16, flexDirection:'row', alignItems:'center', gap:14, marginBottom:10 },
  langCardActive: { borderColor:'#2AABDC', backgroundColor:'#EAF7FD' },
  langFlag: { fontSize:36 },
  langName: { fontSize:16, fontWeight:'800', color:'#0D3547' },
  rtlBadge: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  checkBadge: { width:30, height:30, borderRadius:15, alignItems:'center', justifyContent:'center' },
  infoBanner: { flexDirection:'row', gap:8, backgroundColor:'#EAF7FD', borderRadius:12, padding:12, borderWidth:1, borderColor:'#B5DCEA', marginTop:6, alignItems:'flex-start' },
  infoTxt: { flex:1, fontSize:11, color:'#1A8BB8', lineHeight:17, fontWeight:'600' },
});
