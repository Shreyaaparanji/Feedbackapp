import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import UploadMediaFile from './src/index';
import AdminLogin from './src/AdminLogin';
import AdminDashboard from './src/AdminDashboard';
import Sidebar from './src/Sidebar';
import Feedbacks from './src/Feedbacks';
import FeedbackDetail from './src/FeedbackDetail';
import CardDetails from './src/CardDetails';
import Charts from './src/Charts';


const Stack = createStackNavigator();

function AdminScreen() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <View style={styles.container}>
      {openSidebarToggle && <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />}
      <AdminDashboard />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UploadMediaFile">
        <Stack.Screen
          name="UploadMediaFile"
          component={UploadMediaFile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Sidebar"
          component={Sidebar}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Feedbacks"
          component={Feedbacks}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FeedbackDetail"
          component={FeedbackDetail}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="CardDetails"
          component={CardDetails}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Charts"
          component={Charts}
          options={{ headerShown: false }}
        />




        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
