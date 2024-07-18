import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { firestore } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Make sure to install react-native-vector-icons
import moment from 'moment'; // Import moment for date formatting

function FeedbackDetail({ route, navigation }) {
  const { visitorId } = route.params;
  const [visitorData, setVisitorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doc = await firestore.collection('users').doc(visitorId).get();
        if (doc.exists) {
          console.log("Document data:", doc.data()); // Log document data for debugging
          setVisitorData(doc.data());
        } else {
          console.log("No such document!");
          setVisitorData(null);
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
        setVisitorData(null);
      }
    };

    fetchData();
  }, [visitorId]);

  if (!visitorData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("Visitor Data:", visitorData); // Log visitor data for debugging

  // Check if the timestamp field exists and is a Firestore Timestamp
  const formattedDate = visitorData.timestamp 
    ? moment(visitorData.timestamp.toDate()).format('MMMM Do YYYY, h:mm:ss a') 
    : 'N/A';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Visitor ID:</Text>
          <Text style={styles.value}>{visitorId}</Text>

          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{visitorData.name}</Text>

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{visitorData.email}</Text>

          <Text style={styles.label}>Contact Number:</Text>
          <Text style={styles.value}>{visitorData.contactNumber}</Text>

          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{visitorData.gender}</Text>

          <Text style={styles.label}>State:</Text>
          <Text style={styles.value}>{visitorData.state}</Text>

          <Text style={styles.label}>City:</Text>
          <Text style={styles.value}>{visitorData.city}</Text>

          <Text style={styles.label}>Transportation Mode:</Text>
          <Text style={styles.value}>{visitorData.transportationMode}</Text>

          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{visitorData.description}</Text>

          <Text style={styles.label}>Submitted At:</Text>
          <Text style={styles.value}>{formattedDate}</Text>

          {visitorData.imageUrl && (
            <Image
              style={styles.image}
              source={{ uri: visitorData.imageUrl }}
            />
          )}
        </View>
      </ScrollView>
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
  scrollContainer: {
    paddingBottom: 20,
  },
  detailContainer: {
    marginTop: 80,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
});

export default FeedbackDetail;
