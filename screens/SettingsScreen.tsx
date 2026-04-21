import backendInstance from "@/api/AxiosInstance";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { UserData } from "@/types/login.types";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import tw from "twrnc";
export default function SettingsScreen() {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    const { darkMode, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [openModalTwo, setOpenModalTwo] = useState(false);
    const [openModalThree, setOpenModalThree] = useState(false);
    const deviceId = "F1:EE:34:23:48:C8";
    const [userData, setUserData] = useState<UserData | null>(null);
    const [deviceDetails, setDeviceDetails] = useState({
        location: "",
        co2Threshold: 0,
        wifiSsid: "",
        wifiPassword: "",
    });

    if (!fontsLoaded) {
        return null;
    }

    const handleChange = (name: string, val: string) => {
        const newDetails = { ...deviceDetails, [name]: val };
        setDeviceDetails({ ...deviceDetails, [name]: val });
    };

    const [loading, setLoading] = useState(false);

    const updateDeviceDetails = async () => {
        setLoading(true);
        try {
            const payload = { ...deviceDetails, co2Threshold: Number(deviceDetails.co2Threshold) };
            const response = await backendInstance.put(`/gas-detectors/user/update/${deviceId}`, payload);
            console.log('Update success:', response?.status, response?.data);
            setOpenModalTwo(false);
        } catch (err: any) {
            console.error('Update failed:', err?.response?.status, err?.response?.data || err?.message);
            alert(`Update failed: ${err?.response?.status || ''} ${err?.response?.data?.message || err?.message}`);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        const fetchData = async () => {
            const ph = await AsyncStorage.getItem("phonenumber");
            const mac = await AsyncStorage.getItem("macAddress");

            if (!ph || !mac) return;

            const getDetails = async (signal: AbortSignal): Promise<UserData | undefined> => {
                try {
                    const response = await backendInstance.get(
                        "/gas-detectors/user/getDetector",
                        {
                            params: { phoneNumber: ph, macAddress: mac },
                            signal,
                        }
                    );

                    const data = response.data;
                    setUserData(data);
                    return data;
                } catch (error) {
                    console.error("Error:", error);
                }
            };

            const controller = new AbortController();
            getDetails(controller.signal); // initial fetch

            const id = setInterval(() => getDetails(controller.signal), 5000);

            return () => {
                clearInterval(id);
                controller.abort();
            };
        };

        fetchData();
    }, []);
    return (
        <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`, { flex: 1 }]}>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`} scrollEnabled={true}>
                <View style={tw`flex-row items-center p-4 space-x-2`}>
                    <Text style={[darkMode ? tw`text-white font-bold text-lg` : tw`text-black font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>Settings</Text>
                </View>
                <View style={tw``}>
                    <View style={[darkMode ? tw`h-28 w-full bg-gray-500 rounded-md` : tw`h-28 w-full bg-gray-200 rounded-md`]}>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 border-b border-white` : tw`flex-row justify-between items-center p-4 border-b border-gray-500`]}>
                            <View style={tw`flex-row items-center `}>
                                <Ionicons name="person" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalThree(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Profile</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 ` : tw`flex-row justify-between items-center p-4  `]}>
                            <View style={tw`flex-row items-center `}>
                                <MaterialIcons name="update" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalTwo(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Update Device Detail</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                    </View>
                    <View style={[darkMode ? tw`h-44 w-full bg-gray-500 rounded-md mt-4` : tw`h-44 w-full bg-gray-200 rounded-md mt-4`]}>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 border-b border-white` : tw`flex-row justify-between items-center p-4 border-b border-gray-500`]}>
                            <View style={tw`flex-row items-center `}>

                                <AntDesign name="wifi" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalTwo(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>WifiSsid</Text>
                            </View>
                            <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>{userData?.data?.wifiSsid}</Text>
                        </View>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 border-b border-white` : tw`flex-row justify-between items-center p-4 border-b border-gray-500`]}>
                            <View style={tw`flex-row items-center `}>
                                <MaterialIcons name="data-thresholding" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalTwo(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>CO2 Threshold</Text>
                            </View>
                            <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>{userData?.data?.co2Threshold}</Text>
                        </View>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 ` : tw`flex-row justify-between items-center p-4 `]}>
                            <View style={tw`flex-row items-center `}>
                                <Entypo name="location-pin" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalTwo(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Location</Text>
                            </View>
                            <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>{userData?.data?.location}</Text>
                        </View>
                    </View>
                    <View style={[darkMode ? tw`h-28 w-full bg-gray-500 rounded-md mt-4` : tw`h-28 w-full bg-gray-200 rounded-md mt-4`]}>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4  border-b border-white ` : tw`flex-row justify-between items-center p-4 border-b border-gray-500`]}>
                            <View style={tw`flex-row items-center `}>
                                <Ionicons name="person" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalThree(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Profile Settings</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                        <View style={[darkMode ? tw`flex-row justify-between items-center  px-4 pt-2` : tw`flex-row justify-between items-center px-4 pt-2`]}>
                            <View style={tw`flex-row items-center`}>
                                {darkMode ? <Entypo name="light-down" size={24} color={darkMode ? "white" : "gray"} />
                                    : <Entypo name="moon" size={24} color={darkMode ? "white" : "gray"} />}
                                <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>{darkMode ? "Light Mode" : "Dark Mode"}</Text>
                            </View>
                            <Switch value={darkMode} onValueChange={toggleTheme} />
                        </View>
                    </View>

                    <View style={[darkMode ? tw`h-28 w-full bg-gray-500 rounded-md mt-4` : tw`h-28 w-full bg-gray-200 rounded-md mt-4`]}>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 border-b border-white` : tw`flex-row justify-between items-center p-4 border-b border-gray-700`]}>
                            <View style={tw`flex-row items-center `}>
                                <AntDesign name="customer-service" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setOpenModalThree(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Customer Service</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 ` : tw`flex-row justify-between items-center p-4 `]}>
                            <View style={tw`flex-row items-center `}>
                                <Entypo name="log-out" size={24} color={darkMode ? "white" : "gray"} />
                                <Text onPress={() => setModalVisible(true)} style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Logout</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openModalTwo}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!openModalTwo);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[darkMode ? tw`bg-gray-800 w-full` : tw`bg-white w-full`, styles.modalView]}>
                            <Text style={[darkMode ? tw`text-white` : tw`text-black`, styles.modalText]}>Update device details</Text>

                            <Text
                                style={[
                                    darkMode ? tw`text-white py-2` : tw`text-black  py-2`,
                                    { fontFamily: "PoppinsRegular" },
                                ]}
                            >
                                Location
                            </Text>

                            <TextInput
                                placeholder="Enter Location"
                                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                                onChangeText={(t) => handleChange("location", t)}
                                style={[
                                    darkMode
                                        ? tw`h-12 rounded-md px-4 bg-white text-black w-full`
                                        : tw`h-12 rounded-md px-4 bg-gray-400 text-white w-full`,
                                ]}
                            />
                            <Text
                                style={[
                                    darkMode ? tw`text-white py-2` : tw`text-black  py-2`,
                                    { fontFamily: "PoppinsRegular" },
                                ]}
                            >
                                WifiSsid
                            </Text>

                            <TextInput
                                placeholder="Enter WifiSsid"
                                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                                onChangeText={(t) => handleChange("wifiSsid", t)}
                                style={[
                                    darkMode
                                        ? tw`h-12 rounded-md px-4 bg-white text-black w-full`
                                        : tw`h-12 rounded-md px-4 bg-gray-400 text-white w-full`,
                                ]}
                            />
                            <Text
                                style={[
                                    darkMode ? tw`text-white py-2` : tw`text-black  py-2`,
                                    { fontFamily: "PoppinsRegular" },
                                ]}
                            >
                                Wifi Password
                            </Text>

                            <TextInput
                                placeholder="Enter Password"
                                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                                onChangeText={(t) => handleChange("wifiPassword", t)}
                                style={[
                                    darkMode
                                        ? tw`h-12 rounded-md px-4 bg-white text-black w-full`
                                        : tw`h-12 rounded-md px-4 bg-gray-400 text-white w-full`,
                                ]}
                            />
                            <Text
                                style={[
                                    darkMode ? tw`text-white py-2` : tw`text-black  py-2`,
                                    { fontFamily: "PoppinsRegular" },
                                ]}
                            >
                                C02 Threshold
                            </Text>

                            <TextInput
                                placeholder="Set Threshold"
                                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                                onChangeText={(t) => handleChange("co2Threshold", t)}
                                style={[
                                    darkMode
                                        ? tw`h-12 rounded-md px-4 bg-white text-black mb-2 w-full`
                                        : tw`h-12 rounded-md px-4 bg-gray-400 text-white mb-2 w-full`,
                                ]}
                            />
                            <View style={tw`flex justify-between flex-row `}>
                                <Pressable
                                    style={loading ? tw`bg-red-400 rounded-md px-4 py-2 m-2` : tw`bg-red-600 rounded-md px-4 py-2 m-2`}
                                    onPress={() => updateDeviceDetails()}>
                                    <Text style={styles.textStyle}>{loading ? "Loading" : "Update"}</Text>
                                </Pressable>
                                <Pressable
                                    style={tw`bg-blue-600 rounded-md px-4 py-2 m-2`}
                                    onPress={() => setOpenModalTwo(false)}>
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[darkMode ? tw`bg-gray-800` : tw`bg-white`, styles.modalView]}>
                            <Text style={[darkMode ? tw`text-white` : tw`text-black`, styles.modalText]}>Are you sure you want to logout?</Text>
                            <View style={tw`flex justify-between flex-row `}>
                                <Pressable
                                    style={tw`bg-red-600 rounded-md px-4 py-2 m-2`}
                                    onPress={() => { logout(); setModalVisible(false) }}>
                                    <Text style={styles.textStyle}>Yes</Text>
                                </Pressable>
                                <Pressable
                                    style={tw`bg-blue-600 rounded-md px-4 py-2 m-2`}
                                    onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.textStyle}>No</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={openModalThree}
                    onRequestClose={() => {
                        setOpenModalThree(!openModalThree);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={[darkMode ? tw`bg-gray-800` : tw`bg-white`, styles.modalView]}>
                            <Octicons name="copilot-warning" size={24} color={darkMode ? "white" : "gray"} />
                            <Text style={[darkMode ? tw`text-white my-3` : tw`text-black my-3`, styles.modalText]}>Feature is still in development</Text>
                            <View style={tw`flex justify-center flex-row `}>
                                <Pressable
                                    style={tw`bg-blue-600 rounded-md px-4 py-2 m-2`}
                                    onPress={() => setOpenModalThree(!openModalThree)}>
                                    <Text style={styles.textStyle}>Ok</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});