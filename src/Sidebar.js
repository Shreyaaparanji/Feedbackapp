import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Perform any logout actions here, such as clearing user data from AsyncStorage, etc.
    // Then, navigate back to the index page
    navigation.navigate('UploadMediaFile');
  };

  return (
    <View style={[styles.sidebar, openSidebarToggle && styles.sidebarResponsive]}>
      <View style={styles.sidebarTitle}>
        <View style={styles.sidebarBrand}>
          <Icon name="user-shield" style={styles.iconHeader} />
          <Text style={styles.text}>ADMIN PANEL</Text>
        </View>
        <TouchableOpacity onPress={OpenSidebar}>
          <Icon name="times" style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.sidebarList}>
          <TouchableOpacity style={styles.sidebarListItem}>
            <Icon name="th-large" style={styles.icon} />
            <Text style={styles.text}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sidebarListItem}
            onPress={() => navigation.navigate('Feedbacks')} // Navigate to Feedbacks page
          >
            <Icon name="comment-alt" style={styles.icon} />
            <Text style={styles.text}>Feedbacks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarListItem}
          onPress={() => navigation.navigate('CardDetails')} >
            <Icon name="list-alt" style={styles.icon} />
            <Text style={styles.text}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarListItem} onPress={() => navigation.navigate('Charts')}>
            <Icon name="chart-bar" style={styles.icon} />
            <Text style={styles.text}>Charts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarListItem} onPress={handleLogout}>
            <Icon name="sign-out-alt" style={styles.icon} />
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
sidebar: {
width: width < 500 ? width * 0.75 : 150, // Responsive width
backgroundColor: '#263043',
position: 'absolute',
left: 0,
top: 0,
bottom: 0,
zIndex: 10,
},
sidebarResponsive: {
display: 'flex',
},
sidebarTitle: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
padding: 50,
marginBottom: 30,
},
sidebarBrand: {
flexDirection: 'row',
alignItems: 'center',
fontSize: 20,
fontWeight: '700',
marginTop: 15,
},
sidebarList: {
flex: 1,
paddingHorizontal: 15,
},
sidebarListItem: {
flexDirection: 'row',
alignItems: 'center',
paddingVertical: 15,
paddingHorizontal: 10,
borderRadius: 4,
},
iconHeader: {
fontSize: 28,
color: '#1cc910',
marginRight: 10,
},
icon: {
fontSize: 20,
color: '#9e9ea4',
marginRight: 15,
},
closeIcon: {
fontSize: 20,
color: '#9e9ea4',
},
text: {
color: '#f5f5f5',
fontSize: 15,
},
});