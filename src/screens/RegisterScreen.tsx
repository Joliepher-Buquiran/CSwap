import React, { useState } from 'react';
import {Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState(''); // New address state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword || !address) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://192.168.0.104/CSwap/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, address }), // Send address along with other data
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigation.navigate('Login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
      console.error('Network error:', error); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <View style={styles.container}>
       <View style={styles.imageWrapper}>
     <Image
        source={require('../assets2/Register.png')}
        style={styles.image}
         resizeMode="contain"
      />
    </View>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
      style={styles.input}
      placeholder="Enter your address"  // Adding placeholder text for address
      value={address}
      onChangeText={setAddress}  // Handle address input
/>


      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />


      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Log in here</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,

  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#06402b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    marginLeft:50,
    marginRight:50,
    
    
  },
  imageWrapper: {
    // 10% of the screen width
    marginVertical: 20,      // Fixed vertical margin
  },
  image:{
    width:200,
    position:'absolute',
    marginLeft:80,
    marginTop:-250,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#06402b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    marginLeft:50,
    marginRight:50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    color: '#06402b',
    textAlign: 'center',
    fontSize: 14,
    
  },
});
