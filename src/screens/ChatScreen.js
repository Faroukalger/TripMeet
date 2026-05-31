import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';

export default function ChatScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { conversationId, otherUser } = route.params || {
    conversationId: 'demo',
    otherUser: { prenom:'Emma', nom:'', bg:'#FFD4E8', dest:'✈️ Bali → Lisbonne', online:true }
  };

  const [messages,  setMessages]  = useState([]);
  const [newMsg,    setNewMsg]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [userId,    setUserId]    = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => { initChat(); return () => { supabase.removeAllChannels(); }; }, []);

  const initChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
      setMessages([
        { id:'1', sender_id:'other', content:'Salut ! Je vois qu\'on fait tous les deux Barcelone → Lisbonne 😮', created_at: new Date(Date.now()-300000).toISOString() },
        { id:'2', sender_id: user?.id, content:'Oui exactement ! Tu pars quand ? 🌍', created_at: new Date(Date.now()-240000).toISOString() },
        { id:'3', sender_id:'other', content:'Le 12 août depuis Barcelone ✈️ Tu connais Lisbonne ?', created_at: new Date(Date.now()-180000).toISOString() },
        { id:'4', sender_id: user?.id, content:'Jamais été ! C\'est mon premier voyage là-bas 🙌', created_at: new Date(Date.now()-120000).toISOString() },
        { id:'5', sender_id:'other', content:'On devrait visiter Alfama ensemble ! 🏛', created_at: new Date(Date.now()-60000).toISOString() },
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
    setSending(true);
    const demoMsg = { id: Date.now().toString(), sender_id: userId || 'me', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, demoMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
    setTimeout(() => {
      const replies = ['Super idée ! 😄', 'Oui, j\'adorerais ! ✈️', 'On se retrouve à l\'aéroport ? 🏖', 'Tu as déjà réservé ton hôtel là-bas ?', 'Génial ! On va bien s\'amuser 🎉'];
      const reply = { id: (Date.now()+1).toString(), sender_id: 'other', content: replies[Math.floor(Math.random() * replies.length)], created_at: new Date().toISOString() };
      setMessages(prev => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated:true }), 100);
      setSending(false);
    }, 2000);
  };

  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  const isMe = (senderId) => senderId === userId || senderId === 'me';

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
            {messages.map((msg, i) => {
              const me = isMe(msg.sender_id);
              return (
                <View key={msg.id || i} style={[styles.msgRow, me && styles.msgRowMe]}>
                  {!me && (
                    <View style={[styles.msgAvatar, { backgroundColor: otherUser?.bg || '#FFD4E8' }]}>
                      <Text style={{ fontSize:13 }}>🙂</Text>
                    </View>
                  )}
                  <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleHer]}>
                    <Text style={[styles.bubbleTxt, me && { color:'#fff' }]}>{msg.content}</Text>
                    <Text style={[styles.bubbleTime, me && { color:'rgba(255,255,255,0.7)' }]}>{formatTime(msg.created_at)}</Text>
                  </View>
                </View>
              );
            })}
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
          </ScrollView>
        )}

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Text style={{ fontSize:22 }}>📎</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={newMsg}
            onChangeText={setNewMsg}
            placeholder={t('typeMessage')}
            placeholderTextColor="#ccc"
            multiline
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} disabled={!newMsg.trim()}>
            <LinearGradient colors={newMsg.trim() ? ['#E8327A','#F07030'] : ['#ccc','#ccc']} style={styles.sendBtn}>
              <Text style={{ color:'#fff', fontSize:16 }}>➤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
  bubble: { maxWidth:'72%', padding:10, borderRadius:18 },
  bubbleHer: { backgroundColor:'#fff', borderBottomLeftRadius:4, borderWidth:1, borderColor:'#EBEBEB' },
  bubbleMe: { backgroundColor:'#2AABDC', borderBottomRightRadius:4 },
  bubbleTxt: { fontSize:13, color:'#0D3547', lineHeight:19 },
  bubbleTime: { fontSize:9, color:'#bbb', marginTop:4, textAlign:'right' },
  inputBar: { flexDirection:'row', alignItems:'center', gap:8, padding:10, backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#B5DCEA' },
  attachBtn: { padding:4 },
  input: { flex:1, backgroundColor:'#F4F4F4', borderRadius:22, paddingHorizontal:14, paddingVertical:9, fontSize:13, color:'#0D3547', maxHeight:100 },
  sendBtn: { width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center' },
});