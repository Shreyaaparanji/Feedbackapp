import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Sidebar from './Sidebar';
import Header from './Header';
import moment from 'moment';
import { firestore } from '../config';

const screenWidth = Dimensions.get('window').width;

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [monthlyVisitorCount, setMonthlyVisitorCount] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [genderChartData, setGenderChartData] = useState({
    labels: [],
    datasets: [],
    legend: [],
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const snapshot = await firestore.collection('users').get();
        const totalVisitors = snapshot.size;
        let males = 0;
        let females = 0;
        let monthVisitors = 0;
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const monthlyCounts = {};
        const maleMonthlyCounts = {};
        const femaleMonthlyCounts = {};
        for (let i = 0; i < 6; i++) {
          const month = moment().subtract(i, 'months').format('MMM YYYY');
          monthlyCounts[month] = 0;
          maleMonthlyCounts[month] = 0;
          femaleMonthlyCounts[month] = 0;
        }

        snapshot.forEach(doc => {
          const data = doc.data();
          const timestamp = data.timestamp ? data.timestamp.toDate() : null;
          if (data.gender === 'Male') {
            males += 1;
            if (timestamp) {
              const month = moment(timestamp).format('MMM YYYY');
              if (maleMonthlyCounts[month] !== undefined) {
                maleMonthlyCounts[month] += 1;
              }
            }
          } else if (data.gender === 'Female') {
            females += 1;
            if (timestamp) {
              const month = moment(timestamp).format('MMM YYYY');
              if (femaleMonthlyCounts[month] !== undefined) {
                femaleMonthlyCounts[month] += 1;
              }
            }
          }
          if (timestamp && timestamp >= startOfMonth && timestamp <= endOfMonth) {
            monthVisitors += 1;
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
        setMonthlyData(Object.entries(monthlyCounts).reverse());

        // Prepare data for gender chart
        const genderData = {
          labels: Object.keys(monthlyCounts).reverse(),
          datasets: [
            {
              data: Object.values(maleMonthlyCounts).reverse(),
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue for male
              strokeWidth: 2,
            },
            {
              data: Object.values(femaleMonthlyCounts).reverse(),
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red for female
              strokeWidth: 2,
            },
          ],
          legend: ["Male", "Female"],
        };
        setGenderChartData(genderData);
      } catch (error) {
        console.error('Error fetching counts: ', error);
      }
    };

    fetchCounts();
  }, []);

  const barChartData = {
    labels: monthlyData.map(([month]) => month),
    datasets: [
      {
        data: monthlyData.map(([, count]) => count),
      },
    ],
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <View style={styles.wrapper}>
      {sidebarOpen && <Sidebar openSidebarToggle={sidebarOpen} OpenSidebar={toggleSidebar} />}
      <View style={styles.container}>
        <Header OpenSidebar={toggleSidebar} />
        <ScrollView>
          <View style={styles.content}>
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
            </View>

            <Text style={styles.chartTitle}>Visitors from Past 6 Months</Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 16}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />

            <Text style={styles.chartTitle}>Male vs Female Visitors</Text>
            {genderChartData.datasets.length > 0 && (
              <LineChart
                data={genderChartData}
                width={screenWidth - 16}
                height={220}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  content: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: '45%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1cc910',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
});

export default AdminDashboard;
