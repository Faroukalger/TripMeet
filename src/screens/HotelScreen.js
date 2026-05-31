import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../i18n/LanguageContext';

const MY_HOTEL = {
  name:  'Mercure Toulouse Centre Wilson',
  stars: 4,
  solos: [
    { id:1, name:'Emma',  age:27, compat:96, online:true,  bg:'#FFD4E8', flag:'🇫🇷', dest:'→ Lisbonne' },
    { id:2, name:'Léa',   age:24, compat:88, online:true,  bg:'#D4EEF7', flag:'🇧🇪', dest:'→ Tokyo'    },
    { id:3, name:'Marc',  age:31, compat:74, online:false, bg:'#D4FFD4', flag:'🇩🇪', dest:'→ Barcelone'},
    { id:4, name:'Julie', age:26, compat:71, online:false, bg:'#FFE4D4', flag:'🇨🇭', dest:'→ Maroc'    },
  ],
};

const NEARBY_HOTELS = [
  {
    id:1, name:'Novotel Toulouse Wilson', stars:4, dist:'280 m', icon:'🏩',
    solos:[
      { id:5, name:'Sofia',  age:29, compat:91, online:true,  bg:'#D4D4FF' },
      { id:6, name:'Lucas',  age:33, compat:82, online:false, bg:'#FFD4D4' },
      { id:7, name:'Nina',   age:25, compat:77, online:false, bg:'#D4FFE8' },
    ],
  },
  {
    id:2, name:"Grand Hôtel de l'Opéra", stars:5, dist:'420 m', icon:'🏛',
    solos:[
      { id:8, name:'Alex',  age:38, compat:79, online:false, bg:'#FFFFD4' },
      { id:9, name:'Marie', age:30, compat:75, online:true,  bg:'#FFD4F8' },
    ],
  },
];

const RADIUS_OPTIONS = [t('hotel'), '500 m', '1 km', '5 km'];

export default function HotelScreen({ navigation }) {
  const { t } = useLanguage();
  const [radius, setRadius] = useState('500 m');

  return (
    <View style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <SafeAreaView style={{ flex:1 }}>

        {/* Header avec photo 003 */}
        <ImageBackground
          source={require('../../assets/003.png')}
          style={styles.headerBg}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(232,50,122,0.80)','rgba(240,112,48,0.80)']}
            style={styles.headerOverlay}
          >
            <View style={styles.headerTop}>
              <View style={styles.logoRow}>
                <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
                <Text style={styles.logoTxt}>TripMeet</Text>
              </View>
              <View style={{ flexDirection:'row', gap:8 }}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Nearby')}>
                  <Text style={{ fontSize:16 }}>📡</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
                  <Text style={{ fontSize:16 }}>🔔</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.checkinBar} onPress={() => navigation.navigate('CheckIn')}>
              <Text style={{ fontSize:20 }}>🏨</Text>
              <View style={{ flex:1 }}>
                <Text style={styles.checkinName}>Mercure Toulouse Centre Wilson</Text>
                <Text style={styles.checkinStars}>★★★★ · Chambre 412</Text>
                <Text style={styles.checkinRoom}>Check-in · 12–17 août</Text>
              </View>
              <View style={styles.checkinBadge}>
                <Text style={styles.checkinBadgeTxt}>✓ Vérifié</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>

        <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false}>
          {/* Rayon */}
          <View style={styles.radiusRow}>
            <Text style={styles.radiusLbl}>📍 Rayon de recherche</Text>
            <View style={styles.radiusBtns}>
              {RADIUS_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.radiusBtn, radius === opt && styles.radiusBtnActive]}
                  onPress={() => setRadius(opt)}
                >
                  <Text style={[styles.radiusBtnTxt, radius === opt && styles.radiusBtnTxtActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ paddingHorizontal:13 }}>
            {/* Mon hôtel */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🏨 {t('inMyHotel')}</Text>
              <Text style={styles.sectionCount}>{MY_HOTEL.solos.length} solos</Text>
            </View>
            <HotelBlock hotel={MY_HOTEL} type="here" onPressTraveler={(s) => navigation.navigate('Chat', { conversationId:'demo', otherUser:s })} />

            {radius !== 'Mon hôtel' && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>📍 À {radius}</Text>
                  <Text style={styles.sectionCount}>{NEARBY_HOTELS.reduce((acc, h) => acc + h.solos.length, 0)} solos</Text>
                </View>
                {NEARBY_HOTELS.map(h => (
                  <HotelBlock key={h.id} hotel={h} type="near" onPressTraveler={(s) => navigation.navigate('Chat', { conversationId:'demo', otherUser:s })} />
                ))}
              </>
            )}
            <View style={{ height:80 }} />
          </View>
        </ScrollView>

        <BottomNav navigation={navigation} active="hotel" />
      </SafeAreaView>
    </View>
  );
}

