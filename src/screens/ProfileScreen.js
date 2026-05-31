import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }) {
  const [user,     setUser]     = useState(null);
  const [profile,  setProfile]  = useState(null);
  const [stay,     setStay]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [interests, setInterests] = useState([]);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // 1. Utilisateur connecté
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (!authUser) {
        navigation.navigate('Login');
        return;
      }

      // 2. Profil depuis Supabase
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setProfile(profileData);

      if (profileData?.styles_voyage) {
        setInterests(profileData.styles_voyage.map(s => ({ label: s, active: true })));
      }

      // 3. Séjour hôtel actif
      const { data: stayData } = await supabase
        .from('stays')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('is_active', true)
        .single();

      setStay(stayData);

    } catch (e) {
      console.log('Erreur profil:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (index) => {
    setInterests(prev => prev.map((item, i) =>
      i === index ? { ...item, active: !item.active } : item
    ));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate('Splash');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
  };

  const getAge = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  if (loading) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#FDF9F4' }}>
      <ActivityIndicator size="large" color="#E8327A" />
      <Text style={{ color:'#5E9DB8', marginTop:12, fontWeight:'600' }}>Chargement du profil...</Text>
    </View>
  );

  const prenom = profile?.prenom || user?.user_metadata?.prenom || 'Voyageur';
  const nom    = profile?.nom    || user?.user_metadata?.nom    || '';
  const age    = getAge(profile?.date_naissance);
  const ville  = profile?.ville  || '';
  const pays   = profile?.pays   || '';
  const bio    = profile?.bio    || '';

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>
      <ScrollView contentContainerStyle={{ paddingBottom:90 }}>

        {/* Hero */}
        <LinearGradient colors={['#E8327A','#F07030']} style={styles.hero}>
          <View style={styles.heroDeco1} />
          <View style={styles.heroDeco2} />
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#E8327A','#F07030']} style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={{ fontSize:32 }}>🙂</Text>
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={{ fontSize:12, color:'#fff' }}>✎</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{ padding:16, paddingTop:44 }}>

          {/* Nom réel depuis Supabase */}
          <Text style={styles.profileName}>{prenom} {nom}</Text>
          {age ? <Text style={styles.profileAge}>{age} ans</Text> : null}
          <Text style={styles.profileLoc}>
            {ville && pays ? `📍 ${ville}, ${pays}` : ville ? `📍 ${ville}` : pays ? `📍 ${pays}` : '📍 Localisation non renseignée'}
          </Text>

          {/* Email */}
          <Text style={styles.profileEmail}>✉️ {user?.email}</Text>

          {/* Hôtel actif depuis Supabase */}
          {stay ? (
            <View style={styles.hotelCard}>
              <View style={styles.hotelCardTop}>
                <Text style={{ fontSize:22 }}>🏨</Text>
                <View style={{ flex:1 }}>
                  <Text style={styles.hotelCardName}>{stay.hotel_nom}</Text>
                  <Text style={styles.hotelCardStars}>{'★'.repeat(stay.hotel_etoiles || 4)} · Chambre {stay.chambre || 'N/A'}</Text>
                  <Text style={styles.hotelCardDates}>📅 {formatDate(stay.checkin)} → {formatDate(stay.checkout)}</Text>
                </View>
                <View style={styles.hotelBadge}>
                  <Text style={styles.hotelBadgeTxt}>✓ Actif</Text>
                </View>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addHotelBtn} onPress={() => navigation.navigate('CheckIn')}>
              <Text style={styles.addHotelTxt}>🏨 Ajouter mon hôtel actuel</Text>
            </TouchableOpacity>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              ['0',  'Pays'],
              ['0',  'Matchs'],
              [profile ? '80%' : '40%', 'Profil'],
            ].map(([val, lbl]) => (
              <View key={lbl} style={styles.statItem}>
                <Text style={styles.statVal}>{val}</Text>
                <Text style={styles.statLbl}>{lbl}</Text>
              </View>
            ))}
          </View>

          {/* Bio */}
          <Text style={styles.sectionTitle}>Ma bio</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioTxt}>
              {bio || '✏️ Ajoute une bio pour te présenter aux autres voyageurs !'}
            </Text>
            <TouchableOpacity style={styles.editBioBtn}>
              <Text style={styles.editBioTxt}>✎ Modifier</Text>
            </TouchableOpacity>
          </View>

          {/* Style de voyage */}
          {interests.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Style de voyage</Text>
              <View style={styles.interestsGrid}>
                {interests.map((item, i) => (
                  <TouchableOpacity key={i} onPress={() => toggleInterest(i)}>
                    {item.active ? (
                      <LinearGradient colors={['#E8327A','#F07030']} style={styles.chipActive}>
                        <Text style={styles.chipActiveTxt}>{item.label}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.chip}>
                        <Text style={styles.chipTxt}>{item.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Infos compte */}
          <View style={styles.accountCard}>
            <Text style={styles.sectionTitle}>Mon compte</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountLbl}>📧 Email</Text>
              <Text style={styles.accountVal}>{user?.email}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLbl}>✅ Email vérifié</Text>
              <Text style={[styles.accountVal, { color: user?.email_confirmed_at ? '#2ECC71' : '#E8327A' }]}>
                {user?.email_confirmed_at ? 'Oui ✓' : 'Non ✗'}
              </Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLbl}>📅 Membre depuis</Text>
              <Text style={styles.accountVal}>{formatDate(user?.created_at)}</Text>
            </View>
          </View>

          {/* Boost */}
          <LinearGradient colors={['#1A8BB8','#2AABDC']} style={styles.boostCard}>
            <Text style={{ fontSize:24 }}>✈️</Text>
            <View style={{ flex:1 }}>
              <Text style={styles.boostTitle}>Booster mon profil</Text>
              <Text style={styles.boostSub}>Visible dans 5 nouvelles destinations</Text>
            </View>
            <TouchableOpacity style={styles.boostBtn}>
              <Text style={styles.boostBtnTxt}>Activer</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Déconnexion */}
          <TouchableOpacity style={styles.langBtn} onPress={() => navigation.navigate('Language')}>
            <Text style={styles.langBtnTxt}>🌍 Changer la langue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutTxt}>🚪 Se déconnecter</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {[['🏨','Hôtel','Hotel'],['💬','Messages','Messages'],['🌍','Explorer','Map'],['👤','Profil','Profile']].map(([icon, label, screen]) => (
          <TouchableOpacity key={screen} style={styles.navItem} onPress={() => screen !== 'Profile' && navigation.navigate(screen)}>
            <Text style={styles.navIcon}>{icon}</Text>
            <Text style={[styles.navLabel, screen === 'Profile' && { color:'#2AABDC' }]}>{label}</Text>
            {screen === 'Profile' && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { height:160, position:'relative', overflow:'hidden' },
  heroDeco1: { position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:60, backgroundColor:'rgba(255,255,255,0.08)' },
  heroDeco2: { position:'absolute', bottom:10, left:-20, width:80, height:80, borderRadius:40, backgroundColor:'rgba(255,255,255,0.06)' },
  avatarWrap: { position:'absolute', bottom:-36, left:'50%', marginLeft:-36 },
  avatarRing: { width:72, height:72, borderRadius:36, padding:3 },
  avatar: { flex:1, borderRadius:33, backgroundColor:'#D6F0FA', alignItems:'center', justifyContent:'center', borderWidth:3, borderColor:'#fff' },
  editBtn: { position:'absolute', bottom:0, right:0, width:22, height:22, borderRadius:11, backgroundColor:'#2AABDC', alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'#fff' },
  profileName: { fontSize:22, fontWeight:'900', color:'#0D3547', textAlign:'center' },
  profileAge: { fontSize:13, color:'#5E9DB8', textAlign:'center', marginTop:2, fontWeight:'600' },
  profileLoc: { fontSize:12, color:'#2AABDC', textAlign:'center', marginTop:3, fontWeight:'700' },
  profileEmail: { fontSize:11, color:'#5E9DB8', textAlign:'center', marginTop:3, marginBottom:14 },
  hotelCard: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', padding:12, marginBottom:14 },
  hotelCardTop: { flexDirection:'row', alignItems:'center', gap:10 },
  hotelCardName: { fontSize:13, fontWeight:'900', color:'#0D3547' },
  hotelCardStars: { fontSize:10, color:'#C9A84C', marginTop:2 },
  hotelCardDates: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  hotelBadge: { backgroundColor:'#EAFAF1', borderRadius:20, paddingHorizontal:9, paddingVertical:4, borderWidth:1, borderColor:'#A8E6C0' },
  hotelBadgeTxt: { fontSize:9, fontWeight:'800', color:'#2ECC71' },
  addHotelBtn: { borderWidth:2, borderColor:'#B5DCEA', borderRadius:14, borderStyle:'dashed', padding:14, alignItems:'center', marginBottom:14, backgroundColor:'#EAF7FD' },
  addHotelTxt: { fontSize:13, fontWeight:'700', color:'#2AABDC' },
  statsRow: { flexDirection:'row', backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', overflow:'hidden', marginBottom:16 },
  statItem: { flex:1, alignItems:'center', paddingVertical:12, borderRightWidth:1, borderRightColor:'#B5DCEA' },
  statVal: { fontSize:20, fontWeight:'900', color:'#1A8BB8' },
  statLbl: { fontSize:10, color:'#5E9DB8', fontWeight:'700', marginTop:1 },
  sectionTitle: { fontSize:11, fontWeight:'800', color:'#0D3547', letterSpacing:1, textTransform:'uppercase', marginBottom:10, marginTop:4 },
  bioCard: { backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', padding:14, marginBottom:16 },
  bioTxt: { fontSize:13, color:'#0D3547', lineHeight:20 },
  editBioBtn: { marginTop:10, alignSelf:'flex-end' },
  editBioTxt: { fontSize:12, color:'#2AABDC', fontWeight:'700' },
  interestsGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:16 },
  chip: { paddingHorizontal:12, paddingVertical:6, borderRadius:20, backgroundColor:'#D6F0FA', borderWidth:1, borderColor:'#B5DCEA' },
  chipTxt: { fontSize:12, fontWeight:'700', color:'#1A8BB8' },
  chipActive: { paddingHorizontal:12, paddingVertical:6, borderRadius:20 },
  chipActiveTxt: { fontSize:12, fontWeight:'700', color:'#fff' },
  accountCard: { backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', padding:14, marginBottom:16 },
  accountRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  accountLbl: { fontSize:12, color:'#5E9DB8', fontWeight:'600' },
  accountVal: { fontSize:12, color:'#0D3547', fontWeight:'700', maxWidth:'55%', textAlign:'right' },
  boostCard: { borderRadius:16, padding:14, flexDirection:'row', alignItems:'center', gap:12, marginBottom:16 },
  boostTitle: { fontSize:14, fontWeight:'900', color:'#fff' },
  boostSub: { fontSize:10, color:'rgba(255,255,255,0.75)', marginTop:2 },
  boostBtn: { backgroundColor:'#fff', borderRadius:20, paddingHorizontal:14, paddingVertical:7 },
  boostBtnTxt: { fontSize:11, fontWeight:'800', color:'#1A8BB8' },
  langBtn: { alignItems:'center', paddingVertical:14, borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', backgroundColor:'#EAF7FD', marginBottom:8 },
  langBtnTxt: { fontSize:13, fontWeight:'700', color:'#2AABDC' },
  logoutBtn: { alignItems:'center', paddingVertical:14, borderRadius:14, borderWidth:1.5, borderColor:'#FFD4CE', backgroundColor:'#FFF0EE', marginBottom:8 },
  logoutTxt: { fontSize:13, fontWeight:'700', color:'#E8327A' },
  bottomNav: { flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderTopWidth:1, borderTopColor:'#B5DCEA', backgroundColor:'#fff', position:'absolute', bottom:0, left:0, right:0 },
  navItem: { alignItems:'center', gap:2 },
  navIcon: { fontSize:20 },
  navLabel: { fontSize:10, fontWeight:'700', color:'#ccc' },
  navDot: { width:5, height:5, borderRadius:3, backgroundColor:'#2AABDC', marginTop:1 },
});
