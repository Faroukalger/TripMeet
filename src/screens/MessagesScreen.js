import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../i18n/LanguageContext';

const CONVERSATIONS = [
  { id:1, name:'Emma',  age:27, bg:'#FFD4E8', dest:'✈️ Bali → Lisbonne',  msg:'Tu voyages seule aussi ? 🌍',      time:'2 min', unread:true,  online:true  },
  { id:2, name:'Léa',   age:24, bg:'#D4EEF7', dest:'✈️ Paris → Tokyo',    msg:'On se croise à l\'aéroport ? 😄', time:'1 h',   unread:false, online:false },
  { id:3, name:'Sofia', age:29, bg:'#D4FFD4', dest:'✈️ Madrid → NYC',     msg:'Super rencontre !',               time:'hier',  unread:false, online:true  },
  { id:4, name:'Marc',  age:31, bg:'#FFE4D4', dest:'✈️ Lyon → Barcelone', msg:'On dîne ce soir ? 🍕',            time:'hier',  unread:true,  online:false },
];

const NEW_MATCHES = [
  { id:1, name:'Julie', bg:'#D4D4FF', dest:'→ Maroc', online:false },
  { id:2, name:'Alex',  bg:'#FFFFD4', dest:'→ Bali',  online:true  },
  { id:3, name:'Nina',  bg:'#D4FFE8', dest:'→ Tokyo', online:true  },
  { id:4, name:'Lucas', bg:'#FFD4D4', dest:'→ NYC',   online:false },
];

export default function MessagesScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#fff' }}>
      <ImageBackground source={require('../../assets/002.png')} style={styles.headerBg} resizeMode="cover">
        <LinearGradient colors={['rgba(232,50,122,0.82)','rgba(240,112,48,0.82)']} style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <View style={styles.logoRow}>
              <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
              <Text style={styles.logoTxt}>TripMeet</Text>
            </View>
            <Text style={{ fontSize:20 }}>🔔</Text>
          </View>
          <Text style={styles.headerTitle}>💬 {t('myMatches')}</Text>
          <Text style={styles.headerSub}>3 {t('matchesToday')}</Text>
          <View style={styles.headerWave} />
        </LinearGradient>
      </ImageBackground>

      <View style={styles.bottomNav}>
        {[['🏨',t('hotel'),'Hotel'],['💬',t('messages'),'Messages'],['🌍',t('explorer'),'Map'],['👤',t('profile'),'Profile']].map(([icon, label, screen]) => (
          <TouchableOpacity key={screen} style={styles.navItem} onPress={() => navigation.navigate(screen)}>
            <Text style={styles.navIcon}>{icon}</Text>
            <Text style={[styles.navLabel, screen === 'Messages' && { color:'#2AABDC' }]}>{label}</Text>
            {screen === 'Messages' && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex:1 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal:14, paddingVertical:12 }}>
          <View style={{ flexDirection:'row', gap:12 }}>
            {NEW_MATCHES.map(m => (
              <View key={m.id} style={styles.matchBubble}>
                <View style={[styles.matchAv, { backgroundColor:m.bg, borderColor: m.online ? '#E8327A' : '#B5DCEA' }]}>
                  <Text style={{ fontSize:20 }}>🙂</Text>
                  {m.online && <View style={styles.onlineDot} />}
                </View>
                <Text style={styles.matchName}>{m.name}</Text>
                <Text style={styles.matchDest}>{m.dest}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.convTitle}>{t('conversations').toUpperCase()}</Text>

        {CONVERSATIONS.map(conv => (
          <TouchableOpacity key={conv.id} style={styles.convItem} onPress={() => navigation.navigate('Chat', { conversationId:'demo', otherUser: conv })}>
            <View style={{ position:'relative' }}>
              <View style={[styles.convAv, { backgroundColor:conv.bg }]}>
                <Text style={{ fontSize:18 }}>🙂</Text>
              </View>
              {conv.online && <View style={styles.onlineDot} />}
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.convName}>{conv.name}</Text>
              <Text style={styles.convDest}>{conv.dest}</Text>
              <Text style={styles.convMsg} numberOfLines={1}>{conv.msg}</Text>
            </View>
            <View style={{ alignItems:'flex-end', gap:4 }}>
              <Text style={styles.convTime}>{conv.time}</Text>
              {conv.unread && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerTitle: { color:'#fff', fontSize:20, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,0.75)', fontSize:12, marginTop:2 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#fff', borderRadius:999 },
  matchBubble: { alignItems:'center', gap:4 },
  matchAv: { width:52, height:52, borderRadius:26, borderWidth:2.5, alignItems:'center', justifyContent:'center', position:'relative' },
  matchName: { fontSize:11, fontWeight:'700', color:'#0D3547' },
  matchDest: { fontSize:9, color:'#5E9DB8', fontWeight:'600' },
  onlineDot: { position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, backgroundColor:'#4CD964', borderWidth:2, borderColor:'#fff' },
  convTitle: { fontSize:11, fontWeight:'800', color:'#0D3547', letterSpacing:1, paddingHorizontal:14, paddingVertical:6 },
  convItem: { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:14, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  convAv: { width:44, height:44, borderRadius:22, alignItems:'center', justifyContent:'center' },
  convName: { fontSize:13, fontWeight:'800', color:'#0D3547' },
  convDest: { fontSize:9, color:'#F07030', fontWeight:'700', marginTop:1 },
  convMsg: { fontSize:11, color:'#5E9DB8', marginTop:2 },
  convTime: { fontSize:10, color:'#ccc' },
  unreadDot: { width:9, height:9, borderRadius:5, backgroundColor:'#E8327A' },
  bottomNav: { flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#B5DCEA', backgroundColor:'#fff' },
  navItem: { alignItems:'center', gap:2 },
  navIcon: { fontSize:20 },
  navLabel: { fontSize:10, fontWeight:'700', color:'#ccc' },
  navDot: { width:5, height:5, borderRadius:3, backgroundColor:'#2AABDC', marginTop:1 },
});
