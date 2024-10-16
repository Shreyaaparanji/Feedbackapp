import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { firestore } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import * as Sharing from 'expo-sharing';

function FeedbacksTable({ navigation }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firestore.collection('users').get();
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          contactNumber: doc.data().contactNumber,
          city: doc.data().city,
          email: doc.data().email,
          description: doc.data().description,
          gender: doc.data().gender,
          transportationMode: doc.data().transportationMode,
          timestamp: doc.data().timestamp.toDate(), // Convert Firestore Timestamp to JavaScript Date object
          state: doc.data().state,
        }));
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = timestamp.getDate();
    const month = timestamp.toLocaleString('default', { month: 'short' });
    const time = timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${month} ${time}`;
  };

  const handlePress = (id) => {
    navigation.navigate('FeedbackDetail', { visitorId: id });
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity style={[styles.cell, styles.cellTouchable]} onPress={() => handlePress(item.id)}>
        <Text style={styles.cellText}>More Info on {item.name}</Text>
      </TouchableOpacity>
      <Text style={[styles.cell, styles.cellText]}>{item.name}</Text>
      <Text style={[styles.cell, styles.cellText]}>{item.description}</Text>
    </View>
  );

  const handleDownload = async () => {
    const dataToExport = feedbacks.map(({ id, name, contactNumber, city, email, description, gender, transportationMode, timestamp, state }) => ({
      id,
      name,
      contactNumber,
      city,
      email,
      description,
      gender,
      transportationMode,
      timestamp: formatTimestamp(timestamp), // Format timestamp using custom function
      state,
    }));
    const csv = Papa.unparse(dataToExport);
    const filename = FileSystem.documentDirectory + 'feedbacks.csv';

    try {
      await FileSystem.writeAsStringAsync(filename, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      Alert.alert('Success', 'Data has been exported successfully as CSV!');
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filename);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error writing file', error);
      Alert.alert('Error', 'An error occurred while exporting data.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
        <Icon name="download" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.cellHeader]}>Visitors Details</Text>
        <Text style={[styles.headerText, styles.cellHeader]}>Visitor Name</Text>
        <Text style={[styles.headerText, styles.cellHeader]}>Feedback</Text>
      </View>
      <FlatList
        data={feedbacks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D5D9', // Cool color background
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  downloadButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 60,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9', // Light background color for rows
    borderRadius: 5,
    marginBottom: 5,
  },
  cell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  cellTouchable: {
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
  },
  cellHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    flexWrap: 'wrap',
  },
});

export default FeedbacksTable;
