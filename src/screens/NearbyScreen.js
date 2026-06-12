import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ActivityIndicator, Linking, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useLanguage } from '../i18n/LanguageContext';

// Vraies photos des voyageurs (avatars)
const AVATARS = [
  require('../../assets/F001.jpg'),
  require('../../assets/H001.jpg'),
  require('../../assets/F002.jpg'),
  require('../../assets/H002.jpg'),
  require('../../assets/F003.jpg'),
  require('../../assets/H003.jpg'),
  require('../../assets/F004.jpg'),
  require('../../assets/F005.jpg'),
  require('../../assets/F006.jpg'),
];

const MOCK_HOTELS = [
  { id:1, name:'Mercure Toulouse Centre Wilson', stars:4, lat:43.6047, lng:1.4442, solos:4,  realDist:0,   here:true  },
  { id:2, name:'Novotel Toulouse Wilson',        stars:4, lat:43.6063, lng:1.4445, solos:3,  realDist:280, here:false },
  { id:3, name:"Grand Hôtel de l'Opéra",         stars:5, lat:43.6038, lng:1.4458, solos:2,  realDist:420, here:false },
  { id:4, name:'Ibis Toulouse Centre',           stars:3, lat:43.6071, lng:1.4432, solos:4,  realDist:380, here:false },
  { id:5, name:'Crowne Plaza Toulouse',          stars:5, lat:43.6029, lng:1.4468, solos:2,  realDist:490, here:false },
];

const formatDist = (d) => d === 0 ? 'Ici' : d < 1000 ? `${d} m` : `${(d/1000).toFixed(1)} km`;

