import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Assurez-vous que SUPABASE_URL et SUPABASE_ANON_KEY de votre fichier .env
// sont correctement chargés dans l'environnement de votre application mobile.
// Vous pourriez avoir besoin de 'react-native-dotenv' ou de les configurer via 'expo-constants'
// dans app.config.js / app.json.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("L'URL Supabase n'est pas définie. Vérifiez la configuration de vos variables d'environnement pour l'application mobile.");
}
if (!supabaseAnonKey) {
  throw new Error("La clé Anon Supabase n'est pas définie. Vérifiez la configuration de vos variables d'environnement pour l'application mobile.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);