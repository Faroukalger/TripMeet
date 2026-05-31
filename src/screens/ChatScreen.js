import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator, Modal, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

export default function ChatScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { conversationId, otherUser } = route.params || {
    conversationId: 'demo',
    otherUser: { prenom:'Emma', nom:'', bg:'#FFD4E8', dest:'✈️ Bali → Lisbonne', online:true }
  };

  const [messages,    setMessages]    = useState([]);
  const [newMsg,      setNewMsg]      = useState('');
  const [loading,     setLoading]     = useState(true);
  const [sending,     setSending]     = useState(false);
  const [userId,      setUserId]      = useState(null);
  const [showAttach,  setShowAttach]  = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { initChat(); return () => { supabase.removeAllChannels(); }; }, []);

  const initChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
      setMessages([
        { id:'1', sender_id:'other', content:'Salut ! Je vois qu\'on fait tous les deux Barcelone → Lisbonne 😮', type:'text', created_at: new Date(Date.now()-300000).toISOString() },
        { id:'2', sender_id: user?.id, content:'Oui exactement ! Tu pars quand ? 🌍', type:'text', created_at: new Date(Date.now()-240000).toISOString() },
        { id:'3', sender_id:'other', content:'Le 12 août depuis Barcelone ✈️ Tu connais Lisbonne ?', type:'text', created_at: new Date(Date.now()-180000).toISOString() },
        { id:'4', sender_id: user?.id, content:'Jamais été ! C\'est mon premier voyage là-bas 🙌', type:'text', created_at: new Date(Date.now()-120000).toISOString() },
        { id:'5', sender_id:'other', content:'On devrait visiter Alfama ensemble ! 🏛', type:'text', created_at: new Date(Date.now()-60000).toISOString() },
      ]);
      setLoading(false);
    } catch(e) {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const content = newMsg.trim();
    setNewMsg('');
    const demoMsg = { id: Date.now().toString(), sender_id: userId || 'me', content, type:'text', created_at: new Date().toISOString() };
    setMessages(prev => [...prev, demoMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
    setTimeout(() => {
      const replies = ['Super idée ! 😄', 'Oui, j\'adorerais ! ✈️', 'On se retrouve à l\'aéroport ? 🏖', 'Tu as déjà réservé ton hôtel là-bas ?', 'Génial ! 🎉'];
      const reply = { id: (Date.now()+1).toString(), sender_id:'other', content: replies[Math.floor(Math.random()*replies.length)], type:'text', created_at: new Date().toISOString() };
      setMessages(prev => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
      setSending(false);
    }, 2000);
    setSending(true);
  };

  const pickImage = async () => {
    setShowAttach(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { alert('Permission refusée !'); return; }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setUploading(true);
        const imageMsg = {
          id: Date.now().toString(),
          sender_id: userId || 'me',
          content: result.assets[0].uri,
          type: 'image',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, imageMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
        setUploading(false);
        setTimeout(() => {
          const reply = { id: (Date.now()+1).toString(), sender_id:'other', content:'Belle photo ! 😍', type:'text', created_at: new Date().toISOString() };
          setMessages(prev => [...prev, reply]);
        }, 2000);
      }
    } catch(e) {
      setUploading(false);
      console.log('Erreur image:', e);
    }
  };

  const takePhoto = async () => {
    setShowAttach(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { alert('Permission caméra refusée !'); return; }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        const imageMsg = {
          id: Date.now().toString(),
          sender_id: userId || 'me',
          content: result.assets[0].uri,
          type: 'image',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, imageMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
      }
    } catch(e) {
      console.log('Erreur caméra:', e);
    }
  };

  const pickDocument = async () => {
    setShowAttach(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets[0]) {
        const docMsg = {
          id: Date.now().toString(),
          sender_id: userId || 'me',
          content: result.assets[0].name,
          uri: result.assets[0].uri,
          size: result.assets[0].size,
          type: 'document',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, docMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
      }
    } catch(e) {
      console.log('Erreur document:', e);
    }
  };

  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  const formatSize = (bytes) => bytes ? `${(bytes/1024).toFixed(0)} Ko` : '';
  const isMe = (senderId) => senderId === userId || senderId === 'me';

  const renderMessage = (msg, i) => {
    const me = isMe(msg.sender_id);
    return (
      <View key={msg.id || i} style={[styles.msgRow, me && styles.msgRowMe]}>
        {!me && (
          <View style={[styles.msgAvatar, { backgroundColor: otherUser?.bg || '#FFD4E8' }]}>
            <Text style={{ fontSize:13 }}>🙂</Text>
          </View>
        )}
        <View style={{ maxWidth:'72%' }}>
          {msg.type === 'image' ? (
            <View style={[styles.imageBubble, me && styles.imageBubbleMe]}>
              <Image source={{ uri: msg.content }} style={styles.chatImage} resizeMode="cover" />
              <Text style={[styles.bubbleTime, me && { color:'rgba(255,255,255,0.7)' }, { paddingHorizontal:8, paddingBottom:4 }]}>
                {formatTime(msg.created_at)}
              </Text>
            </View>
          ) : msg.type === 'document' ? (
            <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleHer]}>
              <View style={styles.docBubble}>
                <Text style={{ fontSize:24 }}>📄</Text>
                <View style={{ flex:1 }}>
                  <Text style={[styles.docName, me && { color:'#fff' }]} numberOfLines={1}>{msg.content}</Text>
                  {msg.size && <Text style={[styles.docSize, me && { color:'rgba(255,255,255,0.7)' }]}>{formatSize(msg.size)}</Text>}
                </View>
              </View>
              <Text style={[styles.bubbleTime, me && { color:'rgba(255,255,255,0.7)' }]}>{formatTime(msg.created_at)}</Text>
            </View>
          ) : (
            <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleHer]}>
              <Text style={[styles.bubbleTxt, me && { color:'#fff' }]}>{msg.content}</Text>
              <Text style={[styles.bubbleTime, me && { color:'rgba(255,255,255,0.7)' }]}>{formatTime(msg.created_at)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={{ flex:1, backgroundColor:'#F7F7F7' }}>

        <LinearGradient colors={['#E8327A','#F07030']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={{ color:'#fff', fontSize:22 }}>‹</Text>
            </TouchableOpacity>
            <View style={[styles.avatar, { backgroundColor: otherUser?.bg || '#FFD4E8' }]}>
              <Text style={{ fontSize:20 }}>🙂</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={styles.userName}>{otherUser?.prenom} {otherUser?.nom}</Text>
              <Text style={styles.userStatus}>
                {otherUser?.online ? `🟢 ${t('online')}` : `⚫ ${t('offline')}`} · {otherUser?.dest || '✈️ Voyageur solo'}
              </Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={{ fontSize:20 }}>📞</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.destBanner}>
            <Text style={styles.destBannerTxt}>✈️ Barcelone → Lisbonne · 12–18 août 2025</Text>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
            <ActivityIndicator size="large" color="#E8327A" />
          </View>
        ) : (
          <ScrollView ref={scrollRef} style={{ flex:1 }} contentContainerStyle={{ padding:14, gap:10 }} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated:false })}>
            <View style={styles.dateSep}>
              <View style={styles.dateLine} />
              <Text style={styles.dateTxt}>Aujourd'hui</Text>
              <View style={styles.dateLine} />
            </View>
            {messages.map((msg, i) => renderMessage(msg, i))}
            {sending && (
              <View style={styles.msgRow}>
                <View style={[styles.msgAvatar, { backgroundColor: otherUser?.bg || '#FFD4E8' }]}>
                  <Text style={{ fontSize:13 }}>🙂</Text>
                </View>
                <View style={[styles.bubble, styles.bubbleHer, { paddingVertical:10 }]}>
                  <Text style={{ color:'#bbb', fontSize:18, letterSpacing:4 }}>• • •</Text>
                </View>
              </View>
            )}
            {uploading && (
              <View style={[styles.msgRow, styles.msgRowMe]}>
                <View style={[styles.bubble, styles.bubbleMe, { paddingVertical:12, paddingHorizontal:20 }]}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={{ color:'rgba(255,255,255,0.8)', fontSize:11, marginTop:4 }}>Envoi...</Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Barre d'envoi */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn} onPress={() => setShowAttach(true)}>
            <Text style={{ fontSize:22 }}>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={newMsg}
            onChangeText={setNewMsg}
            placeholder={t('typeMessage')}
            placeholderTextColor="#ccc"
            multiline
          />
          <TouchableOpacity onPress={sendMessage} disabled={!newMsg.trim()}>
            <LinearGradient colors={newMsg.trim() ? ['#E8327A','#F07030'] : ['#ccc','#ccc']} style={styles.sendBtn}>
              <Text style={{ color:'#fff', fontSize:16 }}>➤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Modal pièces jointes */}
        <Modal visible={showAttach} transparent animationType="slide">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowAttach(false)} activeOpacity={1}>
            <View style={styles.attachModal}>
              <View style={styles.attachHandle} />
              <Text style={styles.attachTitle}>Envoyer un fichier</Text>
              <View style={styles.attachGrid}>
                {[
                  { icon:'🖼️', label:'Galerie photos', onPress: pickImage },
                  { icon:'📷', label:'Prendre une photo', onPress: takePhoto },
                  { icon:'📄', label:'Document', onPress: pickDocument },
                  { icon:'🗺️', label:'Ma position', onPress: () => { setShowAttach(false); alert('Fonctionnalité bientôt disponible !'); } },
                ].map((item, i) => (
                  <TouchableOpacity key={i} style={styles.attachItem} onPress={item.onPress}>
                    <LinearGradient colors={['#E8327A','#F07030']} style={styles.attachItemIcon}>
                      <Text style={{ fontSize:24 }}>{item.icon}</Text>
                    </LinearGradient>
                    <Text style={styles.attachItemLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAttach(false)}>
                <Text style={styles.cancelBtnTxt}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal:14, paddingTop:50, paddingBottom:0 },
  headerTop: { flexDirection:'row', alignItems:'center', gap:10, paddingBottom:12 },
  backBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  avatar: { width:42, height:42, borderRadius:21, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:'rgba(255,255,255,0.5)' },
  userName: { color:'#fff', fontSize:15, fontWeight:'900' },
  userStatus: { color:'rgba(255,255,255,0.75)', fontSize:10, marginTop:1 },
  callBtn: { width:34, height:34, borderRadius:17, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  destBanner: { backgroundColor:'rgba(0,0,0,0.15)', padding:8, alignItems:'center' },
  destBannerTxt: { fontSize:11, fontWeight:'800', color:'rgba(255,255,255,0.95)' },
  dateSep: { flexDirection:'row', alignItems:'center', gap:8, marginVertical:6 },
  dateLine: { flex:1, height:1, backgroundColor:'#E0E0E0' },
  dateTxt: { fontSize:10, color:'#bbb', fontWeight:'700' },
  msgRow: { flexDirection:'row', alignItems:'flex-end', gap:7, marginBottom:4 },
  msgRowMe: { flexDirection:'row-reverse' },
  msgAvatar: { width:28, height:28, borderRadius:14, alignItems:'center', justifyContent:'center', flexShrink:0 },
  bubble: { maxWidth:'100%', padding:10, borderRadius:18 },
  bubbleHer: { backgroundColor:'#fff', borderBottomLeftRadius:4, borderWidth:1, borderColor:'#EBEBEB' },
  bubbleMe: { backgroundColor:'#2AABDC', borderBottomRightRadius:4 },
  bubbleTxt: { fontSize:13, color:'#0D3547', lineHeight:19 },
  bubbleTime: { fontSize:9, color:'#bbb', marginTop:4, textAlign:'right' },
  imageBubble: { borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#EBEBEB' },
  imageBubbleMe: { borderColor:'#2AABDC' },
  chatImage: { width:200, height:150 },
  docBubble: { flexDirection:'row', alignItems:'center', gap:8, marginBottom:4 },
  docName: { fontSize:12, fontWeight:'700', color:'#0D3547', flex:1 },
  docSize: { fontSize:9, color:'#5E9DB8', marginTop:2 },
  inputBar: { flexDirection:'row', alignItems:'center', gap:8, padding:10, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#B5DCEA' },
  attachBtn: { padding:4 },
  input: { flex:1, backgroundColor:'#F4F4F4', borderRadius:22, paddingHorizontal:14, paddingVertical:9, fontSize:13, color:'#0D3547', maxHeight:100 },
  sendBtn: { width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center' },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  attachModal: { backgroundColor:'#fff', borderRadius:24, padding:20, margin:0, paddingBottom:34 },
  attachHandle: { width:40, height:4, borderRadius:2, backgroundColor:'#ccc', alignSelf:'center', marginBottom:16 },
  attachTitle: { fontSize:16, fontWeight:'900', color:'#0D3547', textAlign:'center', marginBottom:20 },
  attachGrid: { flexDirection:'row', flexWrap:'wrap', gap:16, justifyContent:'center', marginBottom:16 },
  attachItem: { alignItems:'center', gap:8, width:80 },
  attachItemIcon: { width:60, height:60, borderRadius:20, alignItems:'center', justifyContent:'center' },
  attachItemLabel: { fontSize:11, fontWeight:'700', color:'#0D3547', textAlign:'center' },
  cancelBtn: { borderRadius:26, paddingVertical:13, alignItems:'center', backgroundColor:'#EAF7FD' },
  cancelBtnTxt: { color:'#2AABDC', fontWeight:'800', fontSize:13 },
});