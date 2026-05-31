import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';

export default function LanguageScreen({ navigation }) {
  const { language, setLanguage, t } = useLanguage();

  const selectLanguage = (code) => {
    setLanguage(code);
    navigation.goBack();
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
        <Text style={styles.headerSub}>Choose your language · اختر لغتك · Wähle deine Sprache</Text>
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
                <Text style={{ color:'#fff', fontSize:12, fontWeight:'800' }}>✓</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        ))}
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
  langFlag: { fontSize:32 },
  langName: { fontSize:16, fontWeight:'800', color:'#0D3547' },
  rtlBadge: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  checkBadge: { width:28, height:28, borderRadius:14, alignItems:'center', justifyContent:'center' },
});
