import React, { useState } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native";
import { API_CONFIG } from "./config";
import { SpotifyTest } from "./components/SpotifyTest";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { UserProfile } from "./components/UserProfile";
import { SpotifyLoginButton } from "./components/SpotifyLoginButton";
import SpotifyProfile from "./components/SpotifyProfile";

function RegisterForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      // Utilisation de la configuration d'API au lieu de l'URL hardcodée
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || API_CONFIG.BASE_URL;
      const url = `${apiUrl}${API_CONFIG.ENDPOINTS.REGISTER}`;
      
      console.log("Tentative de connexion à:", url); // Pour débugger
      
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        Alert.alert("Succès", "Inscription réussie ! Vous pouvez maintenant vous connecter.");
        onBack();
      } else {
        Alert.alert("Erreur", data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      Alert.alert(
        "Erreur de connexion", 
        "Impossible de contacter le serveur. Vérifiez que l'API est démarrée et que l'URL est correcte."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister} 
        disabled={loading}
      >
        <Text style={styles.text}>{loading ? "En cours..." : "S'inscrire"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack} style={{ marginTop: 16 }} disabled={loading}>
        <Text style={{ color: loading ? '#ccc' : '#888' }}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppContent() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSpotifyLogin, setShowSpotifyLogin] = useState(false);
  const [showSpotifyTest, setShowSpotifyTest] = useState(false);
  const [showSpotifyProfile, setShowSpotifyProfile] = useState(false);
  const { user, loading, logout } = useAuth();
  
  // Affichage du loader pendant le chargement de la session
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1db954" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }
  
  // Si l'utilisateur est connecté, afficher le profil et les options
  if (user) {
    if (showSpotifyTest) {
      return <SpotifyTest onBack={() => setShowSpotifyTest(false)} />;
    }
    
    if (showSpotifyProfile) {
      return <SpotifyProfile onLogout={() => {
        logout();
        setShowSpotifyProfile(false);
      }} />;
    }
    
    return (
      <View style={styles.container}>
        <Text style={styles.appTitle}>🎵 Custom Spotify</Text>
        <Text style={styles.subtitle}>Bienvenue dans votre espace personnel</Text>
        
        <UserProfile />
        
        <TouchableOpacity
          style={[styles.button, styles.spotifyButton]}
          onPress={() => setShowSpotifyProfile(true)}
        >
          <Text style={[styles.text, styles.spotifyText]}>🎵 Mon Profil Spotify</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={() => setShowSpotifyTest(true)}
        >
          <Text style={[styles.text, styles.testText]}>🧪 Test Spotify API</Text>
        </TouchableOpacity>
        
        <StatusBar style="auto" />
      </View>
    );
  }
  
  // Si l'utilisateur n'est pas connecté, afficher les options de connexion/inscription
  if (showSpotifyTest) {
    return <SpotifyTest onBack={() => setShowSpotifyTest(false)} />;
  }
  
  return (
    <View style={styles.container}>
      {showRegister ? (
        <RegisterForm onBack={() => setShowRegister(false)} />
      ) : showLogin ? (
        <LoginForm onBack={() => setShowLogin(false)} />
      ) : showSpotifyLogin ? (
        <SpotifyLoginButton onBack={() => setShowSpotifyLogin(false)} />
      ) : (
        <>
          <Text style={styles.appTitle}>🎵 Custom Spotify</Text>
          <Text style={styles.subtitle}>Application de test</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.spotifyButton]}
            onPress={() => setShowSpotifyLogin(true)}
          >
            <Text style={[styles.text, styles.spotifyText]}>🎵 Connexion Spotify</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => setShowLogin(true)}
          >
            <Text style={[styles.text, styles.loginText]}>🔑 Connexion Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowRegister(true)}
          >
            <Text style={styles.text}>📝 Inscription</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={() => setShowSpotifyTest(true)}
          >
            <Text style={[styles.text, styles.testText]}>🧪 Test Spotify API</Text>
          </TouchableOpacity>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    alignItems: "center",
    margin: 8,
    minWidth: 200,
  },
  loginButton: {
    backgroundColor: "#dbeafe",
  },
  spotifyButton: {
    backgroundColor: "#dcfce7",
  },
  testButton: {
    backgroundColor: "#f3e8ff",
  },
  buttonDisabled: {
    backgroundColor: "#f3f4f6",
  },
  text: {
    color: "#b91c1c",
    fontWeight: "bold",
    fontSize: 18,
  },
  loginText: {
    color: "#1d4ed8",
  },
  spotifyText: {
    color: "#16a34a",
  },
  testText: {
    color: "#7c3aed",
  },
  formContainer: {
    width: 300,
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 12,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#b91c1c',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});
