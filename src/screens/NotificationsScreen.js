import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../i18n/LanguageContext';

const HISTORY = [
  { id:1, icon:'💫', title:'Nouveau match !',      body:'Emma a aimé ton profil',          time:'Il y a 2 min', read:false },
  { id:2, icon:'💬', title:'Message de Léa',       body:'On se croise à l\'aéroport ? 😄', time:'Il y a 1 h',   read:false },
  { id:3, icon:'🏨', title:'3 solos à ton hôtel', body:'Mercure Toulouse · 3 nouveaux',   time:'Il y a 3 h',   read:true  },
  { id:4, icon:'✈️', title:'Rappel check-out',    body:'Départ demain de Mercure',        time:'Hier',         read:true  },
  { id:5, icon:'💫', title:'Nouveau match !',      body:'Sofia a aimé ton profil',         time:'Il y a 2 j',   read:true  },
];

export default function NotificationsScreen({ navigation }) {
  const { t } = useLanguage();

  const NOTIF_SETTINGS = [
    { id:'match',    icon:'💫', title:t('myMatches'),    desc:'Quand quelqu\'un aime ton profil',  default:true  },
    { id:'message',  icon:'💬', title:t('messages'),     desc:'Quand tu reçois un message',        default:true  },
    { id:'solo',     icon:'🏨', title:t('inMyHotel'),    desc:'Nouveaux voyageurs dans ton hôtel', default:true  },
    { id:'checkout', icon:'✈️', title:'Rappel check-out',desc:'Rappel la veille de ton départ',    default:true  },
    { id:'promo',    icon:'⚡', title:'Offres & boosts', desc:'Promotions et offres spéciales',    default:false },
  ];

  const [settings, setSettings] = useState(Object.fromEntries(NOTIF_SETTINGS.map(n => [n.id, n.default])));
  const [history,  setHistory]  = useState(HISTORY);

  const toggleSetting = (id) => setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  const markAllRead   = () => setHistory(prev => prev.map(n => ({ ...n, read:true })));
  const markOneRead   = (id) => setHistory(prev => prev.map(n => n.id === id ? {...n, read:true} : n));
  const unreadCount   = history.filter(n => !n.read).length;

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
        <Text style={styles.headerTitle}>🔔 {t('notifications')}</Text>
        <Text style={styles.headerSub}>
          {unreadCount > 0 ? `${unreadCount} ${t('unread')}` : t('allRead')}
        </Text>
        <View style={styles.headerWave} />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding:14, paddingBottom:40 }}>
        <View style={styles.grantedCard}>
          <Text style={{ fontSize:24 }}>✅</Text>
          <View style={{ flex:1 }}>
            <Text style={styles.grantedTitle}>{t('notifications')} activées</Text>
            <Text style={styles.grantedSub}>Tu recevras toutes les alertes TripMeet</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('preferences')}</Text>
        <View style={styles.settingsCard}>
          {NOTIF_SETTINGS.map((notif, i) => (
            <View key={notif.id} style={[styles.settingRow, i < NOTIF_SETTINGS.length-1 && styles.settingBorder]}>
              <View style={styles.settingIcon}><Text style={{ fontSize:20 }}>{notif.icon}</Text></View>
              <View style={{ flex:1 }}>
                <Text style={styles.settingTitle}>{notif.title}</Text>
                <Text style={styles.settingDesc}>{notif.desc}</Text>
              </View>
              <Switch value={settings[notif.id]} onValueChange={() => toggleSetting(notif.id)} trackColor={{ false:'#ccc', true:'#E8327A' }} thumbColor="#fff" />
            </View>
          ))}
        </View>

        <View style={styles.histHeader}>
          <Text style={styles.sectionTitle}>{t('history')}</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markReadTxt}>{t('markAllRead')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.histCard}>
          {history.map((notif, i) => (
            <TouchableOpacity key={notif.id} style={[styles.histRow, !notif.read && styles.histRowUnread, i < history.length-1 && styles.histBorder]} onPress={() => markOneRead(notif.id)}>
              <View style={[styles.histIcon, !notif.read && styles.histIconUnread]}>
                <Text style={{ fontSize:18 }}>{notif.icon}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={[styles.histTitle, !notif.read && { fontWeight:'900' }]}>{notif.title}</Text>
                <Text style={styles.histBody}>{notif.body}</Text>
                <Text style={styles.histTime}>{notif.time}</Text>
              </View>
              {!notif.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </View>
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
  headerSub: { color:'rgba(255,255,255,0.75)', fontSize:11, marginTop:2 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  grantedCard: { backgroundColor:'#EAFAF1', borderRadius:14, borderWidth:1.5, borderColor:'#A8E6C0', padding:14, flexDirection:'row', alignItems:'center', gap:10, marginBottom:16 },
  grantedTitle: { fontSize:13, fontWeight:'800', color:'#0D3547' },
  grantedSub: { fontSize:11, color:'#5E9DB8', marginTop:2 },
  sectionTitle: { fontSize:11, fontWeight:'800', color:'#0D3547', letterSpacing:1, textTransform:'uppercase', marginBottom:10, marginTop:4 },
  settingsCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', marginBottom:16, overflow:'hidden' },
  settingRow: { flexDirection:'row', alignItems:'center', gap:12, padding:14 },
  settingBorder: { borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  settingIcon: { width:40, height:40, borderRadius:12, backgroundColor:'#FDF9F4', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#B5DCEA' },
  settingTitle: { fontSize:13, fontWeight:'800', color:'#0D3547' },
  settingDesc: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  histHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10, marginTop:4 },
  markReadTxt: { fontSize:11, color:'#2AABDC', fontWeight:'700' },
  histCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', overflow:'hidden' },
  histRow: { flexDirection:'row', alignItems:'center', gap:12, padding:14 },
  histRowUnread: { backgroundColor:'#FFF8F8' },
  histBorder: { borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  histIcon: { width:42, height:42, borderRadius:12, backgroundColor:'#FDF9F4', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#B5DCEA' },
  histIconUnread: { backgroundColor:'#FFF0EE', borderColor:'#FFD4CE' },
  histTitle: { fontSize:12, fontWeight:'700', color:'#0D3547' },
  histBody: { fontSize:11, color:'#5E9DB8', marginTop:2 },
  histTime: { fontSize:9, color:'#ccc', marginTop:3 },
  unreadDot: { width:9, height:9, borderRadius:5, backgroundColor:'#E8327A' },
});