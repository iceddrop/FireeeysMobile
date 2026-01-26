import { useFonts } from "expo-font";
import { useState } from "react";
import { Text, View, ScrollView, Switch, Modal, StyleSheet, Alert, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from "twrnc";
import Entypo from '@expo/vector-icons/Entypo';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext"
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SettingsScreen() {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    const { darkMode, toggleTheme } = useTheme();
    const { logout } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`]}>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <ScrollView style={tw`px-4 h-full`} contentContainerStyle={tw`pb-32`} scrollEnabled={true}>
                <View style={tw`flex-row items-center p-4 space-x-2`}>
                    <Text style={[darkMode ? tw`text-white font-bold text-lg` : tw`text-black font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>Settings</Text>
                </View>
                <View style={tw``}>
                    <View style={[darkMode ? tw`h-28 w-full bg-gray-500 rounded-md` : tw`h-28 w-full bg-gray-200 rounded-md`]}>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 border-b border-white` : tw`flex-row justify-between items-center p-4 border-b border-gray-500`]}>
                            <View style={tw`flex-row items-center `}>
                                <Ionicons name="person" size={24} color={darkMode ? "white" : "gray"} />
                                <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Profile</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 ` : tw`flex-row justify-between items-center p-4  `]}>
                            <View style={tw`flex-row items-center `}>
                                <MaterialIcons name="update" size={24} color={darkMode ? "white" : "gray"} />
                                <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Update Device Detail</Text>
                            </View>
                            <Ionicons name="chevron-forward-circle-sharp" size={24} color={darkMode ? "white" : "gray"} />
                        </View>
                    </View>
                    <View style={[darkMode ? tw`h-28 w-full bg-gray-500 rounded-md mt-4` : tw`h-28 w-full bg-gray-200 rounded-md mt-4`]}>
                        <View style={[darkMode ? tw`flex-row justify-between items-center p-4 border-b border-white` : tw`flex-row justify-between items-center p-4 border-b border-gray-500`]}>
                            <View style={tw`flex-row items-center `}>
                                <Ionicons name="person" size={24} color={darkMode ? "white" : "gray"} />
                                <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Profile Settings</Text>
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
                                <Text style={[darkMode ? tw`text-white font-bold pl-2` : tw`text-gray-700 font-bold pl-2`]}>Customer Service</Text>
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
                                    onPress={() => logout()}>
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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