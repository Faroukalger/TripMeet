import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function EmailConfirmScreen({ navigation, route }) {
  const { email, prenom } = route.params || {};

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
          <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
          <Text style={styles.logoTxt}>TripMeet</Text>
        </View>
        <View style={styles.headerWave} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize:48 }}>📧</Text>
        </View>

        <Text style={styles.title}>Vérifie ta boîte mail !</Text>
        <Text style={styles.subtitle}>Bienvenue {prenom} ! 🎉</Text>
        <Text style={styles.desc}>On a envoyé un email de confirmation à :</Text>

        <View style={styles.emailBadge}>
          <Text style={styles.emailTxt}>{email}</Text>
        </View>

        <Text style={styles.desc2}>
          Clique sur le lien dans l'email pour activer ton compte et commencer à rencontrer des voyageurs solo ! ✈️
        </Text>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>📋 Étapes suivantes</Text>
          {[
            ['1️⃣', 'Ouvre ta boîte mail'],
            ['2️⃣', 'Cherche l\'email de TripMeet'],
            ['3️⃣', 'Clique sur "Confirmer mon compte"'],
            ['4️⃣', 'Reviens sur l\'app et connecte-toi !'],
          ].map(([num, txt]) => (
            <View key={num} style={styles.stepRow}>
              <Text style={styles.stepNum}>{num}</Text>
              <Text style={styles.stepTxt}>{txt}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <Text>⚠️</Text>
          <Text style={styles.infoTxt}>
            Tu ne trouves pas l'email ? Vérifie tes spams ou attends quelques minutes.
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Splash')}>
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.btn}>
            <Text style={styles.btnTxt}>✈️ Retour à l'accueil</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
  logoRing: { width:24, height:24, borderRadius:12, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  body: { padding:20, alignItems:'center' },
  iconCircle: { width:100, height:100, borderRadius:50, backgroundColor:'#FFF0EE', borderWidth:3, borderColor:'#FFD4CE', alignItems:'center', justifyContent:'center', marginTop:20, marginBottom:16 },
  title: { fontSize:24, fontWeight:'900', color:'#0D3547', textAlign:'center', marginBottom:6 },
  subtitle: { fontSize:16, fontWeight:'700', color:'#E8327A', textAlign:'center', marginBottom:8 },
  desc: { fontSize:13, color:'#5E9DB8', textAlign:'center', marginBottom:10 },
  emailBadge: { backgroundColor:'#D6F0FA', borderRadius:20, paddingHorizontal:20, paddingVertical:10, marginBottom:14, borderWidth:1.5, borderColor:'#B5DCEA' },
  emailTxt: { fontSize:14, fontWeight:'800', color:'#1A8BB8' },
  desc2: { fontSize:12, color:'#5E9DB8', textAlign:'center', lineHeight:19, marginBottom:16 },
  stepsCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:16, width:'100%', marginBottom:14 },
  stepsTitle: { fontSize:13, fontWeight:'800', color:'#0D3547', marginBottom:12 },
  stepRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  stepNum: { fontSize:18 },
  stepTxt: { fontSize:12, color:'#0D3547', fontWeight:'600', flex:1 },
  infoBanner: { flexDirection:'row', gap:8, backgroundColor:'#FFF8E8', borderRadius:12, padding:12, borderWidth:1, borderColor:'#F0E0B0', width:'100%', marginBottom:16, alignItems:'flex-start' },
  infoTxt: { flex:1, fontSize:11, color:'#C9A84C', lineHeight:17, fontWeight:'600' },
  btn: { borderRadius:26, paddingVertical:14, paddingHorizontal:40, alignItems:'center' },
  btnTxt: { color:'#fff', fontSize:14, fontWeight:'900' },
});
