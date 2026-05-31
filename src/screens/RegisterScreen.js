import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';

const STEPS = [
  { id:1, title:'Qui es-tu ?',         icon:'👤', sub:'Tes informations personnelles'    },
  { id:2, title:'D\'où viens-tu ?',    icon:'🌍', sub:'Ton pays et ta ville d\'origine'  },
  { id:3, title:'Ton hôtel actuel',    icon:'🏨', sub:'Où séjournes-tu en ce moment ?'   },
  { id:4, title:'Ton style de voyage', icon:'🎒', sub:'Comment tu voyages ?'              },
  { id:5, title:'Ta photo & bio',      icon:'📸', sub:'Présente-toi aux autres voyageurs' },
];

const STYLES_VOYAGE = [
  { label:'🎒 Backpacker',    desc:'Sac à dos, auberge, aventure' },
  { label:'🏖 Plage & Soleil', desc:'Farniente, mer, détente'      },
  { label:'🏛 Culture',       desc:'Musées, histoire, patrimoine'  },
  { label:'🍜 Gastronomie',   desc:'Street food, restos locaux'    },
  { label:'🏔 Trek & Nature',  desc:'Randonnée, camping, grand air' },
  { label:'💼 Business',      desc:'Voyage professionnel'          },
];

const PAYS = ['France','Algérie','Maroc','Tunisie','Belgique','Suisse','Canada','Sénégal','Côte d\'Ivoire','Autre'];

const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
};

const toISODate = (date) => {
  if (!date) return null;
  return date.toISOString().split('T')[0];
};

