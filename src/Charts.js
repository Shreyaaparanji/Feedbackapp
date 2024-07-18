import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import moment from 'moment';
import { firestore } from '../config';

const screenWidth = Dimensions.get('window').width;
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

function Charts() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [monthlyVisitorCount, setMonthlyVisitorCount] = useState(0);
  const [genderChartData, setGenderChartData] = useState({
    labels: [],
    datasets: [],
    legend: [],
  });
  const [categoryData, setCategoryData] = useState([]);
  const [topStatesData, setTopStatesData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [topCitiesData, setTopCitiesData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

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
        const maleMonthlyCounts = {};
        const femaleMonthlyCounts = {};
        const stateCounts = {};
        const cityCounts = {};

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

          switch (data.transportationMode) {
            case 'solo':
              solo += 1;
              break;
            case 'family':
              family += 1;
              break;
            case 'friends':
              friends += 1;
              break;
            case 'solo_biker':
              soloBiker += 1;
              break;
            case 'bikers_group':
              bikersGroup += 1;
              break;
            default:
              break;
          }

          // Count states and cities
          if (data.state) {
            stateCounts[data.state] = (stateCounts[data.state] || 0) + 1;
          }
          if (data.city) {
            cityCounts[data.city] = (cityCounts[data.city] || 0) + 1;
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
          legend: ['Male', 'Female'],
        };
        setGenderChartData(genderData);

        // Prepare data for category chart
        const categoryChartData = [
          {
            name: 'Solo',
            count: solo,
            color: '#FF6384',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Family',
            count: family,
            color: '#36A2EB',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Friends',
            count: friends,
            color: '#FFCE56',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Solo Biker',
            count: soloBiker,
            color: '#4BC0C0',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Bikers Group',
            count: bikersGroup,
            color: '#9966FF',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ];
        setCategoryData(categoryChartData);

        // Prepare data for top states chart
        const topStates = Object.entries(stateCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopStatesData({
          labels: topStates.map(([state]) => state),
          datasets: [{ data: topStates.map(([, count]) => count) }],
        });

        // Prepare data for top cities chart
        const topCities = Object.entries(cityCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopCitiesData({
          labels: topCities.map(([city]) => city),
          datasets: [{ data: topCities.map(([, count]) => count) }],
        });

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

  const renderTopLocations = (data, title) => {
    const totalTopVisitors = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
    return (
      <View>
        <Text style={styles.chartTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalBarChartContainer}>
            {data.labels.map((location, index) => {
              const visitorCount = data.datasets[0].data[index];
              const percentage = (visitorCount / totalTopVisitors) * 100;
              return (
                <View key={index} style={styles.horizontalBarColumn}>
                  <Text style={styles.locationName}>{location}</Text>
                  <View style={styles.barAndPercentContainer}>
                    <View 
                      style={[
                        styles.verticalBar, 
                        {height: `${(visitorCount / Math.max(...data.datasets[0].data)) * 100}%`},
                        {backgroundColor: colors[index]}
                      ]}
                    />
                  </View>
                  <Text style={styles.percentageText}>
                    {`${percentage.toFixed(1)}%`}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.mainTitle}>VISUALIZATIONS</Text>
          
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

          <Text style={styles.chartTitle}>Travel Categories</Text>
          {categoryData.length > 0 && (
            <PieChart
              data={categoryData}
              width={screenWidth - 16}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          )}

          {renderTopLocations(topStatesData, "Visitors from Top 5 States")}
          {renderTopLocations(topCitiesData, "Visitors from Top 5 Cities")}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#263043',
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#263043',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 40,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: 'white',
  },
  horizontalBarChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
  },
  horizontalBarColumn: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  locationName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 5,
  },
  barAndPercentContainer: {
    height: 150,
    width: 30,
    justifyContent: 'flex-end',
  },
  verticalBar: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  percentageText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
});

export default Charts;