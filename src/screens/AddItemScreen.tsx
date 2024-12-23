import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, FlatList, StyleSheet, Alert, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Item {
  id: number;
  title: string;
  description: string;
  address: string;
  betterItem: string;
  image: string;
}

const AddItemScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [betterItem, setBetterItem] = useState('');
  const [image, setImage] = useState('');

  const modalPosition = useState(new Animated.Value(300))[0];

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(modalPosition, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalPosition, {
        toValue: 300,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://192.168.0.104/CSwap/additem.php');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch items.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAddress('');
    setBetterItem('');
    setImage('');
    setEditingItem(null);
  };

  const handleSave = () => {
    if (!title || !description || !address || !betterItem) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
  
    const method = editingItem ? 'POST' : 'POST'; // Use POST for both create and update
    const url = 'http://192.168.0.104/CSwap/additem.php';
  
    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('betterItem', betterItem);
  
    if (editingItem) {
      // Append the id for update operation
      formData.append('id', editingItem.id.toString());
    }
  
    if (image) {
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const imageUri = { uri: image, type: `image/${fileType}`, name: `image.${fileType}` };
      formData.append('image', imageUri as any);
    }
  
    fetch(url, {
      method,
      body: formData,
    })
      .then((response) => response.text())
      .then((text) => {
        Alert.alert('Success', `${editingItem ? 'Updated' : 'Added'} item successfully`);
        resetForm();
        setModalVisible(false);
        fetchItems();
      })
      .catch(() => Alert.alert('Error', 'Failed to save item'));
  };
  

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need permission to access the camera roll.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const deleteItem = (id: number) => {
    fetch(`http://192.168.0.104/CSwap/additem.php?id=${id}`, { method: 'DELETE' })
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        Alert.alert('Success', 'Item deleted successfully');
      })
      .catch(() => Alert.alert('Error', 'Failed to delete item'));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setAddress(editingItem.address);
      setBetterItem(editingItem.betterItem);
      setImage(editingItem.image);
    }
  }, [editingItem]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <Text style={styles.cardBetterItem}>{item.betterItem}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => { setEditingItem(item); setModalVisible(true); }}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Animated.View style={[styles.modalBackdrop, { opacity: modalPosition.interpolate({ inputRange: [0, 300], outputRange: [1, 0] }) }]}>
          <Animated.View style={[styles.modalContent, { transform: [{ translateY: modalPosition }] }]}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>

            <TextInput style={styles.input} placeholder="Enter the title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Enter the description" value={description} onChangeText={setDescription} />
            <TextInput style={styles.input} placeholder="Enter the address" value={address} onChangeText={setAddress} />
            <TextInput style={styles.input} placeholder="Enter a better item suggestion" value={betterItem} onChangeText={setBetterItem} />

            <TouchableOpacity style={styles.imagePickerButton} onPress={openImagePicker}>
              <Text style={styles.imagePickerText}>Pick an Image</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.selectedImage} />}

            <View style={styles.modalActions}>
              <Button title="Save" onPress={handleSave} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
   padding: 20 },
  addButton: { 
    backgroundColor: '#06402b', 
    padding: 10, 
    marginBottom: 10 },
  addButtonText: {
     color: 'white',
      textAlign: 'center', 
      fontSize: 18 },
  card: { 
    flexDirection: 'row', marginBottom: 15, backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  cardImage: { width: 100, height: 100, borderRadius: 10 },
  cardContent: { marginLeft: 15, flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDescription: { color: '#777' },
  cardAddress: { color: '#555' },
  cardBetterItem: { fontStyle: 'italic', color: '#999' },
  cardActions: { flexDirection: 'row', marginTop: 10 },
  editButton: { 
    backgroundColor: '#06402b',
     padding: 5, 
     marginRight: 10 },
  editButtonText: { color: 'white' },
  deleteButton: { backgroundColor: 'red', padding: 5 },
  deleteButtonText: { color: 'white' },
  modalBackdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { height: 40, borderColor: '#06402b', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  imagePickerButton: { backgroundColor: '#06402b', padding: 10, marginBottom: 10, borderRadius: 5 ,},
  imagePickerText: { textAlign: 'center' ,color:'white'},
  selectedImage: { width: 100, height: 100, marginVertical: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default AddItemScreen;
