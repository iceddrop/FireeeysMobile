import CarbonGauge from "@/components/CarbonGauge/CarbonGuage";
import MethaneGauge from "@/components/MethaneGuage/MethaneGuage";
import TemperatureGauge from "@/components/Temperature/TemperatureGuage";
import { useTheme } from "@/context/ThemeContext";
import { useGasStore, useUserStore } from '@/store/store';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from "twrnc";

interface User {
    name: string;
    email?: string;
}

interface UserData {
    user: User;
    data?: {
        location?: string;
        wifiSsid?: string;
        wifiPassword?: string;
        co2Threshold?: number;
    };
}
export default function DashboardScreen() {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    const [backgroundColor, setBackgroundColor] = useState("");
    const [value] = useState(40)
    const [warningText, setWarningText] = useState("SAFE");
    const [warningIcon, setWarningIcon] = useState("check-circle");
    const { darkMode, toggleTheme } = useTheme();
    const router = useRouter();
    const { gasData, fetchGasData } = useGasStore();
    const { userData, fetchUserDetails } = useUserStore();
    const [error, setError] = useState()


    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [macAddress, setMacAddress] = useState<string | null>(null);

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
                fetchUserDetails(ph, mac, controller.signal);
                id = setInterval(() => {
                    fetchGasData(ph, mac, controller.signal);
                    fetchUserDetails(ph, mac, controller.signal);
                }, 5000) as unknown as number;
            } catch (e) {
                console.log(e)
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
        const gd = gasData?.data;
        if (!gd) return;

        const { co2, co2Threshold } = gd;
    
        // ensure values are defined (allow 0) then check all < 30
        if (co2 != null && co2Threshold != null) {
            if (co2 < co2Threshold) {
                setWarningText("SAFE");
                setBackgroundColor("green")
                setWarningIcon("check-circle")
            } else if (co2 === co2Threshold) {
                setWarningText("WARNING");
                setBackgroundColor("yellow")
                setWarningIcon("warning");
            } else if (co2 > co2Threshold) {
                setWarningText("NOT SAFE");
                setBackgroundColor("red")
                setWarningIcon("warning");
            }
        }
    }, [gasData]);

    // const [userData, setUserData] = useState<UserData | null>(null);

    //     const ph =  AsyncStorage.getItem("phonenumber");
    //     const mac = AsyncStorage.getItem("macAddress");
    // const getDetails = async (signal: AbortSignal): Promise<UserData | undefined> => {

    //     if (!ph || !mac) return;

    //     try {
    //         const response = await backendInstance.get(
    //             "/user/user-gas-details",
    //             {
    //                 params: { ph, mac },
    //                 signal,
    //             }
    //         );

    //         const data = response.data;
    //         setUserData(data);
    //         return data;
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };

    // useEffect(() => {
    //     if (!ph|| !mac) return;

    //     const controller = new AbortController();
    //     getDetails(controller.signal); // initial fetch

    //     const id = setInterval(() => getDetails(controller.signal), 5000);

    //     return () => {
    //         clearInterval(id);
    //         controller.abort();
    //     };
    // }, [ph, mac]);
    // console.log("User Data:", userData);
    return (
        <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`, { flex: 1 }]}>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <ScrollView style={tw`px-4`} contentContainerStyle={tw`pb-32`} scrollEnabled={true}>
                <View style={tw``}>
                    <Text style={[darkMode ? tw`text-white py-3` : tw`text-black py-3`, { fontFamily: "PoppinsBold" }]}>Welcome {userData?.user?.name}</Text>
                    <View style={[tw`flex justify-center w-full items-center px-4 py-5 rounded-sm`, { backgroundColor }]}>
                        <Text style={[tw`text-white font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>{warningText}</Text>
                        <AntDesign name={warningIcon as any} size={24} color="white" style={tw`mt-3`} />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row  items-center mt-6 border border-gray-400 rounded-md  py-2`}>
                        <View style={tw`flex justify-between h-full`}>
                            <Text style={[darkMode ? tw`text-white font-bold text-md mb-2 border-b border-white text-center` : tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                CO
                                <Text style={{ fontSize: 10, lineHeight: 16 }}>
                                    2
                                </Text>
                                {" "}LEVEL
                            </Text>
                            <Text style={[darkMode ? tw`text-white  text-center pl-1` : tw`text-gray-700  text-center pl-1`, { fontFamily: "PoppinsRegular" }]}>Normal &lt; 30PPM</Text>
                        </View>
                        <CarbonGauge value={gasData?.data?.co2} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row  items-center mt-6 border border-gray-400 rounded-md py-2 `}>
                        <View style={tw`flex justify-between   h-full`}>
                            <Text style={[darkMode ? tw`text-white font-bold text-md mb-2 border-b border-white text-center` : tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                HUMIDITY LEVEL
                            </Text>
                            <Text style={[darkMode ? tw`text-white pl-1` : tw`text-gray-700 pl-1`, { fontFamily: "PoppinsRegular" }]}>Normal &gt; 30</Text>
                        </View>
                        <MethaneGauge value={gasData?.data?.humidity} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row items-center mt-6 border border-gray-400 rounded-md py-2 `}>
                        <View style={tw`flex justify-between  h-full`}>
                            <Text style={[darkMode ? tw`text-white font-bold text-md mb-2 border-b border-white text-center` : tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                TEMPERATURE
                            </Text>
                            <Text style={[darkMode ? tw`text-white  text-center pl-1` : tw`text-gray-700  text-center pl-1`, { fontFamily: "PoppinsRegular" }]}>Normal &lt; 30°C</Text>
                        </View>
                        <TemperatureGauge value={gasData?.data?.temperature} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}