import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';

export default function BottomNav({ navigation, active }) {
  const { t } = useLanguage();
  const tabs = [
    { key:'hotel',   icon:'🏨', label:t('hotel'),    screen:'Hotel'    },
    { key:'messages',icon:'💬', label:t('messages'),  screen:'Messages' },
    { key:'map',     icon:'🌍', label:t('explorer'),  screen:'Map'      },
    { key:'profile', icon:'👤', label:t('profile'),   screen:'Profile'  },
  ];
  return (
    <View style={styles.nav}>
      {tabs.map(tab => (
        <TouchableOpacity key={tab.key} style={styles.item} onPress={() => navigation.navigate(tab.screen)}>
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.key && styles.labelActive]}>{tab.label}</Text>
          {active === tab.key && <View style={styles.dot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection:'row', justifyContent:'space-around', alignItems:'center', paddingVertical:10, borderTopWidth:1, borderTopColor:'#B5DCEA', backgroundColor:'#fff' },
  item: { alignItems:'center', gap:2 },
  icon: { fontSize:20 },
  label: { fontSize:10, fontWeight:'700', color:'#ccc' },
  labelActive: { color:'#2AABDC' },
  dot: { width:5, height:5, borderRadius:3, backgroundColor:'#2AABDC', marginTop:1 },
});
