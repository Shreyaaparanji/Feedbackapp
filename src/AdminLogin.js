import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground, Alert } from 'react-native';

export default function AdminLogin({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Hardcoded admin credentials for demonstration purposes
    const adminUsername = 'Admin';
    const adminPassword = 'Admin123';

    if (username === adminUsername && password === adminPassword) {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Invalid Credentials', 'The username or password you entered is incorrect.');
    }
  };

  return (
    <ImageBackground source={require('../assets/images/adminlogin.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin panel</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
          </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  signUpButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#6200EE',
    fontSize: 16,
  },
});
