import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../i18n/LanguageContext';

const DESTINATIONS = [
  { id:1, flag:'🇹🇭', name:'Bangkok',   country:'Thaïlande',  period:'Août 2025',      count:17, rank:'#1', badge:'Trending',  badgeColor:'#E8327A' },
  { id:2, flag:'🇵🇹', name:'Lisbonne',  country:'Portugal',   period:'Août–Sept',      count:8,  rank:'#2', badge:'Mon trip',  badgeColor:'#2ECC71' },
  { id:3, flag:'🇯🇵', name:'Tokyo',     country:'Japon',      period:'Sept–Oct',       count:14, rank:'#3', badge:'Nouveau',   badgeColor:'#2AABDC' },
  { id:4, flag:'🇲🇦', name:'Marrakech', country:'Maroc',      period:'Oct–Nov',        count:11, rank:'#4', badge:'Populaire', badgeColor:'#E8327A' },
  { id:5, flag:'🇮🇩', name:'Bali',      country:'Indonésie',  period:'Toute l\'année', count:9,  rank:'#5', badge:'En vogue',  badgeColor:'#2AABDC' },
  { id:6, flag:'🇺🇸', name:'New York',  country:'États-Unis', period:'Sept–Nov',       count:6,  rank:'#6', badge:'Trending',  badgeColor:'#E8327A' },
];

