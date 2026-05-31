import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ActivityIndicator, Alert, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

const ADMIN_EMAIL = 'faroukbouzouaoui@gmail.com';

const MOCK_STATS = {
  totalUsers:    247,
  activeToday:   38,
  newThisWeek:   12,
  totalHotels:   89,
  totalMessages: 1423,
  totalMatches:  156,
  reports:       3,
  blocked:       7,
};

const MOCK_USERS = [
  { id:1, name:'Emma Dupont',   email:'emma@gmail.com',   hotel:'Mercure Toulouse', status:'active',  joined:'12 mai 2025',  flag:'🇫🇷' },
  { id:2, name:'Léa Martin',    email:'lea@gmail.com',    hotel:'Novotel Wilson',   status:'active',  joined:'15 mai 2025',  flag:'🇧🇪' },
  { id:3, name:'Marc Schmidt',  email:'marc@gmail.com',   hotel:'Ibis Toulouse',    status:'banned',  joined:'3 mai 2025',   flag:'🇩🇪' },
  { id:4, name:'Sofia Garcia',  email:'sofia@gmail.com',  hotel:'Crowne Plaza',     status:'active',  joined:'20 mai 2025',  flag:'🇪🇸' },
  { id:5, name:'Ali Hassan',    email:'ali@gmail.com',    hotel:'Grand Hôtel',      status:'pending', joined:'28 mai 2025',  flag:'🇸🇦' },
];

const MOCK_REPORTS = [
  { id:1, reporter:'Emma D.',  reported:'Marc S.',  reason:'Comportement inapproprié', date:'29 mai 2025', status:'pending' },
  { id:2, reporter:'Léa M.',   reported:'Ali H.',   reason:'Fausse identité',          date:'30 mai 2025', status:'pending' },
  { id:3, reporter:'Sofia G.', reported:'Marc S.',  reason:'Messages harcelants',      date:'31 mai 2025', status:'resolved' },
];

const TABS = ['📊 Stats', '👥 Utilisateurs', '🚨 Signalements', '🏨 Hôtels'];

