import React, { useState } from "react";
import { View, Alert, StyleSheet, TouchableOpacity, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native";
import { API_CONFIG } from "./config";

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
        Alert.alert("Succès", "Inscription réussie !");
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

export default function App() {
  const [showRegister, setShowRegister] = useState(false);
  
  return (
    <View style={styles.container}>
      {showRegister ? (
        <RegisterForm onBack={() => setShowRegister(false)} />
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowRegister(true)}
          >
            <Text style={styles.text}>Inscription</Text>
          </TouchableOpacity>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  buttonDisabled: {
    backgroundColor: "#f3f4f6",
  },
  text: {
    color: "#b91c1c",
    fontWeight: "bold",
    fontSize: 18,
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
