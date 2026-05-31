import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Switch, Modal, TextInput, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

const REPORT_REASONS = [
  '🚫 Comportement inapproprié',
  '📸 Fausse photo de profil',
  '💬 Messages harcelants',
  '🔞 Contenu inapproprié',
  '🎭 Fausse identité',
  '⚠️ Autre raison',
];

export default function SecurityScreen({ navigation }) {
  const { t } = useLanguage();

  // Paramètres de confidentialité
  const [hideRoom,      setHideRoom]      = useState(true);
  const [hideLastName,  setHideLastName]  = useState(false);
  const [hideAge,       setHideAge]       = useState(false);
  const [onlyHotel,     setOnlyHotel]     = useState(false);
  const [hideOrigin,    setHideOrigin]    = useState(false);
  const [invisible,     setInvisible]     = useState(false);

  // Modals
  const [showReport,   setShowReport]   = useState(false);
  const [showBlock,    setShowBlock]    = useState(false);
  const [showCGU,      setShowCGU]      = useState(false);
  const [showPrivacy,  setShowPrivacy]  = useState(false);
  const [showDelete,   setShowDelete]   = useState(false);

  // Signalement
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [reportName,   setReportName]   = useState('');

  // Blocage
  const [blockName, setBlockName] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([
    { id:1, name:'Utilisateur inconnu', date:'12 mai 2025' },
  ]);

  const handleReport = () => {
    if (!reportReason) { Alert.alert('Attention', 'Sélectionne une raison.'); return; }
    Alert.alert('✅ Signalement envoyé', 'Notre équipe va examiner ce signalement sous 24h. Merci de nous aider à garder TripMeet sûr !');
    setShowReport(false);
    setReportReason('');
    setReportDetail('');
    setReportName('');
  };

  const handleBlock = () => {
    if (!blockName.trim()) return;
    setBlockedUsers(prev => [...prev, { id: Date.now(), name: blockName, date: new Date().toLocaleDateString('fr-FR') }]);
    setBlockName('');
    Alert.alert('✅ Utilisateur bloqué', `${blockName} ne pourra plus te contacter ni voir ton profil.`);
  };

  const handleUnblock = (id, name) => {
    Alert.alert('Débloquer', `Veux-tu débloquer ${name} ?`, [
      { text:'Annuler', style:'cancel' },
      { text:'Débloquer', onPress: () => setBlockedUsers(prev => prev.filter(u => u.id !== id)) },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Supprimer mon compte',
      'Cette action est irréversible. Toutes tes données seront supprimées.',
      [
        { text:'Annuler', style:'cancel' },
        { text:'Supprimer', style:'destructive', onPress: async () => {
          await supabase.auth.signOut();
          navigation.navigate('Splash');
        }},
      ]
    );
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
          <View style={{ width:34 }} />
        </View>
        <Text style={styles.headerTitle}>🔒 Sécurité & Confidentialité</Text>
        <Text style={styles.headerSub}>Contrôle ta visibilité et ta sécurité</Text>
        <View style={styles.headerWave} />
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:40 }}>

        {/* Statut de sécurité */}
        <LinearGradient colors={['#1A8BB8','#2AABDC']} style={styles.securityScore}>
          <View style={{ flexDirection:'row', alignItems:'center', gap:12 }}>
            <Text style={{ fontSize:36 }}>🛡️</Text>
            <View style={{ flex:1 }}>
              <Text style={styles.scoreTitle}>Score de sécurité</Text>
              <Text style={styles.scoreVal}>Bon · 75%</Text>
            </View>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreFill, { width:'75%' }]} />
            </View>
          </View>
          <Text style={styles.scoreTip}>💡 Active "Mode invisible" pour atteindre 100%</Text>
        </LinearGradient>

        {/* Confidentialité du profil */}
        <Text style={styles.sectionTitle}>👤 Confidentialité du profil</Text>
        <View style={styles.card}>
          {[
            { label:'🔢 Masquer le numéro de chambre',  sub:'Seul l\'hôtel reste visible',          val:hideRoom,     set:setHideRoom     },
            { label:'👤 Masquer mon nom de famille',    sub:'Affiche seulement ton prénom',         val:hideLastName, set:setHideLastName },
            { label:'🎂 Masquer mon âge',               sub:'Ton âge ne sera pas affiché',          val:hideAge,      set:setHideAge      },
            { label:'🌍 Masquer mon pays d\'origine',   sub:'Ta localisation reste privée',         val:hideOrigin,   set:setHideOrigin   },
            { label:'🏨 Visible dans mon hôtel seulement', sub:'Ne pas apparaître dans le radar',  val:onlyHotel,    set:setOnlyHotel    },
            { label:'👻 Mode invisible',                sub:'Parcours sans être visible',           val:invisible,    set:setInvisible    },
          ].map((item, i, arr) => (
            <View key={i} style={[styles.settingRow, i < arr.length-1 && styles.settingBorder]}>
              <View style={{ flex:1 }}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingSub}>{item.sub}</Text>
              </View>
              <Switch
                value={item.val}
                onValueChange={item.set}
                trackColor={{ false:'#ccc', true:'#E8327A' }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {/* Actions de sécurité */}
        <Text style={styles.sectionTitle}>⚠️ Actions de sécurité</Text>
        <View style={styles.card}>

          {/* Signaler */}
          <TouchableOpacity style={styles.actionRow} onPress={() => setShowReport(true)}>
            <View style={[styles.actionIcon, { backgroundColor:'#FFF8E8' }]}>
              <Text style={{ fontSize:20 }}>🚨</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.actionLabel}>Signaler un utilisateur</Text>
              <Text style={styles.actionSub}>Comportement inapproprié, fausse identité...</Text>
            </View>
            <Text style={{ color:'#C9A84C', fontSize:18 }}>›</Text>
          </TouchableOpacity>

          <View style={styles.settingBorder} />

          {/* Bloquer */}
          <TouchableOpacity style={styles.actionRow} onPress={() => setShowBlock(true)}>
            <View style={[styles.actionIcon, { backgroundColor:'#FFF0EE' }]}>
              <Text style={{ fontSize:20 }}>🚫</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.actionLabel}>Bloquer un utilisateur</Text>
              <Text style={styles.actionSub}>{blockedUsers.length} utilisateur(s) bloqué(s)</Text>
            </View>
            <Text style={{ color:'#E8327A', fontSize:18 }}>›</Text>
          </TouchableOpacity>

        </View>

        {/* Documents légaux */}
        <Text style={styles.sectionTitle}>📋 Documents légaux</Text>
        <View style={styles.card}>
          {[
            { icon:'📄', label:'Conditions Générales d\'Utilisation', onPress:() => setShowCGU(true) },
            { icon:'🔐', label:'Politique de confidentialité',         onPress:() => setShowPrivacy(true) },
            { icon:'🍪', label:'Gestion des cookies',                  onPress:() => Alert.alert('Cookies', 'TripMeet utilise uniquement des cookies essentiels au fonctionnement de l\'app. Aucun cookie publicitaire.') },
            { icon:'📧', label:'Contacter le support',                 onPress:() => Alert.alert('Support', 'Email : support@tripmeet.app\nRéponse sous 24h.') },
          ].map((item, i, arr) => (
            <TouchableOpacity key={i} style={[styles.actionRow, i < arr.length-1 && styles.settingBorder]} onPress={item.onPress}>
              <View style={[styles.actionIcon, { backgroundColor:'#EAF7FD' }]}>
                <Text style={{ fontSize:20 }}>{item.icon}</Text>
              </View>
              <Text style={[styles.actionLabel, { flex:1 }]}>{item.label}</Text>
              <Text style={{ color:'#2AABDC', fontSize:18 }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Zone danger */}
        <Text style={styles.sectionTitle}>🗑️ Zone de danger</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteBtnTxt}>🗑️ Supprimer mon compte</Text>
        </TouchableOpacity>
        <Text style={styles.deleteNote}>Cette action est irréversible. Toutes tes données seront supprimées.</Text>

      </ScrollView>

      {/* ── MODAL SIGNALEMENT ── */}
      <Modal visible={showReport} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚨 Signaler un utilisateur</Text>
              <TouchableOpacity onPress={() => setShowReport(false)}>
                <Text style={{ fontSize:20, color:'#5E9DB8' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} value={reportName} onChangeText={setReportName} placeholder="Nom de l'utilisateur" placeholderTextColor="#ccc" />
            <Text style={styles.label}>Raison du signalement *</Text>
            <View style={styles.reasonsGrid}>
              {REPORT_REASONS.map(r => (
                <TouchableOpacity key={r} style={[styles.reasonBtn, reportReason === r && styles.reasonBtnActive]} onPress={() => setReportReason(r)}>
                  <Text style={[styles.reasonTxt, reportReason === r && styles.reasonTxtActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { marginTop:12 }]}>Détails (optionnel)</Text>
            <TextInput style={[styles.input, { height:80, textAlignVertical:'top' }]} value={reportDetail} onChangeText={setReportDetail} placeholder="Décris ce qui s'est passé..." placeholderTextColor="#ccc" multiline />
            <TouchableOpacity onPress={handleReport}>
              <LinearGradient colors={['#E8327A','#F07030']} style={styles.modalBtn}>
                <Text style={styles.modalBtnTxt}>🚨 Envoyer le signalement</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL BLOCAGE ── */}
      <Modal visible={showBlock} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚫 Bloquer un utilisateur</Text>
              <TouchableOpacity onPress={() => setShowBlock(false)}>
                <Text style={{ fontSize:20, color:'#5E9DB8' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.blockInput}>
              <TextInput style={[styles.input, { flex:1, marginBottom:0 }]} value={blockName} onChangeText={setBlockName} placeholder="Nom de l'utilisateur" placeholderTextColor="#ccc" />
              <TouchableOpacity onPress={handleBlock}>
                <LinearGradient colors={['#E8327A','#F07030']} style={styles.blockAddBtn}>
                  <Text style={{ color:'#fff', fontWeight:'800' }}>+ Bloquer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={[styles.label, { marginTop:14 }]}>Utilisateurs bloqués ({blockedUsers.length})</Text>
            {blockedUsers.map(u => (
              <View key={u.id} style={styles.blockedUser}>
                <View style={styles.blockedAv}><Text>🚫</Text></View>
                <View style={{ flex:1 }}>
                  <Text style={styles.blockedName}>{u.name}</Text>
                  <Text style={styles.blockedDate}>Bloqué le {u.date}</Text>
                </View>
                <TouchableOpacity style={styles.unblockBtn} onPress={() => handleUnblock(u.id, u.name)}>
                  <Text style={styles.unblockTxt}>Débloquer</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowBlock(false)}>
              <Text style={styles.closeBtnTxt}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL CGU ── */}
      <Modal visible={showCGU} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📄 CGU TripMeet</Text>
              <TouchableOpacity onPress={() => setShowCGU(false)}>
                <Text style={{ fontSize:20, color:'#5E9DB8' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight:300 }}>
              {[
                ['1. Objet', 'TripMeet est une application de rencontres pour voyageurs solo dans les hôtels. En utilisant TripMeet, vous acceptez ces conditions.'],
                ['2. Inscription', 'Vous devez avoir 18 ans minimum. Vos informations doivent être exactes et à jour. Un seul compte par personne est autorisé.'],
                ['3. Comportement', 'Tout comportement harcelant, inapproprié ou frauduleux entraîne la suppression immédiate du compte.'],
                ['4. Confidentialité', 'Vos données sont protégées conformément au RGPD. Voir notre politique de confidentialité.'],
                ['5. Propriété intellectuelle', 'Tout le contenu TripMeet est protégé. Reproduction interdite sans autorisation.'],
                ['6. Responsabilité', 'TripMeet n\'est pas responsable des rencontres physiques entre utilisateurs. Restez prudent(e).'],
                ['7. Modification', 'Ces CGU peuvent être modifiées. Les utilisateurs seront notifiés par email.'],
              ].map(([titre, texte]) => (
                <View key={titre} style={{ marginBottom:12 }}>
                  <Text style={{ fontWeight:'800', color:'#0D3547', marginBottom:4 }}>{titre}</Text>
                  <Text style={{ fontSize:12, color:'#5E9DB8', lineHeight:18 }}>{texte}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCGU(false)}>
              <Text style={styles.closeBtnTxt}>J'ai lu et compris</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL POLITIQUE DE CONFIDENTIALITÉ ── */}
      <Modal visible={showPrivacy} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔐 Politique de confidentialité</Text>
              <TouchableOpacity onPress={() => setShowPrivacy(false)}>
                <Text style={{ fontSize:20, color:'#5E9DB8' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight:300 }}>
              {[
                ['Données collectées', 'Nom, prénom, email, photo de profil, hôtel actuel, dates de séjour, messages. Aucune donnée bancaire.'],
                ['Utilisation', 'Vos données servent uniquement à faire fonctionner TripMeet. Elles ne sont jamais vendues à des tiers.'],
                ['Stockage', 'Données stockées sur Supabase (serveurs EU). Chiffrement AES-256 en transit et au repos.'],
                ['Vos droits (RGPD)', 'Droit d\'accès, rectification, suppression, portabilité. Contactez: privacy@tripmeet.app'],
                ['Conservation', 'Données conservées 2 ans après dernière connexion, puis supprimées automatiquement.'],
                ['Cookies', 'Uniquement des cookies essentiels au fonctionnement. Pas de cookies publicitaires.'],
                ['Contact DPO', 'privacy@tripmeet.app · Réponse sous 72h conformément au RGPD.'],
              ].map(([titre, texte]) => (
                <View key={titre} style={{ marginBottom:12 }}>
                  <Text style={{ fontWeight:'800', color:'#0D3547', marginBottom:4 }}>{titre}</Text>
                  <Text style={{ fontSize:12, color:'#5E9DB8', lineHeight:18 }}>{texte}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPrivacy(false)}>
              <Text style={styles.closeBtnTxt}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  securityScore: { borderRadius:16, padding:16, marginBottom:16 },
  scoreTitle: { color:'#fff', fontSize:13, fontWeight:'800' },
  scoreVal: { color:'rgba(255,255,255,0.85)', fontSize:11, marginTop:2 },
  scoreBar: { width:60, height:6, backgroundColor:'rgba(255,255,255,0.3)', borderRadius:3, overflow:'hidden' },
  scoreFill: { height:6, backgroundColor:'#fff', borderRadius:3 },
  scoreTip: { color:'rgba(255,255,255,0.8)', fontSize:10, marginTop:10 },
  sectionTitle: { fontSize:11, fontWeight:'800', color:'#0D3547', letterSpacing:1, textTransform:'uppercase', marginBottom:10, marginTop:8 },
  card: { backgroundColor:'#fff', borderRadius:16, borderWidth:1.5, borderColor:'#B5DCEA', marginBottom:16, overflow:'hidden' },
  settingRow: { flexDirection:'row', alignItems:'center', gap:12, padding:14 },
  settingBorder: { borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  settingLabel: { fontSize:13, fontWeight:'700', color:'#0D3547' },
  settingSub: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  actionRow: { flexDirection:'row', alignItems:'center', gap:12, padding:14 },
  actionIcon: { width:42, height:42, borderRadius:12, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#B5DCEA' },
  actionLabel: { fontSize:13, fontWeight:'700', color:'#0D3547' },
  actionSub: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  deleteBtn: { borderWidth:2, borderColor:'#FFD4CE', borderRadius:14, padding:14, alignItems:'center', backgroundColor:'#FFF0EE', marginBottom:8 },
  deleteBtnTxt: { fontSize:13, fontWeight:'800', color:'#E8327A' },
  deleteNote: { fontSize:10, color:'#ccc', textAlign:'center', lineHeight:16 },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  modalCard: { backgroundColor:'#fff', borderRadius:24, padding:20, margin:12, paddingBottom:30, maxHeight:'85%' },
  modalHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 },
  modalTitle: { fontSize:16, fontWeight:'900', color:'#0D3547' },
  modalBtn: { borderRadius:26, paddingVertical:14, alignItems:'center', marginTop:16 },
  modalBtnTxt: { color:'#fff', fontSize:14, fontWeight:'900' },
  label: { fontSize:10, fontWeight:'800', color:'#0D3547', textTransform:'uppercase', letterSpacing:1, marginBottom:6 },
  input: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:12, padding:11, fontSize:13, color:'#0D3547', backgroundColor:'#fff', marginBottom:10 },
  reasonsGrid: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  reasonBtn: { paddingHorizontal:11, paddingVertical:7, borderRadius:20, borderWidth:1.5, borderColor:'#B5DCEA', backgroundColor:'#fff' },
  reasonBtnActive: { backgroundColor:'#FFF0EE', borderColor:'#E8327A' },
  reasonTxt: { fontSize:11, fontWeight:'700', color:'#5E9DB8' },
  reasonTxtActive: { color:'#E8327A' },
  blockInput: { flexDirection:'row', gap:8, alignItems:'center', marginBottom:8 },
  blockAddBtn: { borderRadius:20, paddingHorizontal:14, paddingVertical:11 },
  blockedUser: { flexDirection:'row', alignItems:'center', gap:10, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  blockedAv: { width:36, height:36, borderRadius:18, backgroundColor:'#FFF0EE', alignItems:'center', justifyContent:'center' },
  blockedName: { fontSize:12, fontWeight:'700', color:'#0D3547' },
  blockedDate: { fontSize:10, color:'#5E9DB8' },
  unblockBtn: { paddingHorizontal:10, paddingVertical:5, borderRadius:20, borderWidth:1, borderColor:'#B5DCEA' },
  unblockTxt: { fontSize:10, fontWeight:'700', color:'#2AABDC' },
  closeBtn: { borderRadius:26, paddingVertical:13, alignItems:'center', backgroundColor:'#EAF7FD', marginTop:14 },
  closeBtnTxt: { color:'#2AABDC', fontWeight:'800', fontSize:13 },
});