import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native';

interface Item {
  id: number;
  title: string;
  description: string;
  address: string;
  image: string;
  email: string;
  contact: string;
}

const HomeScreen = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = () => {
    fetch('http://192.168.0.104/CSwap/additem.php') // Use your machine's local IP address
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error('Error fetching items:', error));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (item: Item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardAddress}>{item.address}</Text>
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.iconContainer}>
            <FontAwesome name="envelope" size={18} color="#6c757d" />
            <Text style={styles.iconText}>{item.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <FontAwesome name="phone" size={18} color="#6c757d" />
            <Text style={styles.iconText}>{item.contact}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>
              <Text style={styles.modalText}>Description: {selectedItem.description}</Text>
              <Text style={styles.modalText}>Address: {selectedItem.address}</Text>
              <Text style={styles.modalText}>Email: {selectedItem.email}</Text>
              <Text style={styles.modalText}>Contact: {selectedItem.contact}</Text>
              <Button title="Close" onPress={() => setModalVisible(false)} color="#007bff" />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f1f1', // Light grey background
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '30%',
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    padding: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'left',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'left',
  },
  cardAddress: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
    textAlign: 'left',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  modalImage: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
    textAlign: 'left',
  },
});

export default HomeScreen;
