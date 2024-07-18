import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

const Header = ({ OpenSidebar }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={OpenSidebar}>
        <Icon name="bars" style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.title}>Admin Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 35,
    paddingHorizontal: 25,
    backgroundColor: '#263043',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
