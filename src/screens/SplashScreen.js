import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  StatusBar, Dimensions, ImageBackground, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  return (
    <View style={{ flex:1 }}>
      <StatusBar barStyle="light-content" />

      {/* Photo de fond plein écran */}
      <ImageBackground
        source={require('../../assets/001.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Overlay sombre pour lisibilité */}
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)']}
          style={styles.overlay}
        >
          <SafeAreaView style={{ flex:1 }}>

            {/* Logo en haut */}
            <View style={styles.logoWrap}>
              <LinearGradient
                colors={['#E8327A','#F07030']}
                style={styles.logoRing}
              >
                <View style={styles.logoInner}>
                  <Text style={{ fontSize:28 }}>✈️</Text>
                </View>
              </LinearGradient>
              <Text style={styles.logoTxt}>TripMeet</Text>
            </View>

            {/* Contenu central */}
            <View style={styles.body}>
              <Text style={styles.tagline}>
                Rencontre des voyageurs solo{'\n'}
                qui séjournent dans ton hôtel 🌍
              </Text>
              <Text style={styles.subTagline}>
                Fini les soirées seul(e) dans ta chambre.{'\n'}
                Des rencontres authentiques t'attendent.
              </Text>
            </View>

            {/* Boutons en bas */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#E8327A','#F07030']}
                  start={{ x:0, y:0 }} end={{ x:1, y:0 }}
                  style={styles.btnPrimary}
                >
                  <Text style={styles.btnPrimaryTxt}>✈️ Commencer l'aventure</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.btnSecondary}
                activeOpacity={0.75}
              >
                <Text style={styles.btnSecondaryTxt}>J'ai déjà un compte</Text>
              </TouchableOpacity>

              <Text style={styles.legal}>
                En continuant, tu acceptes nos{' '}
                <Text style={styles.legalLink}>Conditions d'utilisation</Text>
                {' '}et notre{' '}
                <Text style={styles.legalLink}>Politique de confidentialité</Text>
              </Text>
            </View>

          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex:1, width:'100%', height:'100%' },
  overlay: { flex:1 },

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

  legal: { fontSize:10, color:'rgba(255,255,255,0.5)', textAlign:'center', lineHeight:16, marginTop:4 },
  legalLink: { textDecorationLine:'underline', color:'rgba(255,255,255,0.7)' },
});
