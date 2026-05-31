import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configuration affichage des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

// Demande permission + récupère le token
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Les notifications push nécessitent un vrai appareil.');
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permission notifications refusée.');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);

  // Sauvegarde le token dans Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ push_token: token }).eq('id', user.id);
    }
  } catch(e) {
    console.log('Erreur sauvegarde token:', e);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('tripmeet', {
      name: 'TripMeet',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E8327A',
    });
  }

  return token;
}

// Envoie une notification locale (test)
export async function sendLocalNotification({ title, body, data = {} }) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: true },
    trigger: null, // immédiat
  });
}

// Notifications prédéfinies TripMeet
export const TripMeetNotifs = {
  newMatch: (prenom) => sendLocalNotification({
    title: '💫 Nouveau Match !',
    body: `${prenom} a aimé ton profil ! Envoie-lui un message.`,
    data: { screen: 'Messages' },
  }),

  newMessage: (prenom, message) => sendLocalNotification({
    title: `💬 Message de ${prenom}`,
    body: message.length > 50 ? message.substring(0, 50) + '...' : message,
    data: { screen: 'Chat' },
  }),

  soloNearby: (hotel, count) => sendLocalNotification({
    title: '🏨 Voyageurs solo détectés !',
    body: `${count} voyageur${count > 1 ? 's' : ''} solo ${count > 1 ? 'sont' : 'est'} à ${hotel}`,
    data: { screen: 'Hotel' },
  }),

  checkoutReminder: (hotel) => sendLocalNotification({
    title: '✈️ Check-out demain',
    body: `N\'oublie pas ton départ de ${hotel} demain. Bon voyage !`,
    data: { screen: 'Profile' },
  }),
};