export default function NearbyScreen({ navigation }) {
  const { t } = useLanguage();
  const [loading,    setLoading]    = useState(false);
  const [radius,     setRadius]     = useState(500);
  const [hotels,     setHotels]     = useState(MOCK_HOTELS);
  const [locGranted, setLocGranted] = useState(false);
  const [error,      setError]      = useState('');

  const RADIUS_OPTIONS = [
    { label: t('hotel'), value: 0 },
    { label: '500 m',    value: 500 },
    { label: '1 km',     value: 1000 },
    { label: '5 km',     value: 5000 },
  ];

  useEffect(() => { requestLocation(); }, []);

  const requestLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocGranted(status === 'granted');
    } catch(e) {
      setError('Position approximative utilisée.');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = radius === 0
    ? hotels.filter(h => h.here)
    : hotels.filter(h => h.realDist <= radius);

  const totalSolos = filteredHotels.reduce((acc, h) => acc + h.solos, 0);

  const openMaps = (hotel) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${hotel.lat},${hotel.lng}`);
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
            <Text style={styles.logoTxt}>TripMeet</Text>
          </View>
          <TouchableOpacity onPress={requestLocation} style={styles.backBtn}>
            <Text style={{ fontSize:18 }}>🔄</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>📍 {t('nearby')}</Text>
        <Text style={styles.headerSub}>
          {locGranted ? '🟢 Géolocalisation active' : '🔴 Position approximative'}
        </Text>
        <View style={styles.headerWave} />
      </LinearGradient>

      <View style={styles.bottomNav}>
        {[['🏨',t('hotel'),'Hotel'],['💬',t('messages'),'Messages'],['🌍',t('explorer'),'Map'],['👤',t('profile'),'Profile']].map(([icon, label, screen]) => (
          <TouchableOpacity key={screen} style={styles.navItem} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.navIcon}>{icon}</Text>
            <Text style={styles.navLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.radiusRow}>
        <Text style={styles.radiusLbl}>{t('searchRadius')}</Text>
        <View style={styles.radiusBtns}>
          {RADIUS_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.radiusBtn, radius === opt.value && styles.radiusBtnActive]}
              onPress={() => setRadius(opt.value)}
            >
              <Text style={[styles.radiusBtnTxt, radius === opt.value && styles.radiusBtnTxtActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{filteredHotels.length}</Text>
          <Text style={styles.statLbl}>{t('hotel')}s</Text>
        </View>
        <View style={[styles.statBox, { borderColor:'#FFD4CE' }]}>
          <Text style={[styles.statNum, { color:'#E8327A' }]}>{totalSolos}</Text>
          <Text style={styles.statLbl}>{t('solos')}</Text>
        </View>
        <View style={[styles.statBox, { borderColor:'#C0E8C0' }]}>
          <Text style={[styles.statNum, { color:'#2ECC71' }]}>
            {filteredHotels.filter(h => h.solos > 0).length}
          </Text>
          <Text style={styles.statLbl}>Actifs</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center', gap:12 }}>
          <ActivityIndicator size="large" color="#E8327A" />
          <Text style={{ color:'#5E9DB8', fontWeight:'600' }}>Recherche en cours...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding:13, paddingBottom:24 }}>
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorTxt}>⚠️ {error}</Text>
            </View>
          ) : null}

          {filteredHotels.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize:48 }}>🔍</Text>
              <Text style={styles.emptyTitle}>Aucun hôtel trouvé</Text>
              <Text style={styles.emptySub}>Élargis le rayon de recherche</Text>
            </View>
          ) : (
            filteredHotels.map(hotel => (
              <View key={hotel.id} style={[styles.hotelCard, hotel.here && styles.hotelCardHere]}>
                <View style={styles.hotelTop}>
                  <View style={styles.hotelIconWrap}>
                    <Text style={{ fontSize:22 }}>{hotel.stars === 5 ? '🏛' : hotel.stars === 3 ? '🏠' : '🏨'}</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.hotelStars}>{'★'.repeat(hotel.stars)}</Text>
                  </View>
                  {hotel.here ? (
                    <LinearGradient colors={['#E8327A','#F07030']} style={styles.distBadge}>
                      <Text style={styles.distBadgeTxt}>{t('iAmHere')}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.distBadgeBlue}>
                      <Text style={styles.distBadgeBlueTxt}>{formatDist(hotel.realDist)}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.solosRow}>
                  <View style={styles.solosAvatars}>
                    {Array(Math.min(hotel.solos, 4)).fill(0).map((_, i) => (
                      <View key={i} style={[styles.soloAv, { marginLeft: i > 0 ? -8 : 0 }]}>
                        <Image source={AVATARS[(hotel.id * 3 + i) % AVATARS.length]} style={styles.soloAvImg} />
                      </View>
                    ))}
                  </View>
                  <Text style={styles.solosCount}>{hotel.solos} {t('solos')}</Text>
                </View>

                <View style={styles.hotelActions}>
                  <TouchableOpacity style={styles.mapBtn} onPress={() => openMaps(hotel)}>
                    <Text style={styles.mapBtnTxt}>🗺️ Voir sur Maps</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Hotel')}>
                    <LinearGradient colors={['#E8327A','#F07030']} style={styles.solosBtn}>
                      <Text style={styles.solosBtnTxt}>{t('solos')} →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  logoRow: { flexDirection:'row', alignItems:'center', gap:6 },
  logoRing: { width:24, height:24, borderRadius:12, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  headerTitle: { color:'#fff', fontSize:20, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,0.75)', fontSize:11, marginTop:2 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  radiusRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:12, paddingHorizontal:14 },
  radiusLbl: { fontSize:11, fontWeight:'800', color:'#0D3547' },
  radiusBtns: { flexDirection:'row', gap:5 },
  radiusBtn: { paddingHorizontal:9, paddingVertical:4, borderRadius:20, borderWidth:1, borderColor:'#B5DCEA', backgroundColor:'#fff' },
  radiusBtnActive: { backgroundColor:'#2AABDC', borderColor:'#2AABDC' },
  radiusBtnTxt: { fontSize:10, fontWeight:'700', color:'#5E9DB8' },
  radiusBtnTxtActive: { color:'#fff' },
  statsBar: { flexDirection:'row', gap:10, paddingHorizontal:14, marginBottom:4 },
  statBox: { flex:1, backgroundColor:'#fff', borderRadius:12, borderWidth:1.5, borderColor:'#B5DCEA', padding:10, alignItems:'center' },
  statNum: { fontSize:20, fontWeight:'900', color:'#1A8BB8' },
  statLbl: { fontSize:9, color:'#5E9DB8', fontWeight:'700', marginTop:1 },
  errorBanner: { backgroundColor:'#FFF0EE', borderRadius:12, padding:12, marginBottom:12, borderWidth:1, borderColor:'#FFD4CE' },
  errorTxt: { fontSize:12, color:'#E8327A', fontWeight:'600' },
  emptyState: { alignItems:'center', paddingTop:60, gap:10 },
  emptyTitle: { fontSize:18, fontWeight:'900', color:'#0D3547' },
  emptySub: { fontSize:13, color:'#5E9DB8' },
  hotelCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:13, marginBottom:10 },
  hotelCardHere: { borderColor:'#E8327A', backgroundColor:'#FFF8F8' },
  hotelTop: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  hotelIconWrap: { width:42, height:42, borderRadius:12, backgroundColor:'#FDF9F4', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#B5DCEA' },
  hotelName: { fontSize:13, fontWeight:'900', color:'#0D3547', flex:1 },
  hotelStars: { fontSize:10, color:'#C9A84C' },
  distBadge: { borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  distBadgeTxt: { fontSize:9, fontWeight:'800', color:'#fff' },
  distBadgeBlue: { backgroundColor:'#D6F0FA', borderRadius:20, paddingHorizontal:10, paddingVertical:4, borderWidth:1, borderColor:'#B5DCEA' },
  distBadgeBlueTxt: { fontSize:9, fontWeight:'800', color:'#1A8BB8' },
  solosRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  solosAvatars: { flexDirection:'row' },
  soloAv: { width:28, height:28, borderRadius:14, borderWidth:2, borderColor:'#fff', alignItems:'center', justifyContent:'center', overflow:'hidden', backgroundColor:'#EEE' },
  soloAvImg: { width:'100%', height:'100%', borderRadius:14 },
  solosCount: { fontSize:11, color:'#5E9DB8', fontWeight:'600' },
  hotelActions: { flexDirection:'row', gap:8 },
  mapBtn: { flex:1, borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:20, paddingVertical:8, alignItems:'center', backgroundColor:'#fff' },
  mapBtnTxt: { fontSize:11, fontWeight:'700', color:'#5E9DB8' },
  solosBtn: { borderRadius:20, paddingVertical:8, paddingHorizontal:14 },
  solosBtnTxt: { fontSize:11, fontWeight:'800', color:'#fff' },
  bottomNav: { flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#B5DCEA', backgroundColor:'#fff' },
  navItem: { alignItems:'center', gap:2 },
  navIcon: { fontSize:20 },
  navLabel: { fontSize:10, fontWeight:'700', color:'#ccc' },
});
