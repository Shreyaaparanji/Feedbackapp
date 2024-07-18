import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Image, TextInput, Dimensions, ScrollView, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { firestore, storage } from '../config'; // Ensure the path is correct
import * as FileSystem from 'expo-file-system';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for the camera icon

const { width, height } = Dimensions.get('window');

// List of Indian states and cities
const states = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
    "Assam": ["Guwahati", "Dispur", "Dibrugarh"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Korba"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Haryana": ["Chandigarh", "Gurugram", "Faridabad"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
    "Meghalaya": ["Shillong", "Tura", "Nongstoin"],
    "Mizoram": ["Aizawl", "Lunglei", "Saiha"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
    "Sikkim": ["Gangtok", "Namchi", "Gyalshing"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu"],
    "Lakshadweep": ["Kavaratti"],
    "Delhi": ["New Delhi"],
    "Puducherry": ["Puducherry"]
};

const UploadMediaFile = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [gender, setGender] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState([]);
    const [transportationMode, setTransportationMode] = useState('');
    const [description, setDescription] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailTimer, setEmailTimer] = useState(null);

    const navigation = useNavigation();

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadMedia = async () => {
        setUploading(true);

        try {
            let downloadURL = null;
            if (image) {
                const { uri } = await FileSystem.getInfoAsync(image);
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = () => {
                        resolve(xhr.response);
                    };
                    xhr.onerror = (e) => {
                        reject(new TypeError('Network request failed'));
                    };
                    xhr.responseType = 'blob';
                    xhr.open('GET', uri, true);
                    xhr.send(null);
                });

                const filename = image.substring(image.lastIndexOf('/') + 1);
                const ref = storage.ref().child(filename);

                await ref.put(blob);

                downloadURL = await ref.getDownloadURL();
            }

            const userRef = firestore.collection('users').doc();

            await userRef.set({
                name: name,
                ...(email && { email: email }),
                contactNumber: contactNumber,
                gender: gender,
                state: state,
                city: city,
                transportationMode: transportationMode,
                description: description,
                imageUrl: downloadURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            setUploading(false);
            Alert.alert('Feedback submitted successfully!');
            setImage(null);
            setName('');
            setEmail('');
            setContactNumber('');
            setGender('');
            setState('');
            setCity('');
            setTransportationMode('');
            setDescription('');

        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    useEffect(() => {
        if (state) {
            setCities(states[state] || []);
        }
    }, [state]);

    const handlePhoneNumberChange = (text) => {
        if (/^\d{0,10}$/.test(text)) {
            setContactNumber(text);
        } else {
            Alert.alert('Invalid Phone Number', 'Phone number must be 10 digits.');
        }
    };

    const handleEmailChange = (text) => {
        setEmail(text);

        if (emailTimer) {
            clearTimeout(emailTimer);
        }

        setEmailTimer(
            setTimeout(() => {
                if (text && !validateEmail(text)) {
                    setEmailError(true);
                } else {
                    setEmailError(false);
                }
            }, 1000)
        );
    };

    return (
        <ImageBackground 
            source={require('../assets/images/img1.jpeg')} // Ensure the path is correct
            style={styles.backgroundImage}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.heading}>Feedback Form</Text>
                    <TouchableOpacity style={styles.adminIcon} onPress={() => navigation.navigate('AdminLogin')}>
                        <Image source={require('../assets/images/profile.png')} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        placeholderTextColor="#000"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#000"
                        value={email}
                        onChangeText={handleEmailChange}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact Number"
                        placeholderTextColor="#000"
                        value={contactNumber}
                        onChangeText={handlePhoneNumberChange}
                        keyboardType="phone-pad"
                    />
                    <Picker
                        selectedValue={gender}
                        style={styles.picker}
                        onValueChange={(itemValue) => setGender(itemValue)}
                    >
                        <Picker.Item label="Gender" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                    <Picker
                        selectedValue={state}
                        style={styles.picker}
                        onValueChange={(itemValue) => setState(itemValue)}
                    >
                        <Picker.Item label="State" value="" />
                        {Object.keys(states).map((stateName) => (
                            <Picker.Item key={stateName} label={stateName} value={stateName} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={city}
                        style={styles.picker}
                        onValueChange={(itemValue) => setCity(itemValue)}
                        enabled={cities.length > 0}
                    >
                        <Picker.Item label="City" value="" />
                        {cities.map((cityName) => (
                            <Picker.Item key={cityName} label={cityName} value={cityName} />
                        ))}
                    </Picker>
                    <Text style={styles.travelLabel}>How are you traveling?</Text>
                    <Picker
                        selectedValue={transportationMode}
                        style={styles.picker}
                        onValueChange={(itemValue) => setTransportationMode(itemValue)}
                    >
                        <Picker.Item label="Solo" value="solo" />
                        <Picker.Item label="Family" value="family" />
                        <Picker.Item label="Friends" value="friends" />
                        <Picker.Item label="Solo Biker" value="solo_biker" />
                        <Picker.Item label="Biker's Group" value="bikers_group" />
                    </Picker>
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="Feedback"
                        placeholderTextColor="#000"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
                        <MaterialIcons name="camera-alt" size={24} color="white" />
                        <Text style={styles.buttonText}> Take a Picture</Text>
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        {image && <Image
                            source={{ uri: image }}
                            style={styles.image}
                        />}
                    </View>
                    <TouchableOpacity style={styles.uploadButton} onPress={uploadMedia}>
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default UploadMediaFile;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    adminIcon: {
        padding: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#000',
        marginBottom: 20,
    },
    picker: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        marginBottom: 20,
    },
    textArea: {
        width: '80%',
        height: 100,
        backgroundColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#000',
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        width: 200,
        height: 50,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    uploadButton: {
        borderRadius: 5,
        width: 150,
        height: 50,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
        resizeMode: 'contain',
    },
    radioGroup: {
        width: '80%',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    label: {
        width: '80%',
        color: '#000',
        marginBottom: 5,
    },
    travelLabel: {
        width: '80%',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    }
});