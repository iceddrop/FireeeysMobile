import CarbonGauge from "@/components/CarbonGauge/CarbonGuage";
import MethaneGauge from "@/components/MethaneGuage/MethaneGuage";
import TemperatureGauge from "@/components/Temperature/TemperatureGuage";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from "twrnc";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { useGasStore } from '@/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';



export default function DashboardScreen() {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    const [backgroundColor, setBackgroundColor] = useState("green");
    const [value] = useState(40)
    const [warningText, setWarningText] = useState("SAFE");
    const [warningIcon, setWarningIcon] = useState("check-circle");
    const [darkMode, setDarkMode] = useState(false)

    const { gasData, fetchGasData } = useGasStore();


    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [macAddress, setMacAddress] = useState<string | null>(null);
    const [color, setColor] = useState("green");

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();
        let id: number | null = null;

        const loadAndFetch = async () => {
            try {
                const ph = await AsyncStorage.getItem("phonenumber");
                const mac = await AsyncStorage.getItem("macAddress");
                if (!mounted) return;
                setPhoneNumber(ph);
                setMacAddress(mac);
                if (!ph || !mac) return;
                fetchGasData(ph, mac, controller.signal);
                id = setInterval(() => fetchGasData(ph, mac, controller.signal), 5000) as unknown as number;
            } catch (e) {
                // ignore
            }
        };

        loadAndFetch();

        return () => {
            mounted = false;
            if (id !== null) clearInterval(id as any);
            controller.abort();
        };
    }, [fetchGasData]);


    useEffect(() => {
        const gd = gasData?.gasDetector;
        if (!gd) return;

        const { co2, temperature, humidity } = gd;

        // ensure values are defined (allow 0) then check all < 30
        if (co2 != null && temperature != null && humidity != null) {
            if (co2 < 30 && temperature < 30 && humidity >= 30) {
                setBackgroundColor("green");
                setWarningText("SAFE");
                setWarningIcon("check-circle")
            } else if (co2 >= 30 || temperature >= 30 || humidity < 30) {
                setBackgroundColor("#FACC15");
                setWarningText("WARNING");
                setWarningIcon("warning");
            } else {
                setBackgroundColor("red");
                setWarningText("NOT SAFE");
                setWarningIcon("warning");
            }
        }
    }, [gasData]);

    console.log(gasData)
    return (
        <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`]}>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <ScrollView style={tw` px-4 h-full`}>
                <View style={tw` h-full`}>
                    <View style={[tw`flex justify-center w-full items-center px-4 py-5 rounded-sm`, { backgroundColor }]}>
                        <Text style={[tw`text-white font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>{warningText}</Text>
                        <AntDesign name={warningIcon as any} size={24} color="white" style={tw`mt-3`} />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row justify-center items-center mt-6 border border-gray-400 rounded-md pl-18 pr-6 py-2`}>
                        <View style={tw`flex justify-between mr-6 h-full`}>
                            <Text style={[darkMode ? tw`text-white font-bold text-md mb-2 border-b border-white text-center` : tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                CO
                                <Text style={{ fontSize: 10, lineHeight: 16 }}>
                                    2
                                </Text>
                                {" "}LEVEL
                            </Text>
                            <Text style={[darkMode ? tw`text-white  text-center` : tw`text-gray-700  text-center`, { fontFamily: "PoppinsRegular" }]}>Normal &lt; 50PPM</Text>
                        </View>
                        <CarbonGauge value={gasData?.gasDetector?.co2} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row justify-center items-center mt-6 border border-gray-400 rounded-md py-2 pl-18 pr-6`}>
                        <View style={tw`flex justify-between  mr-6 h-full`}>
                            <Text style={[darkMode ? tw`text-white font-bold text-md mb-2 border-b border-white text-center` : tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                HUMIDITY LEVEL
                            </Text>
                            <Text style={[darkMode ? tw`text-white` : tw`text-gray-700`, { fontFamily: "PoppinsRegular" }]}>No Leak</Text>
                        </View>
                        <MethaneGauge value={gasData?.gasDetector?.humidity} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row justify-center items-center mt-6 border border-gray-400 rounded-md py-2 pl-18 pr-6`}>
                        <View style={tw`flex justify-between  mr-6 h-full`}>
                            <Text style={[darkMode ? tw`text-white font-bold text-md mb-2 border-b border-white text-center` : tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                TEMPERATURE
                            </Text>
                            <Text style={[darkMode ? tw`text-white  text-center` : tw`text-gray-700  text-center`, { fontFamily: "PoppinsRegular" }]}>Normal Range</Text>
                        </View>
                        <TemperatureGauge value={gasData?.gasDetector?.temperature} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                </View>
                <View style={tw`my-10`}>
                    <Text>Alert History</Text>
                    <Text>No Notifications yet</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}