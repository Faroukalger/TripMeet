import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

export default function LoginScreen({ navigation }) {
  const { t } = useLanguage();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Remplis tous les champs.'); return; }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigation.navigate('Hotel');
    } catch (e) {
      setError(e.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground source={require('../../assets/002.png')} style={{ flex:1 }} resizeMode="cover">
        <LinearGradient colors={['rgba(0,0,0,0.3)','rgba(0,0,0,0.75)']} style={{ flex:1 }}>
          <SafeAreaView style={{ flex:1 }}>
            <ScrollView contentContainerStyle={{ flexGrow:1, justifyContent:'flex-end', padding:20 }} keyboardShouldPersistTaps="handled">

              <View style={styles.logoWrap}>
                <LinearGradient colors={['#E8327A','#F07030']} style={styles.logoRing}>
                  <View style={styles.logoInner}><Text style={{ fontSize:22 }}>✈️</Text></View>
                </LinearGradient>
                <Text style={styles.logoTxt}>TripMeet</Text>
                <Text style={styles.logoSub}>{t('welcomeBack')}</Text>
              </View>

              <View style={styles.card}>
                {error ? <View style={styles.errorBanner}><Text style={styles.errorTxt}>⚠️ {error}</Text></View> : null}

                <Text style={styles.label}>{t('email')}</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="exemple@email.com" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" />

                <View style={styles.labelRow}>
                  <Text style={styles.label}>{t('password')}</Text>
                  <TouchableOpacity><Text style={styles.forgotTxt}>{t('forgotPassword')}</Text></TouchableOpacity>
                </View>
                <View style={styles.passWrap}>
                  <TextInput style={[styles.input, { flex:1, borderWidth:0, marginBottom:0 }]} value={password} onChangeText={setPassword} placeholder="Min. 8 caractères" placeholderTextColor="#aaa" secureTextEntry={!showPass} />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding:10 }}>
                    <Text style={{ fontSize:18 }}>{showPass ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleLogin} disabled={loading}>
                  <LinearGradient colors={['#E8327A','#F07030']} style={[styles.loginBtn, loading && { opacity:0.7 }]}>
                    <Text style={styles.loginBtnTxt}>{loading ? t('loggingIn') : `🚀 ${t('login')}`}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.registerRow}>
                <Text style={styles.registerTxt}>{t('noAccount')} </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerLink}>{t('register')}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
                <Text style={styles.backTxt}>‹ Retour</Text>
              </TouchableOpacity>

            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoWrap: { alignItems:'center', marginBottom:24, gap:8 },
  logoRing: { width:64, height:64, borderRadius:32, alignItems:'center', justifyContent:'center' },
  logoInner: { width:50, height:50, borderRadius:25, backgroundColor:'#fff', alignItems:'center', justifyContent:'center' },
  logoTxt: { fontSize:26, fontWeight:'900', color:'#fff' },
  logoSub: { fontSize:13, color:'rgba(255,255,255,0.8)' },
  card: { backgroundColor:'rgba(255,255,255,0.95)', borderRadius:20, padding:20, marginBottom:16 },
  errorBanner: { backgroundColor:'#FFF0EE', borderRadius:10, padding:10, marginBottom:12, borderWidth:1, borderColor:'#FFD4CE' },
  errorTxt: { fontSize:12, color:'#E8327A', fontWeight:'600' },
  label: { fontSize:11, fontWeight:'800', color:'#0D3547', textTransform:'uppercase', letterSpacing:1, marginBottom:6 },
  labelRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 },
  forgotTxt: { fontSize:12, color:'#2AABDC', fontWeight:'700' },
  input: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:12, padding:12, fontSize:14, color:'#0D3547', backgroundColor:'#fff', marginBottom:14 },
  passWrap: { flexDirection:'row', alignItems:'center', borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:12, backgroundColor:'#fff', marginBottom:16, overflow:'hidden' },
  loginBtn: { borderRadius:24, paddingVertical:14, alignItems:'center' },
  loginBtnTxt: { color:'#fff', fontSize:15, fontWeight:'900' },
  registerRow: { flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:12 },
  registerTxt: { fontSize:13, color:'rgba(255,255,255,0.8)' },
  registerLink: { fontSize:13, fontWeight:'800', color:'#FFB347' },
  backRow: { alignItems:'center', marginBottom:20 },
  backTxt: { fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:'600' },
});
