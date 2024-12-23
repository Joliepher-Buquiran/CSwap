import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SettingsScreen = ({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://192.168.0.104/CSwap/settings.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEmail(data.email);
        setUsername(data.username);
        setAddress(data.address);
      } else {
        console.error(data.error || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async () => {
    try {
      const response = await fetch('http://192.168.0.104/CSwap/settings.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, address }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        console.log('Profile updated successfully');
        setModalVisible(false);
      } else {
        console.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="darkgreen" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="user-circle" size={20} color="darkgreen" /> User Profile
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.profileContainer}>
          <Icon name="user" size={30} color="darkgreen" />
          <View style={styles.profileDetails}>
            {email && username && address ? (
              <>
                <Text style={styles.profileText}>Email: {email}</Text>
                <Text style={styles.profileText}>Username: {username}</Text>
                <Text style={styles.profileText}>Address: {address}</Text>
              </>
            ) : (
              <Text style={styles.profileText}>Click to view profile</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="bell" size={20} color="darkgreen" /> Notifications
        </Text>
        {['Enable Notifications', 'Sound', 'Vibration', 'Mute', 'Preview'].map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="lock" size={20} color="darkgreen" /> Privacy
        </Text>
        {['Profile Visibility', 'Block Users', 'Data Sharing', 'Two-Factor Authentication', 'Activity Log'].map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="language" size={20} color="darkgreen" /> Language
        </Text>
        {['English', 'Spanish', 'French', 'German', 'Chinese'].map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="paint-brush" size={20} color="darkgreen" /> Theme
        </Text>
        {['Light Theme', 'Dark Theme', 'Blue Theme', 'Green Theme', 'Red Theme'].map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Help Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="info-circle" size={20} color="darkgreen" /> Help & Support
        </Text>
        {['FAQs', 'Contact Us', 'Live Chat', 'Feedback', 'Tutorials'].map((option, index) => (
          <TouchableOpacity key={index} style={styles.option}>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Icon name="sign-out" size={20} color="darkgreen" /> Logout
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLoggedIn(false)}>
          <Icon name="sign-out" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing Profile */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
            />

            <TouchableOpacity onPress={updateUserProfile} style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#06402b',
   
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#06402b',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  profileDetails: {
    marginLeft: 10,
  },
  profileText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#06402b',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'darkgreen',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