export default function AdminScreen({ navigation }) {
  const [activeTab,   setActiveTab]   = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [isAdmin,     setIsAdmin]     = useState(false);
  const [checking,    setChecking]    = useState(true);
  const [searchUser,  setSearchUser]  = useState('');
  const [reports,     setReports]     = useState(MOCK_REPORTS);
  const [users,       setUsers]       = useState(MOCK_USERS);

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.email === ADMIN_EMAIL);
    } catch(e) {
      setIsAdmin(false);
    } finally {
      setChecking(false);
    }
  };

  const handleBanUser = (user) => {
    Alert.alert(
      '🚫 Bannir l\'utilisateur',
      `Veux-tu bannir ${user.name} ?`,
      [
        { text:'Annuler', style:'cancel' },
        { text:'Bannir', style:'destructive', onPress: () => {
          setUsers(prev => prev.map(u => u.id === user.id ? {...u, status:'banned'} : u));
          Alert.alert('✅ Utilisateur banni', `${user.name} a été banni.`);
        }},
      ]
    );
  };

  const handleUnban = (user) => {
    Alert.alert('✅ Débannir', `Veux-tu débannir ${user.name} ?`, [
      { text:'Annuler', style:'cancel' },
      { text:'Débannir', onPress: () => {
        setUsers(prev => prev.map(u => u.id === user.id ? {...u, status:'active'} : u));
      }},
    ]);
  };

  const handleResolveReport = (id) => {
    setReports(prev => prev.map(r => r.id === id ? {...r, status:'resolved'} : r));
    Alert.alert('✅ Signalement résolu');
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (checking) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <ActivityIndicator size="large" color="#E8327A" />
    </View>
  );

  if (!isAdmin) return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4', alignItems:'center', justifyContent:'center', padding:30 }}>
      <Text style={{ fontSize:60, marginBottom:16 }}>🔒</Text>
      <Text style={{ fontSize:20, fontWeight:'900', color:'#0D3547', textAlign:'center', marginBottom:8 }}>Accès refusé</Text>
      <Text style={{ fontSize:13, color:'#5E9DB8', textAlign:'center', marginBottom:24 }}>
        Tu n'as pas les droits d'accès au tableau de bord admin.
      </Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <LinearGradient colors={['#E8327A','#F07030']} style={{ borderRadius:26, paddingVertical:13, paddingHorizontal:30 }}>
          <Text style={{ color:'#fff', fontWeight:'900' }}>← Retour</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>

      {/* Header */}
      <LinearGradient colors={['#0D3547','#1A8BB8']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
            <Text style={{ fontSize:20 }}>⚙️</Text>
            <Text style={styles.logoTxt}>Admin TripMeet</Text>
          </View>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeTxt}>ADMIN</Text>
          </View>
        </View>
        <Text style={styles.headerSub}>Tableau de bord · {new Date().toLocaleDateString('fr-FR')}</Text>
        <View style={styles.headerWave} />
      </LinearGradient>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        <View style={styles.tabs}>
          {TABS.map((tab, i) => (
            <TouchableOpacity key={i} style={[styles.tab, activeTab === i && styles.tabActive]} onPress={() => setActiveTab(i)}>
              <Text style={[styles.tabTxt, activeTab === i && styles.tabTxtActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:14, paddingBottom:40 }}>

        {/* ── STATS ── */}
        {activeTab === 0 && (
          <View style={{ gap:12 }}>
            <View style={styles.statsGrid}>
              {[
                { icon:'👥', label:'Utilisateurs',  val:MOCK_STATS.totalUsers,    color:'#2AABDC' },
                { icon:'🟢', label:'Actifs aujourd\'hui', val:MOCK_STATS.activeToday, color:'#2ECC71' },
                { icon:'✨', label:'Nouveaux / semaine', val:MOCK_STATS.newThisWeek, color:'#E8327A' },
                { icon:'💬', label:'Messages',      val:MOCK_STATS.totalMessages, color:'#F07030' },
                { icon:'💫', label:'Matchs',        val:MOCK_STATS.totalMatches,  color:'#9B59B6' },
                { icon:'🏨', label:'Hôtels actifs', val:MOCK_STATS.totalHotels,   color:'#C9A84C' },
                { icon:'🚨', label:'Signalements',  val:MOCK_STATS.reports,       color:'#E74C3C' },
                { icon:'🚫', label:'Bannis',        val:MOCK_STATS.blocked,       color:'#95A5A6' },
              ].map((stat, i) => (
                <View key={i} style={styles.statCard}>
                  <Text style={{ fontSize:24 }}>{stat.icon}</Text>
                  <Text style={[styles.statNum, { color:stat.color }]}>{stat.val}</Text>
                  <Text style={styles.statLbl}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Graphique simplifié */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>📈 Inscriptions cette semaine</Text>
              <View style={styles.chart}>
                {[3,7,5,12,8,15,10].map((val, i) => (
                  <View key={i} style={styles.chartCol}>
                    <LinearGradient colors={['#E8327A','#F07030']} style={[styles.chartBar, { height: val * 8 }]} />
                    <Text style={styles.chartDay}>{['L','M','M','J','V','S','D'][i]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Répartition langues */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>🌍 Répartition par langue</Text>
              {[
                { lang:'🇫🇷 Français', pct:38, color:'#2AABDC' },
                { lang:'🇸🇦 Arabe',    pct:24, color:'#E8327A' },
                { lang:'🇬🇧 Anglais',  pct:18, color:'#2ECC71' },
                { lang:'🇪🇸 Espagnol', pct:12, color:'#F07030' },
                { lang:'🇩🇪 Allemand', pct:5,  color:'#9B59B6' },
                { lang:'🇮🇹 Italien',  pct:3,  color:'#C9A84C' },
              ].map(l => (
                <View key={l.lang} style={styles.langRow}>
                  <Text style={styles.langName}>{l.lang}</Text>
                  <View style={styles.langBarBg}>
                    <View style={[styles.langBarFill, { width:`${l.pct}%`, backgroundColor:l.color }]} />
                  </View>
                  <Text style={styles.langPct}>{l.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── UTILISATEURS ── */}
        {activeTab === 1 && (
          <View style={{ gap:10 }}>
            <TextInput
              style={styles.searchInput}
              value={searchUser}
              onChangeText={setSearchUser}
              placeholder="🔍 Rechercher un utilisateur..."
              placeholderTextColor="#ccc"
            />
            {filteredUsers.map(user => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userTop}>
                  <View style={styles.userAv}>
                    <Text style={{ fontSize:20 }}>{user.flag}</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userHotel}>🏨 {user.hotel}</Text>
                  </View>
                  <View style={[styles.statusBadge, {
                    backgroundColor: user.status === 'active' ? '#EAFAF1' : user.status === 'banned' ? '#FFF0EE' : '#FFF8E8',
                    borderColor: user.status === 'active' ? '#A8E6C0' : user.status === 'banned' ? '#FFD4CE' : '#F0E0B0',
                  }]}>
                    <Text style={[styles.statusTxt, {
                      color: user.status === 'active' ? '#2ECC71' : user.status === 'banned' ? '#E8327A' : '#C9A84C'
                    }]}>
                      {user.status === 'active' ? '✓ Actif' : user.status === 'banned' ? '✗ Banni' : '⏳ Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.userJoined}>Inscrit le {user.joined}</Text>
                <View style={styles.userActions}>
                  <TouchableOpacity style={styles.userActionBtn}>
                    <Text style={styles.userActionTxt}>👁️ Voir profil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.userActionBtn}>
                    <Text style={styles.userActionTxt}>💬 Voir messages</Text>
                  </TouchableOpacity>
                  {user.status !== 'banned' ? (
                    <TouchableOpacity style={[styles.userActionBtn, styles.userActionDanger]} onPress={() => handleBanUser(user)}>
                      <Text style={[styles.userActionTxt, { color:'#E8327A' }]}>🚫 Bannir</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[styles.userActionBtn, styles.userActionSuccess]} onPress={() => handleUnban(user)}>
                      <Text style={[styles.userActionTxt, { color:'#2ECC71' }]}>✓ Débannir</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── SIGNALEMENTS ── */}
        {activeTab === 2 && (
          <View style={{ gap:10 }}>
            <View style={styles.reportAlert}>
              <Text style={{ fontSize:20 }}>🚨</Text>
              <Text style={styles.reportAlertTxt}>
                {reports.filter(r => r.status === 'pending').length} signalement(s) en attente
              </Text>
            </View>
            {reports.map(report => (
              <View key={report.id} style={[styles.reportCard, report.status === 'resolved' && styles.reportCardResolved]}>
                <View style={styles.reportTop}>
                  <View style={{ flex:1 }}>
                    <Text style={styles.reportTitle}>🚨 {report.reason}</Text>
                    <Text style={styles.reportMeta}>
                      <Text style={{ fontWeight:'700' }}>{report.reporter}</Text> → <Text style={{ fontWeight:'700', color:'#E8327A' }}>{report.reported}</Text>
                    </Text>
                    <Text style={styles.reportDate}>📅 {report.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, {
                    backgroundColor: report.status === 'pending' ? '#FFF8E8' : '#EAFAF1',
                    borderColor: report.status === 'pending' ? '#F0E0B0' : '#A8E6C0',
                  }]}>
                    <Text style={{ fontSize:9, fontWeight:'800', color: report.status === 'pending' ? '#C9A84C' : '#2ECC71' }}>
                      {report.status === 'pending' ? '⏳ En attente' : '✓ Résolu'}
                    </Text>
                  </View>
                </View>
                {report.status === 'pending' && (
                  <View style={styles.reportActions}>
                    <TouchableOpacity style={styles.reportBtn} onPress={() => handleResolveReport(report.id)}>
                      <Text style={styles.reportBtnTxt}>✓ Marquer résolu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.reportBtn, styles.reportBtnDanger]} onPress={() => {
                      const user = users.find(u => u.name.startsWith(report.reported.split(' ')[0]));
                      if (user) handleBanUser(user);
                    }}>
                      <Text style={[styles.reportBtnTxt, { color:'#E8327A' }]}>🚫 Bannir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── HÔTELS ── */}
        {activeTab === 3 && (
          <View style={{ gap:10 }}>
            {[
              { name:'Mercure Toulouse Centre Wilson', stars:4, solos:4,  city:'Toulouse',  active:true  },
              { name:'Novotel Toulouse Wilson',        stars:4, solos:3,  city:'Toulouse',  active:true  },
              { name:"Grand Hôtel de l'Opéra",         stars:5, solos:2,  city:'Toulouse',  active:true  },
              { name:'Ibis Toulouse Centre',           stars:3, solos:4,  city:'Toulouse',  active:true  },
              { name:'Pullman Paris Tour Eiffel',      stars:5, solos:12, city:'Paris',     active:true  },
              { name:'Marriott Lyon',                  stars:5, solos:6,  city:'Lyon',      active:false },
            ].map((hotel, i) => (
              <View key={i} style={styles.hotelCard}>
                <View style={styles.hotelTop}>
                  <Text style={{ fontSize:22 }}>🏨</Text>
                  <View style={{ flex:1 }}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.hotelMeta}>{'★'.repeat(hotel.stars)} · {hotel.city}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: hotel.active ? '#EAFAF1' : '#FFF0EE', borderColor: hotel.active ? '#A8E6C0' : '#FFD4CE' }]}>
                    <Text style={{ fontSize:9, fontWeight:'800', color: hotel.active ? '#2ECC71' : '#E8327A' }}>
                      {hotel.active ? '✓ Actif' : '✗ Inactif'}
                    </Text>
                  </View>
                </View>
                <View style={styles.hotelStats}>
                  <View style={styles.hotelStat}>
                    <Text style={styles.hotelStatNum}>{hotel.solos}</Text>
                    <Text style={styles.hotelStatLbl}>Solos actifs</Text>
                  </View>
                  <View style={styles.hotelStat}>
                    <Text style={styles.hotelStatNum}>{Math.floor(Math.random()*50)+10}</Text>
                    <Text style={styles.hotelStatLbl}>Total membres</Text>
                  </View>
                  <View style={styles.hotelStat}>
                    <Text style={styles.hotelStatNum}>{Math.floor(Math.random()*100)+20}</Text>
                    <Text style={styles.hotelStatLbl}>Messages</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6 },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.15)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  adminBadge: { backgroundColor:'#E8327A', borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  adminBadgeTxt: { color:'#fff', fontSize:9, fontWeight:'900', letterSpacing:1 },
  headerSub: { color:'rgba(255,255,255,0.7)', fontSize:11 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  tabsScroll: { backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#B5DCEA', maxHeight:46 },
  tabs: { flexDirection:'row', paddingHorizontal:8 },
  tab: { paddingHorizontal:14, paddingVertical:12, borderBottomWidth:2.5, borderBottomColor:'transparent' },
  tabActive: { borderBottomColor:'#E8327A' },
  tabTxt: { fontSize:11, fontWeight:'700', color:'#ccc' },
  tabTxtActive: { color:'#E8327A' },
  statsGrid: { flexDirection:'row', flexWrap:'wrap', gap:10 },
  statCard: { width:'47%', backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', padding:14, alignItems:'center', gap:4 },
  statNum: { fontSize:26, fontWeight:'900' },
  statLbl: { fontSize:10, color:'#5E9DB8', fontWeight:'700', textAlign:'center' },
  chartCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:16 },
  chartTitle: { fontSize:13, fontWeight:'800', color:'#0D3547', marginBottom:14 },
  chart: { flexDirection:'row', alignItems:'flex-end', gap:8, height:120, justifyContent:'space-between' },
  chartCol: { flex:1, alignItems:'center', gap:6 },
  chartBar: { width:'100%', borderRadius:6, minHeight:8 },
  chartDay: { fontSize:10, color:'#5E9DB8', fontWeight:'700' },
  langRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:8 },
  langName: { fontSize:11, fontWeight:'700', color:'#0D3547', width:90 },
  langBarBg: { flex:1, height:8, backgroundColor:'#EEE', borderRadius:4, overflow:'hidden' },
  langBarFill: { height:8, borderRadius:4 },
  langPct: { fontSize:11, fontWeight:'800', color:'#5E9DB8', width:35, textAlign:'right' },
  searchInput: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:13, padding:11, fontSize:13, color:'#0D3547', backgroundColor:'#fff' },
  userCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:13 },
  userTop: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:6 },
  userAv: { width:44, height:44, borderRadius:22, backgroundColor:'#EAF7FD', alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:'#B5DCEA' },
  userName: { fontSize:13, fontWeight:'900', color:'#0D3547' },
  userEmail: { fontSize:10, color:'#5E9DB8', marginTop:1 },
  userHotel: { fontSize:10, color:'#C9A84C', marginTop:1 },
  userJoined: { fontSize:10, color:'#ccc', marginBottom:10 },
  statusBadge: { borderRadius:20, paddingHorizontal:9, paddingVertical:4, borderWidth:1 },
  statusTxt: { fontSize:9, fontWeight:'800' },
  userActions: { flexDirection:'row', gap:6 },
  userActionBtn: { flex:1, borderWidth:1, borderColor:'#B5DCEA', borderRadius:20, paddingVertical:7, alignItems:'center', backgroundColor:'#fff' },
  userActionDanger: { borderColor:'#FFD4CE', backgroundColor:'#FFF0EE' },
  userActionSuccess: { borderColor:'#A8E6C0', backgroundColor:'#EAFAF1' },
  userActionTxt: { fontSize:10, fontWeight:'700', color:'#5E9DB8' },
  reportAlert: { flexDirection:'row', alignItems:'center', gap:10, backgroundColor:'#FFF8E8', borderRadius:12, padding:12, borderWidth:1, borderColor:'#F0E0B0' },
  reportAlertTxt: { fontSize:13, fontWeight:'800', color:'#C9A84C', flex:1 },
  reportCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#FFD4CE', padding:13 },
  reportCardResolved: { borderColor:'#B5DCEA', opacity:0.7 },
  reportTop: { flexDirection:'row', alignItems:'flex-start', gap:10, marginBottom:10 },
  reportTitle: { fontSize:13, fontWeight:'800', color:'#0D3547' },
  reportMeta: { fontSize:11, color:'#5E9DB8', marginTop:3 },
  reportDate: { fontSize:10, color:'#ccc', marginTop:2 },
  reportActions: { flexDirection:'row', gap:8 },
  reportBtn: { flex:1, borderWidth:1, borderColor:'#A8E6C0', borderRadius:20, paddingVertical:8, alignItems:'center', backgroundColor:'#EAFAF1' },
  reportBtnDanger: { borderColor:'#FFD4CE', backgroundColor:'#FFF0EE' },
  reportBtnTxt: { fontSize:11, fontWeight:'700', color:'#2ECC71' },
  hotelCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:13 },
  hotelTop: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  hotelName: { fontSize:12, fontWeight:'900', color:'#0D3547' },
  hotelMeta: { fontSize:9, color:'#C9A84C', marginTop:2 },
  hotelStats: { flexDirection:'row', gap:8 },
  hotelStat: { flex:1, backgroundColor:'#FDF9F4', borderRadius:10, padding:9, alignItems:'center' },
  hotelStatNum: { fontSize:18, fontWeight:'900', color:'#1A8BB8' },
  hotelStatLbl: { fontSize:8, color:'#5E9DB8', fontWeight:'700', marginTop:1, textAlign:'center' },
});