function HotelBlock({ hotel, type, onPressTraveler }) {
  return (
    <View style={styles.hotelBlock}>
      <View style={styles.hotelBlockHeader}>
        <View style={styles.hotelNameRow}>
          <Text style={{ fontSize:type === 'here' ? 18 : 16 }}>{hotel.icon || '🏨'}</Text>
          <View>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <Text style={styles.hotelStars}>{'★'.repeat(hotel.stars)}{hotel.dist ? ` · ${hotel.dist}` : ''}</Text>
          </View>
        </View>
        {type === 'here' ? (
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.hotelTag}>
            <Text style={styles.hotelTagTxt}>Je suis ici</Text>
          </LinearGradient>
        ) : (
          <View style={styles.hotelTagNear}>
            <Text style={styles.hotelTagNearTxt}>{hotel.dist}</Text>
          </View>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection:'row', gap:10, paddingBottom:4 }}>
          {hotel.solos.map(s => (
            <TravelerCard key={s.id} traveler={s} onPress={() => onPressTraveler(s)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function TravelerCard({ traveler, onPress }) {
  const isTop = traveler.compat >= 90;
  return (
    <TouchableOpacity onPress={onPress} style={styles.tcard} activeOpacity={0.8}>
      <View style={styles.tcardAvWrap}>
        {isTop ? (
          <LinearGradient colors={['#E8327A','#F07030']} style={styles.tcardRing}>
            <View style={[styles.tcardAv, { backgroundColor: traveler.bg }]}>
              <Text style={{ fontSize:18 }}>🙂</Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.tcardAv, styles.tcardAvBorder, { backgroundColor: traveler.bg }]}>
            <Text style={{ fontSize:18 }}>🙂</Text>
          </View>
        )}
        {traveler.online && <View style={styles.tcardOnline} />}
      </View>
      <Text style={styles.tcardName}>{traveler.name}</Text>
      <Text style={[styles.tcardCompat, isTop && { color:'#F07030' }]}>{traveler.compat}%{isTop ? ' ✨' : ''}</Text>
    </TouchableOpacity>
  );
}

function BottomNav({ navigation, active }) {
  const tabs = [
    { key:'hotel',   icon:'🏨', label:'Hôtel',    screen:'Hotel'    },
    { key:'chat',    icon:'💬', label:'Messages',  screen:'Messages' },
    { key:'map',     icon:'🌍', label:'Explorer',  screen:'Map'      },
    { key:'profile', icon:'👤', label:'Profil',    screen:'Profile'  },
  ];
  return (
    <View style={styles.bottomNav}>
      {tabs.map(t => (
        <TouchableOpacity key={t.key} style={styles.navItem} onPress={() => navigation.navigate(t.screen)}>
          <Text style={styles.navIcon}>{t.icon}</Text>
          <Text style={[styles.navLabel, active === t.key && { color:'#2AABDC' }]}>{t.label}</Text>
          {active === t.key && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerBg: { width:'100%' },
  headerOverlay: { paddingHorizontal:16, paddingTop:52, paddingBottom:14 },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  logoRow: { flexDirection:'row', alignItems:'center', gap:7 },
  logoRing: { width:26, height:26, borderRadius:13, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:17, fontWeight:'900' },
  iconBtn: { width:32, height:32, borderRadius:16, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  checkinBar: { backgroundColor:'rgba(255,255,255,0.95)', borderRadius:14, padding:10, flexDirection:'row', alignItems:'center', gap:10 },
  checkinName: { fontSize:12, fontWeight:'900', color:'#0D3547' },
  checkinStars: { fontSize:9, color:'#C9A84C', marginTop:1 },
  checkinRoom: { fontSize:9, color:'#5E9DB8', marginTop:1 },
  checkinBadge: { backgroundColor:'#D6F0FA', borderRadius:20, paddingHorizontal:9, paddingVertical:3, borderWidth:1, borderColor:'#B5DCEA' },
  checkinBadgeTxt: { fontSize:8, fontWeight:'800', color:'#1A8BB8' },
  radiusRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:14, paddingVertical:12 },
  radiusLbl: { fontSize:11, fontWeight:'800', color:'#0D3547' },
  radiusBtns: { flexDirection:'row', gap:5 },
  radiusBtn: { paddingHorizontal:9, paddingVertical:4, borderRadius:20, borderWidth:1, borderColor:'#B5DCEA', backgroundColor:'#fff' },
  radiusBtnActive: { backgroundColor:'#2AABDC', borderColor:'#2AABDC' },
  radiusBtnTxt: { fontSize:9, fontWeight:'700', color:'#5E9DB8' },
  radiusBtnTxtActive: { color:'#fff' },
  sectionHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8, marginTop:4 },
  sectionTitle: { fontSize:11, fontWeight:'800', color:'#0D3547', letterSpacing:0.5, textTransform:'uppercase' },
  sectionCount: { fontSize:10, fontWeight:'800', color:'#E8327A' },
  hotelBlock: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:12, marginBottom:12 },
  hotelBlockHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  hotelNameRow: { flexDirection:'row', alignItems:'center', gap:8, flex:1 },
  hotelName: { fontSize:12, fontWeight:'900', color:'#0D3547', flex:1 },
  hotelStars: { fontSize:9, color:'#C9A84C' },
  hotelTag: { borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  hotelTagTxt: { fontSize:9, fontWeight:'800', color:'#fff' },
  hotelTagNear: { backgroundColor:'#D6F0FA', borderRadius:20, paddingHorizontal:10, paddingVertical:4, borderWidth:1, borderColor:'#B5DCEA' },
  hotelTagNearTxt: { fontSize:9, fontWeight:'800', color:'#1A8BB8' },
  tcard: { alignItems:'center', gap:3, width:54 },
  tcardAvWrap: { position:'relative' },
  tcardRing: { padding:2, borderRadius:25, width:48, height:48 },
  tcardAv: { width:44, height:44, borderRadius:22, alignItems:'center', justifyContent:'center' },
  tcardAvBorder: { borderWidth:2, borderColor:'#B5DCEA' },
  tcardOnline: { position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:6, backgroundColor:'#2ECC71', borderWidth:2, borderColor:'#fff' },
  tcardName: { fontSize:9, fontWeight:'800', color:'#0D3547' },
  tcardCompat: { fontSize:8, fontWeight:'700', color:'#5E9DB8' },
  bottomNav: { flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderTopWidth:1, borderTopColor:'#B5DCEA', backgroundColor:'#fff' },
  navItem: { alignItems:'center', gap:2 },
  navIcon: { fontSize:20 },
  navLabel: { fontSize:10, fontWeight:'700', color:'#ccc' },
  navDot: { width:5, height:5, borderRadius:3, backgroundColor:'#2AABDC', marginTop:1 },
});
