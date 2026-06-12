import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lspqlvwjyqethffueajr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BLzOwcz5H-8SjiygQ0_D1A_ocsHfR7s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