export default function MapScreen({ navigation }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(2);
  const [selected,  setSelected]  = useState(null);

  const TABS = [t('map'), t('myTrips'), t('trending')];

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <ImageBackground source={require('../../assets/004.jpg')} style={styles.headerBg} resizeMode="cover">
        <LinearGradient colors={['rgba(232,50,122,0.80)','rgba(240,112,48,0.80)']} style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
              <Text style={styles.logoTxt}>TripMeet</Text>
            </View>
            <Text style={{ fontSize:20 }}>🔔</Text>
          </View>
          <View style={styles.searchBar}>
            <Text style={{ fontSize:14, color:'#B5DCEA' }}>🔍</Text>
            <Text style={{ flex:1, color:'#ccc', fontSize:13 }}>{t('searchDestination')}</Text>
            <Text style={{ color:'#fff', fontWeight:'800', fontSize:12 }}>{t('filters')}</Text>
          </View>
          <View style={styles.headerWave} />
        </LinearGradient>
      </ImageBackground>

      <View style={styles.tabs}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={i} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
            <Text style={[styles.tabTxt, activeTab === i && styles.tabTxtActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 0 && (
        <View style={styles.mapPlaceholder}>
          <Text style={{ fontSize:60 }}>🗺️</Text>
          <Text style={styles.mapTitle}>{t('map')}</Text>
          <Text style={styles.mapSub}>Disponible avec Google Maps API</Text>
          <TouchableOpacity onPress={() => setActiveTab(2)}>
            <LinearGradient colors={['#E8327A','#F07030']} style={styles.mapBtn}>
              <Text style={styles.mapBtnTxt}>{t('trending')} →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 1 && (
        <View style={styles.mapPlaceholder}>
          <Text style={{ fontSize:60 }}>✈️</Text>
          <Text style={styles.mapTitle}>{t('myTrips')}</Text>
          <Text style={styles.mapSub}>Tes destinations enregistrées</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CheckIn')}>
            <LinearGradient colors={['#E8327A','#F07030']} style={styles.mapBtn}>
              <Text style={styles.mapBtnTxt}>+ Ajouter un voyage</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 2 && (
        <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:14, paddingBottom:80 }}>
          <Text style={styles.sectionTitle}>🔥 {t('popularDest')}</Text>
          {DESTINATIONS.map(dest => (
            <TouchableOpacity
              key={dest.id}
              style={[styles.destCard, selected === dest.id && styles.destCardSelected]}
              onPress={() => setSelected(selected === dest.id ? null : dest.id)}
            >
              <View style={styles.destFlag}><Text style={{ fontSize:36 }}>{dest.flag}</Text></View>
              <View style={{ flex:1 }}>
                <View style={styles.destTop}>
                  <Text style={styles.destName}>{dest.name}</Text>
                  <Text style={styles.destRank}>{dest.rank}</Text>
                </View>
                <Text style={styles.destCountry}>{dest.country} · {dest.period}</Text>
                <View style={styles.destBottom}>
                  <View style={styles.destAvatars}>
                    {['#FFD4E8','#D4EEF7','#D4FFD4'].map((bg, i) => (
                      <View key={i} style={[styles.destAv, { backgroundColor:bg, marginLeft: i > 0 ? -6 : 0 }]}>
                        <Text style={{ fontSize:10 }}>🙂</Text>
                      </View>
                    ))}
                    <Text style={styles.destCount}>+{dest.count} {t('travelers')}</Text>
                  </View>
                  <View style={[styles.destBadge, { backgroundColor:dest.badgeColor+'20', borderColor:dest.badgeColor+'50' }]}>
                    <Text style={[styles.destBadgeTxt, { color:dest.badgeColor }]}>{dest.badge}</Text>
                  </View>
                </View>
                {selected === dest.id && (
                  <TouchableOpacity onPress={() => navigation.navigate('Hotel')}>
                    <LinearGradient colors={['#E8327A','#F07030']} style={styles.exploreBtn}>
                      <Text style={styles.exploreBtnTxt}>🌍 Explorer {dest.name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        {[['🏨',t('hotel'),'Hotel'],['💬',t('messages'),'Messages'],['🌍',t('explorer'),'Map'],['👤',t('profile'),'Profile']].map(([icon, label, screen]) => (
          <TouchableOpacity key={screen} style={styles.navItem} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.navIcon}>{icon}</Text>
            <Text style={[styles.navLabel, screen === 'Map' && { color:'#2AABDC' }]}>{label}</Text>
            {screen === 'Map' && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBg: { width:'100%' },
  headerOverlay: { paddingHorizontal:16, paddingTop:52, paddingBottom:20, position:'relative' },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
  logoRow: { flexDirection:'row', alignItems:'center', gap:6 },
  logoRing: { width:24, height:24, borderRadius:12, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  searchBar: { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'rgba(255,255,255,0.2)', borderRadius:22, paddingHorizontal:14, paddingVertical:9 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  tabs: { flexDirection:'row', backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#B5DCEA' },
  tab: { flex:1, alignItems:'center', paddingVertical:11, borderBottomWidth:2.5, borderBottomColor:'transparent' },
  tabActive: { borderBottomColor:'#2AABDC' },
  tabTxt: { fontSize:11, fontWeight:'800', color:'#ccc' },
  tabTxtActive: { color:'#2AABDC' },
  mapPlaceholder: { flex:1, alignItems:'center', justifyContent:'center', padding:30, gap:12 },
  mapTitle: { fontSize:20, fontWeight:'900', color:'#0D3547' },
  mapSub: { fontSize:13, color:'#5E9DB8', textAlign:'center', lineHeight:20 },
  mapBtn: { borderRadius:26, paddingVertical:13, paddingHorizontal:28, marginTop:8 },
  mapBtnTxt: { color:'#fff', fontWeight:'900', fontSize:14 },
  sectionTitle: { fontSize:12, fontWeight:'800', color:'#0D3547', letterSpacing:0.5, textTransform:'uppercase', marginBottom:12 },
  destCard: { backgroundColor:'#fff', borderRadius:18, borderWidth:1.5, borderColor:'#B5DCEA', marginBottom:10, flexDirection:'row', overflow:'hidden' },
  destCardSelected: { borderColor:'#E8327A' },
  destFlag: { width:80, alignItems:'center', justifyContent:'center', backgroundColor:'#FDF9F4' },
  destTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:3, paddingTop:10, paddingRight:12 },
  destName: { fontSize:15, fontWeight:'900', color:'#0D3547' },
  destRank: { fontSize:10, fontWeight:'800', color:'#F07030' },
  destCountry: { fontSize:10, color:'#5E9DB8', marginBottom:8, paddingRight:12 },
  destBottom: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:10, paddingRight:12 },
  destAvatars: { flexDirection:'row', alignItems:'center' },
  destAv: { width:22, height:22, borderRadius:11, borderWidth:1.5, borderColor:'#fff', alignItems:'center', justifyContent:'center' },
  destCount: { fontSize:10, color:'#5E9DB8', fontWeight:'600', marginLeft:8 },
  destBadge: { paddingHorizontal:9, paddingVertical:3, borderRadius:20, borderWidth:1 },
  destBadgeTxt: { fontSize:9, fontWeight:'800' },
  exploreBtn: { borderRadius:20, paddingVertical:9, alignItems:'center', marginTop:8, marginBottom:10, marginRight:12 },
  exploreBtnTxt: { color:'#fff', fontWeight:'800', fontSize:12 },
  bottomNav: { flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderTopWidth:1, borderTopColor:'#B5DCEA', backgroundColor:'#fff', position:'absolute', bottom:0, left:0, right:0 },
  navItem: { alignItems:'center', gap:2 },
  navIcon: { fontSize:20 },
  navLabel: { fontSize:10, fontWeight:'700', color:'#ccc' },
  navDot: { width:5, height:5, borderRadius:3, backgroundColor:'#2AABDC', marginTop:1 },
});