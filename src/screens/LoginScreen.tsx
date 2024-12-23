import React, { useState } from 'react';
import { Image,View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setIsLoggedIn }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.104/CSwap/validate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save login state to AsyncStorage
        await AsyncStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);  // Update the state in AppNavigator
        navigation.navigate('Home'); // Navigate to Home screen
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
       <View style={styles.imageWrap}>
     <Image
        source={require('../assets2/Cswaplogo.png')}
        style={styles.LoginLogo}
         resizeMode="contain"
      />
    </View>
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#06402b" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={28} color="#06402b" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#06402b',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageWrap:{

  },
  LoginLogo:{
    position:'absolute',
    width:200,
    marginTop:-270,
    marginLeft:88,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft:50,
    marginRight:50,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#06402b',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 1,
    marginLeft:50,
    marginRight:50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerLink: {
    color: '#06402b',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 1,
    textAlign: 'center',
  },
});