export default function RegisterScreen({ navigation }) {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState({
    prenom:'', nom:'', dateNaissance:null, genre:'',
    email:'', password:'',
    pays:'', ville:'',
    hotelNom:'', hotelEtoiles:'4', checkin:null, checkout:null, chambre:'',
    stylesVoyage:[],
    bio:'',
  });

  const [showPicker, setShowPicker]   = useState(false);
  const [pickerField, setPickerField] = useState(null);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleStyle = (label) => {
    setForm(prev => ({
      ...prev,
      stylesVoyage: prev.stylesVoyage.includes(label)
        ? prev.stylesVoyage.filter(s => s !== label)
        : [...prev.stylesVoyage, label]
    }));
  };

  const openPicker = (field) => {
    setPickerField(field);
    setShowPicker(true);
  };

  const nextStep = async () => {
    setError('');
    if (step < STEPS.length) {
      setStep(step + 1);
      return;
    }

    // Étape finale — inscription Supabase
    setLoading(true);
    try {
      // 1. Créer le compte auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { prenom: form.prenom, nom: form.nom },
          emailRedirectTo: 'https://tripmeet.app/bienvenue',
        }
      });

      if (authError) throw authError;

      const userId = authData.user?.id;

      // 2. Créer le profil
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          prenom: form.prenom,
          nom: form.nom,
          date_naissance: toISODate(form.dateNaissance),
          genre: form.genre,
          pays: form.pays,
          ville: form.ville,
          bio: form.bio,
          styles_voyage: form.stylesVoyage,
        });

        // 3. Créer le séjour hôtel
        if (form.hotelNom) {
          await supabase.from('stays').insert({
            user_id: userId,
            hotel_nom: form.hotelNom,
            hotel_etoiles: parseInt(form.hotelEtoiles),
            checkin: toISODate(form.checkin),
            checkout: toISODate(form.checkout),
            chambre: form.chambre,
          });
        }
      }

      // 4. Aller à l'écran de confirmation email
      navigation.navigate('EmailConfirm', { email: form.email, prenom: form.prenom });

    } catch (e) {
      setError(e.message || 'Une erreur est survenue. Réessaie.');
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / STEPS.length) * 100;

  const DateField = ({ label, field, placeholder }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={[styles.input, styles.dateField]} onPress={() => openPicker(field)}>
        <Text style={form[field] ? styles.dateValue : styles.datePlaceholder}>
          {form[field] ? formatDate(form[field]) : placeholder}
        </Text>
        <Text style={{ fontSize:18 }}>📅</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex:1, backgroundColor:'#FDF9F4' }}>

        <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => step > 1 ? setStep(step-1) : navigation.goBack()} style={styles.backBtn}>
              <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
            </TouchableOpacity>
            <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
              <View style={styles.logoRing}><Text style={{ fontSize:11 }}>✈️</Text></View>
              <Text style={styles.logoTxt}>TripMeet</Text>
            </View>
            <View style={{ width:36 }} />
          </View>
          <Text style={styles.stepLabel}>Étape {step} / {STEPS.length}</Text>
          <Text style={styles.stepTitle}>{STEPS[step-1].icon} {STEPS[step-1].title}</Text>
          <Text style={styles.stepSub}>{STEPS[step-1].sub}</Text>
          <View style={styles.headerWave} />
        </LinearGradient>

        <View style={styles.progressBg}>
          <LinearGradient colors={['#E8327A','#F07030']} style={[styles.progressFill, { width:`${progress}%` }]} />
        </View>

        <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16, paddingBottom:30 }} keyboardShouldPersistTaps="handled">

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorTxt}>⚠️ {error}</Text>
            </View>
          ) : null}

          {/* ÉTAPE 1 */}
          {step === 1 && (
            <View style={{ gap:12 }}>
              <View style={styles.row}>
                <View style={{ flex:1 }}>
                  <Text style={styles.label}>Prénom *</Text>
                  <TextInput style={styles.input} value={form.prenom} onChangeText={v => update('prenom',v)} placeholder="Ex. Sylviane" placeholderTextColor="#ccc" />
                </View>
                <View style={{ flex:1 }}>
                  <Text style={styles.label}>Nom *</Text>
                  <TextInput style={styles.input} value={form.nom} onChangeText={v => update('nom',v)} placeholder="Ex. Mali" placeholderTextColor="#ccc" />
                </View>
              </View>
              <DateField label="Date de naissance *" field="dateNaissance" placeholder="Sélectionne ta date de naissance" />
              <View>
                <Text style={styles.label}>Email *</Text>
                <TextInput style={styles.input} value={form.email} onChangeText={v => update('email',v)} placeholder="exemple@email.com" placeholderTextColor="#ccc" keyboardType="email-address" autoCapitalize="none" />
              </View>
              <View>
                <Text style={styles.label}>Mot de passe *</Text>
                <TextInput style={styles.input} value={form.password} onChangeText={v => update('password',v)} placeholder="Min. 8 caractères" placeholderTextColor="#ccc" secureTextEntry />
              </View>
              <View>
                <Text style={styles.label}>Genre</Text>
                <View style={styles.genderRow}>
                  {['👨 Homme','👩 Femme','🏳️‍🌈 Autre'].map(g => (
                    <TouchableOpacity key={g} style={[styles.genderBtn, form.genre === g && styles.genderBtnActive]} onPress={() => update('genre', g)}>
                      <Text style={[styles.genderTxt, form.genre === g && styles.genderTxtActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* ÉTAPE 2 */}
          {step === 2 && (
            <View style={{ gap:12 }}>
              <View>
                <Text style={styles.label}>Pays d'origine *</Text>
                <View style={styles.paysGrid}>
                  {PAYS.map(p => (
                    <TouchableOpacity key={p} style={[styles.paysBtn, form.pays === p && styles.paysBtnActive]} onPress={() => update('pays', p)}>
                      <Text style={[styles.paysTxt, form.pays === p && styles.paysTxtActive]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View>
                <Text style={styles.label}>Ville d'origine *</Text>
                <TextInput style={styles.input} value={form.ville} onChangeText={v => update('ville',v)} placeholder="Ex. Paris, Alger, Casablanca..." placeholderTextColor="#ccc" />
              </View>
              <View style={styles.infoBanner}>
                <Text>🌍</Text>
                <Text style={styles.infoTxt}>Ta ville aide les autres voyageurs à te situer et créer des connexions.</Text>
              </View>
            </View>
          )}

          {/* ÉTAPE 3 */}
          {step === 3 && (
            <View style={{ gap:12 }}>
              <View>
                <Text style={styles.label}>Nom de l'hôtel *</Text>
                <TextInput style={styles.input} value={form.hotelNom} onChangeText={v => update('hotelNom',v)} placeholder="Ex. Mercure Toulouse Centre..." placeholderTextColor="#ccc" />
              </View>
              <View>
                <Text style={styles.label}>Nombre d'étoiles</Text>
                <View style={styles.starsRow}>
                  {['1','2','3','4','5'].map(s => (
                    <TouchableOpacity key={s} style={[styles.starBtn, form.hotelEtoiles === s && styles.starBtnActive]} onPress={() => update('hotelEtoiles', s)}>
                      <Text style={styles.starTxt}>{'★'.repeat(parseInt(s))}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <DateField label="Date d'arrivée *" field="checkin" placeholder="Sélectionne ta date d'arrivée" />
              <DateField label="Date de départ *"  field="checkout" placeholder="Sélectionne ta date de départ" />
              <View>
                <Text style={styles.label}>Numéro de chambre</Text>
                <TextInput style={styles.input} value={form.chambre} onChangeText={v => update('chambre',v)} placeholder="Ex. 412" placeholderTextColor="#ccc" keyboardType="numeric" />
              </View>
              <View style={styles.infoBanner}>
                <Text>🔒</Text>
                <Text style={styles.infoTxt}>Ton numéro de chambre reste privé. Seul l'hôtel et tes dates sont visibles.</Text>
              </View>
            </View>
          )}

          {/* ÉTAPE 4 */}
          {step === 4 && (
            <View style={{ gap:10 }}>
              <Text style={styles.selectHint}>Sélectionne un ou plusieurs styles 👇</Text>
              {STYLES_VOYAGE.map((s, i) => {
                const isActive = form.stylesVoyage.includes(s.label);
                return (
                  <TouchableOpacity key={i} style={[styles.styleCard, isActive && styles.styleCardActive]} onPress={() => toggleStyle(s.label)}>
                    <Text style={styles.styleIcon}>{s.label.split(' ')[0]}</Text>
                    <View style={{ flex:1 }}>
                      <Text style={[styles.styleName, isActive && { color:'#1A8BB8' }]}>{s.label}</Text>
                      <Text style={styles.styleDesc}>{s.desc}</Text>
                    </View>
                    <View style={[styles.styleCheck, isActive && styles.styleCheckActive]}>
                      {isActive && <Text style={{ color:'#fff', fontSize:11 }}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* ÉTAPE 5 */}
          {step === 5 && (
            <View style={{ gap:14 }}>
              <TouchableOpacity style={styles.photoUpload}>
                <Text style={{ fontSize:40 }}>📷</Text>
                <Text style={styles.photoTxt}>Ajoute ta meilleure photo</Text>
                <Text style={styles.photoSub}>JPG, PNG · Max 10 Mo</Text>
              </TouchableOpacity>
              <View style={styles.tipsRow}>
                {[['😊','Sourire visible'],['🌅','En voyage'],['🚫','Pas de filtre']].map(([icon, txt]) => (
                  <View key={txt} style={styles.tip}>
                    <Text style={{ fontSize:18 }}>{icon}</Text>
                    <Text style={styles.tipTxt}>{txt}</Text>
                  </View>
                ))}
              </View>
              <View>
                <Text style={styles.label}>Ta bio de voyageur</Text>
                <TextInput style={[styles.input, { height:90, textAlignVertical:'top' }]} value={form.bio} onChangeText={v => update('bio',v)} placeholder="Ex. Backpacker passionné · 14 pays · toujours partant pour une nouvelle aventure !" placeholderTextColor="#ccc" multiline maxLength={150} />
                <Text style={styles.charCount}>{form.bio.length} / 150</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>📋 Récapitulatif</Text>
                {[
                  ['👤 Nom',      `${form.prenom} ${form.nom}`],
                  ['🎂 Naissance', form.dateNaissance ? formatDate(form.dateNaissance) : ''],
                  ['🌍 Origine',   `${form.ville}${form.pays ? ', '+form.pays : ''}`],
                  ['🏨 Hôtel',    form.hotelNom],
                  ['📅 Arrivée',  form.checkin ? formatDate(form.checkin) : ''],
                  ['📅 Départ',   form.checkout ? formatDate(form.checkout) : ''],
                ].filter(([,val]) => val.trim()).map(([lbl, val]) => (
                  <View key={lbl} style={styles.summaryRow}>
                    <Text style={styles.summaryLbl}>{lbl}</Text>
                    <Text style={styles.summaryVal}>{val}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        </ScrollView>

        <View style={{ padding:16 }}>
          <TouchableOpacity onPress={nextStep} disabled={loading}>
            <LinearGradient colors={['#E8327A','#F07030']} style={[styles.nextBtn, loading && { opacity:0.7 }]}>
              <Text style={styles.nextBtnTxt}>
                {loading ? '⏳ Création du compte...'
                  : step === STEPS.length ? '🚀 Créer mon compte TripMeet !'
                  : `Continuer · Étape ${step}/${STEPS.length} →`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* CALENDRIER */}
        {showPicker && (
          <Modal transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {pickerField === 'dateNaissance' ? '🎂 Date de naissance'
                      : pickerField === 'checkin' ? '✈️ Date d\'arrivée'
                      : '🏠 Date de départ'}
                  </Text>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={{ fontSize:20, color:'#5E9DB8' }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <input
                  type="date"
                  style={{ width:'100%', padding:14, fontSize:16, borderRadius:12, border:'1.5px solid #B5DCEA', color:'#0D3547', backgroundColor:'#fff', fontFamily:'inherit', marginBottom:16 }}
                  onChange={(e) => {
                    if (e.target.value) update(pickerField, new Date(e.target.value));
                  }}
                />
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <LinearGradient colors={['#E8327A','#F07030']} style={styles.confirmBtn}>
                    <Text style={styles.confirmBtnTxt}>✓ Confirmer la date</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:16, paddingTop:50, paddingBottom:20, position:'relative' },
  headerTop: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  logoRing: { width:24, height:24, borderRadius:12, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  logoTxt: { color:'#fff', fontSize:16, fontWeight:'900' },
  stepLabel: { fontSize:10, fontWeight:'800', color:'rgba(255,255,255,0.65)', letterSpacing:1.5, textTransform:'uppercase', marginBottom:3 },
  stepTitle: { fontSize:20, fontWeight:'900', color:'#fff' },
  stepSub: { fontSize:11, color:'rgba(255,255,255,0.72)', marginTop:2 },
  headerWave: { position:'absolute', bottom:-1, left:0, right:0, height:14, backgroundColor:'#FDF9F4', borderRadius:999 },
  progressBg: { height:4, backgroundColor:'#EEE' },
  progressFill: { height:4, borderRadius:2 },
  errorBanner: { backgroundColor:'#FFF0EE', borderRadius:12, padding:12, marginBottom:12, borderWidth:1, borderColor:'#FFD4CE' },
  errorTxt: { fontSize:12, color:'#E8327A', fontWeight:'600' },
  label: { fontSize:10, fontWeight:'800', color:'#0D3547', textTransform:'uppercase', letterSpacing:1, marginBottom:5 },
  input: { borderWidth:1.5, borderColor:'#B5DCEA', borderRadius:13, padding:11, fontSize:13, color:'#0D3547', backgroundColor:'#fff' },
  dateField: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  dateValue: { fontSize:13, color:'#0D3547', fontWeight:'600' },
  datePlaceholder: { fontSize:13, color:'#ccc' },
  row: { flexDirection:'row', gap:10 },
  genderRow: { flexDirection:'row', gap:8 },
  genderBtn: { flex:1, paddingVertical:10, borderRadius:13, borderWidth:1.5, borderColor:'#B5DCEA', backgroundColor:'#fff', alignItems:'center' },
  genderBtnActive: { backgroundColor:'#D6F0FA', borderColor:'#2AABDC' },
  genderTxt: { fontSize:11, fontWeight:'700', color:'#5E9DB8' },
  genderTxtActive: { color:'#1A8BB8' },
  paysGrid: { flexDirection:'row', flexWrap:'wrap', gap:8, marginTop:4 },
  paysBtn: { paddingHorizontal:12, paddingVertical:7, borderRadius:20, borderWidth:1.5, borderColor:'#B5DCEA', backgroundColor:'#fff' },
  paysBtnActive: { backgroundColor:'#2AABDC', borderColor:'#2AABDC' },
  paysTxt: { fontSize:12, fontWeight:'700', color:'#5E9DB8' },
  paysTxtActive: { color:'#fff' },
  starsRow: { flexDirection:'row', gap:8 },
  starBtn: { flex:1, paddingVertical:9, borderRadius:12, borderWidth:1.5, borderColor:'#B5DCEA', backgroundColor:'#fff', alignItems:'center' },
  starBtnActive: { backgroundColor:'#FFF8E8', borderColor:'#C9A84C' },
  starTxt: { fontSize:10, color:'#C9A84C' },
  infoBanner: { flexDirection:'row', gap:8, backgroundColor:'#EAF7FD', borderRadius:12, padding:12, borderWidth:1, borderColor:'#B5DCEA', alignItems:'flex-start' },
  infoTxt: { flex:1, fontSize:11, color:'#1A8BB8', lineHeight:17, fontWeight:'600' },
  selectHint: { fontSize:12, color:'#5E9DB8', fontWeight:'600', marginBottom:4 },
  styleCard: { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', padding:13 },
  styleCardActive: { borderColor:'#2AABDC', backgroundColor:'#EAF7FD' },
  styleIcon: { fontSize:24 },
  styleName: { fontSize:13, fontWeight:'800', color:'#0D3547' },
  styleDesc: { fontSize:10, color:'#5E9DB8', marginTop:2 },
  styleCheck: { width:22, height:22, borderRadius:11, borderWidth:1.5, borderColor:'#B5DCEA', alignItems:'center', justifyContent:'center' },
  styleCheckActive: { backgroundColor:'#2AABDC', borderColor:'#2AABDC' },
  photoUpload: { borderWidth:2, borderColor:'#B5DCEA', borderRadius:20, borderStyle:'dashed', height:130, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', gap:8 },
  photoTxt: { fontSize:13, fontWeight:'700', color:'#5E9DB8' },
  photoSub: { fontSize:10, color:'#ccc' },
  tipsRow: { flexDirection:'row', gap:8 },
  tip: { flex:1, backgroundColor:'#fff', borderRadius:12, borderWidth:1, borderColor:'#B5DCEA', padding:10, alignItems:'center', gap:4 },
  tipTxt: { fontSize:9, color:'#5E9DB8', fontWeight:'600', textAlign:'center' },
  charCount: { fontSize:9, color:'#ccc', textAlign:'right', marginTop:4 },
  summaryCard: { backgroundColor:'#fff', borderRadius:14, borderWidth:1.5, borderColor:'#B5DCEA', padding:14 },
  summaryTitle: { fontSize:12, fontWeight:'800', color:'#0D3547', marginBottom:10 },
  summaryRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:6, borderBottomWidth:1, borderBottomColor:'#EAF7FD' },
  summaryLbl: { fontSize:11, color:'#5E9DB8', fontWeight:'600' },
  summaryVal: { fontSize:11, color:'#0D3547', fontWeight:'700', maxWidth:'60%', textAlign:'right' },
  nextBtn: { borderRadius:26, paddingVertical:15, alignItems:'center' },
  nextBtnTxt: { color:'#fff', fontSize:14, fontWeight:'900' },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  modalCard: { backgroundColor:'#fff', borderRadius:24, padding:20, margin:12, paddingBottom:30 },
  modalHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 },
  modalTitle: { fontSize:16, fontWeight:'900', color:'#0D3547' },
  confirmBtn: { borderRadius:26, paddingVertical:14, alignItems:'center', marginTop:8 },
  confirmBtnTxt: { color:'#fff', fontSize:14, fontWeight:'900' },
});
