import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Remplis tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email, password,
      });
      if (authError) throw authError;
      navigation.navigate('Hotel');
    } catch (e) {
      setError(e.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError('Entre ton email d\'abord.');
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email);
      setError('');
      alert('Email de réinitialisation envoyé ! Vérifie ta boîte mail.');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>

        {/* Header */}
        <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
          <View style={styles.headerDeco1} />
          <View style={styles.headerDeco2} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <LinearGradient colors={['rgba(255,255,255,0.3)','rgba(255,255,255,0.1)']} style={styles.logoRing}>
              <View style={styles.logoInner}>
                <Text style={{ fontSize:28 }}>✈️</Text>
              </View>
            </LinearGradient>
            <Text style={styles.logoTxt}>TripMeet</Text>
            <Text style={styles.logoSub}>Bon retour parmi nous ! 👋</Text>
          </View>
        </LinearGradient>

        <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:20 }} keyboardShouldPersistTaps="handled">

          {/* Carte de connexion */}
          <View style={styles.card}>

            {/* Erreur */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorTxt}>⚠️ {error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>📧 Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="exemple@email.com"
                placeholderTextColor="#ccc"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.fieldWrap}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>🔒 Mot de passe</Text>
                <TouchableOpacity onPress={handleForgot}>
                  <Text style={styles.forgotTxt}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passWrap}>
                <TextInput
                  style={[styles.input, { flex:1, borderWidth:0 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 8 caractères"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showPass}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Text style={{ fontSize:18 }}>{showPass ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bouton connexion */}
            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <LinearGradient colors={['#E8327A','#F07030']} style={[styles.loginBtn, loading && { opacity:0.7 }]}>
                <Text style={styles.loginBtnTxt}>
                  {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orTxt}>OU</Text>
              <View style={styles.orLine} />
            </View>

            {/* Connexion Google */}
            <TouchableOpacity style={styles.googleBtn}>
              <Text style={{ fontSize:20 }}>🔍</Text>
              <Text style={styles.googleBtnTxt}>Continuer avec Google</Text>
            </TouchableOpacity>

          </View>

          {/* Pas encore de compte */}
          <View style={styles.registerRow}>
            <Text style={styles.registerTxt}>Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>S'inscrire gratuitement →</Text>
            </TouchableOpacity>
          </View>

          {/* Info sécurité */}
          <View style={styles.securityNote}>
            <Text style={{ fontSize:14 }}>🔐</Text>
            <Text style={styles.securityTxt}>
              Connexion sécurisée · Tes données sont chiffrées et protégées
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:20, paddingTop:50, paddingBottom:40, position:'relative', overflow:'hidden' },
  headerDeco1: { position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:60, backgroundColor:'rgba(255,255,255,0.08)' },
  headerDeco2: { position:'absolute', bottom:-20, left:-20, width:80, height:80, borderRadius:40, backgroundColor:'rgba(255,255,255,0.06)' },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center', marginBottom:16 },
  logoWrap: { alignItems:'center' },
  logoRing: { width:80, height:80, borderRadius:40, alignItems:'center', justifyContent:'center', marginBottom:12 },
  logoInner: { width:64, height:64, borderRadius:32, backgroundColor:'#fff', alignItems:'center', justifyContent:'center' },
  logoTxt: { fontSize:28, fontWeight:'900', color:'#fff', letterSpacing:-0.5 },
  logoSub: { fontSize:13, color:'rgba(255,255,255,0.8)', marginTop:4 },

  card: { backgroundColor:'#fff', borderRadius:20, borderWidth:1.5, borderColor:'#B5DCEA', padding:20, marginBottom:16 },

  errorBanner: { backgroundColor:'#FFF0EE', borderRadius:12, padding:12, marginBottom:14, borderWidth:1, borderColor:'#FFD4CE' },
  errorTxt: { fontSize:12, color:'#E8327A', fontWeight:'600' },

  fieldWrap: { marginBottom:16 },
  label: { fontSize:10, fontWeight:'800', color:'#0D3547', textTransform:'uppercase', letterSpacing:1, marginBottom:6 },
  labelRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 },
  forgotTxt: { fontSize:11, color:'#2AABDC', fontWeight:'700' },
  input: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:13, padding:13, fontSize:14, color:'#0D3547', backgroundColor:'#fff' },
  passWrap: { flexDirection:'row', alignItems:'center', borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:13, backgroundColor:'#fff', overflow:'hidden' },
  eyeBtn: { paddingHorizontal:14, paddingVertical:10 },

  loginBtn: { borderRadius:26, paddingVertical:15, alignItems:'center', marginBottom:16 },
  loginBtnTxt: { color:'#fff', fontSize:15, fontWeight:'900' },

  orRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:16 },
  orLine: { flex:1, height:1, backgroundColor:'#B5DCEA' },
  orTxt: { fontSize:11, fontWeight:'800', color:'#5E9DB8' },

  googleBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:26, paddingVertical:13, backgroundColor:'#fff' },
  googleBtnTxt: { fontSize:14, fontWeight:'700', color:'#0D3547' },

  registerRow: { flexDirection:'row', alignItems:'center', justifyContent:'center', marginBottom:14 },
  registerTxt: { fontSize:13, color:'#5E9DB8' },
  registerLink: { fontSize:13, fontWeight:'800', color:'#E8327A' },

  securityNote: { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:'#EAF7FD', borderRadius:12, padding:12, borderWidth:1, borderColor:'#B5DCEA' },
  securityTxt: { flex:1, fontSize:11, color:'#1A8BB8', fontWeight:'600', lineHeight:16 },
});
