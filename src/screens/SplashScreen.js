import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../i18n/LanguageContext';

export default function SplashScreen({ navigation }) {
  const { t } = useLanguage();
  return (
    <View style={{ flex:1 }}>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../../assets/001.png')} style={{ flex:1 }} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.2)','rgba(0,0,0,0.5)','rgba(0,0,0,0.85)']} style={{ flex:1 }}>
          <SafeAreaView style={{ flex:1 }}>
            <View style={styles.logoWrap}>
              <LinearGradient colors={['#E8327A','#F07030']} style={styles.logoRing}>
                <View style={styles.logoInner}>
                  <Text style={{ fontSize:28 }}>✈️</Text>
                </View>
              </LinearGradient>
              <Text style={styles.logoTxt}>TripMeet</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.tagline}>{t('splashTagline')}</Text>
              <Text style={styles.subTagline}>{t('splashSub')}</Text>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.85}>
                <LinearGradient colors={['#E8327A','#F07030']} start={{ x:0, y:0 }} end={{ x:1, y:0 }} style={styles.btnPrimary}>
                  <Text style={styles.btnPrimaryTxt}>✈️ {t('startAdventure')}</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btnSecondary} activeOpacity={0.75}>
                <Text style={styles.btnSecondaryTxt}>{t('alreadyAccount')}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: { alignItems:'center', paddingTop:60, gap:10 },
  logoRing: { width:70, height:70, borderRadius:35, alignItems:'center', justifyContent:'center' },
  logoInner: { width:56, height:56, borderRadius:28, backgroundColor:'#fff', alignItems:'center', justifyContent:'center' },
  logoTxt: { fontSize:28, fontWeight:'900', color:'#fff', letterSpacing:-0.5 },
  body: { flex:1, alignItems:'center', justifyContent:'flex-end', paddingHorizontal:30, paddingBottom:30 },
  tagline: { fontSize:26, fontWeight:'900', color:'#fff', textAlign:'center', lineHeight:34, marginBottom:12 },
  subTagline: { fontSize:14, color:'rgba(255,255,255,0.8)', textAlign:'center', lineHeight:22 },
  footer: { paddingHorizontal:24, paddingBottom:40, gap:12 },
  btnPrimary: { borderRadius:28, paddingVertical:16, alignItems:'center', justifyContent:'center' },
  btnPrimaryTxt: { color:'#fff', fontSize:16, fontWeight:'900', letterSpacing:0.3 },
  btnSecondary: { borderRadius:28, paddingVertical:15, alignItems:'center', borderWidth:2, borderColor:'rgba(255,255,255,0.5)', backgroundColor:'rgba(255,255,255,0.1)' },
  btnSecondaryTxt: { color:'#fff', fontSize:15, fontWeight:'700' },
});