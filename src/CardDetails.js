import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';
import { firestore } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function CardDetails({ navigation }) {
  const [visitorCount, setVisitorCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [monthlyVisitorCount, setMonthlyVisitorCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [soloCount, setSoloCount] = useState(0);
  const [familyCount, setFamilyCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [soloBikerCount, setSoloBikerCount] = useState(0);
  const [bikersGroupCount, setBikersGroupCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const snapshot = await firestore.collection('users').get();
        const totalVisitors = snapshot.size;
        let males = 0;
        let females = 0;
        let monthVisitors = 0;
        let solo = 0;
        let family = 0;
        let friends = 0;
        let soloBiker = 0;
        let bikersGroup = 0;
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const monthlyCounts = {};
        for (let i = 0; i < 6; i++) {
          const month = moment().subtract(i, 'months').format('MMM YYYY');
          monthlyCounts[month] = 0;
        }

        snapshot.forEach(doc => {
          const data = doc.data();
          const timestamp = data.timestamp ? data.timestamp.toDate() : null;
          if (data.gender === 'Male') {
            males += 1;
          } else if (data.gender === 'Female') {
            females += 1;
          }
          if (timestamp && timestamp >= startOfMonth && timestamp <= endOfMonth) {
            monthVisitors += 1;
          }
          if (data.transportationMode === 'solo') {
            solo += 1;
          } else if (data.transportationMode === 'family') {
            family += 1;
          } else if (data.transportationMode === 'friends') {
            friends += 1;
          } else if (data.transportationMode === 'solo_biker') {
            soloBiker += 1;
          } else if (data.transportationMode === "bikers_group") {
            bikersGroup += 1;
          }
          if (timestamp) {
            const month = moment(timestamp).format('MMM YYYY');
            if (monthlyCounts[month] !== undefined) {
              monthlyCounts[month] += 1;
            }
          }
        });

        setVisitorCount(totalVisitors);
        setMaleCount(males);
        setFemaleCount(females);
        setMonthlyVisitorCount(monthVisitors);
        setSoloCount(solo);
        setFamilyCount(family);
        setFriendsCount(friends);
        setSoloBikerCount(soloBiker);
        setBikersGroupCount(bikersGroup);
        setMonthlyData(Object.entries(monthlyCounts).reverse());
      } catch (error) {
        console.error('Error fetching counts: ', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>Insights</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}> TOTAL VISITORS</Text>
          <Text style={styles.cardValue}>{visitorCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>VISITORS THIS MONTH</Text>
          <Text style={styles.cardValue}>{monthlyVisitorCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FEMALE</Text>
          <Text style={styles.cardValue}>{femaleCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>MALE</Text>
          <Text style={styles.cardValue}>{maleCount}</Text>
        </View>
        <Text style={styles.pageTitle}>     How People are heading here!</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SOLO</Text>
          <Text style={styles.cardValue}>{soloCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FAMILY</Text>
          <Text style={styles.cardValue}>{familyCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FRIENDS</Text>
          <Text style={styles.cardValue}>{friendsCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SOLO BIKER</Text>
          <Text style={styles.cardValue}>{soloBikerCount}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>BIKER'S GROUP</Text>
          <Text style={styles.cardValue}>{bikersGroupCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    backgroundColor: '#263043',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '45%', // Ensures cards wrap on smaller screens
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1cc910',
  },
});
