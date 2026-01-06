import CarbonGauge from "@/components/CarbonGauge/CarbonGuage";
import MethaneGauge from "@/components/MethaneGuage/MethaneGuage";
import TemperatureGauge from "@/components/Temperature/TemperatureGuage";
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from "twrnc";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";



export default function DashboardScreen() {
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    const [backgroundColor, setBackgroundColor] = useState("green");
    const [value] = useState(40)
    const [warningText, setWarningText] = useState("SAFE");
    const [warningIcon, setWarningIcon] = useState("check-circle");

    useEffect(() => {
        if (value < 30) {
            setBackgroundColor("green");
            setWarningText("SAFE");
            setWarningIcon("check-circle")
        } else if (value < 50) {
            setBackgroundColor("#FACC15");
            setWarningText("WARNING");
            setWarningIcon("warning");
        } else if (value >= 50) {
            setBackgroundColor("red");
            setWarningText("NOT SAFE");
            setWarningIcon("warning");
        }
    }, [value]);
    return (
        <SafeAreaView>
            <ScrollView style={tw` px-4 h-full`}>
                <View style={tw` h-full`}>
                    <View style={[tw`flex justify-center w-full items-center px-4 py-5 rounded-sm`, { backgroundColor }]}>
                        <Text style={[tw`text-white font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>{warningText}</Text>
                        <AntDesign name={warningIcon as any} size={24} color="white" style={tw`mt-3`} />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row justify-center items-center mt-6 border border-gray-400 rounded-md pl-18 pr-6 py-2`}>
                        <View style={tw`flex justify-between mr-6 h-full`}>
                            <Text style={[tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                CO
                                <Text style={{ fontSize: 10, lineHeight: 16 }}>
                                    2
                                </Text>
                                {" "}LEVEL
                            </Text>
                            <Text style={[tw`text-gray-700  text-center`, { fontFamily: "PoppinsRegular" }]}>Normal &lt; 50PPM</Text>
                        </View>
                        <CarbonGauge value={36} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row justify-center items-center mt-6 border border-gray-400 rounded-md py-2 pl-18 pr-6`}>
                        <View style={tw`flex justify-between  mr-6 h-full`}>
                            <Text style={[tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                METHANE LEVEL
                            </Text>
                            <Text style={[tw`text-gray-700 `, { fontFamily: "PoppinsRegular" }]}>No Leak</Text>
                        </View>
                        <MethaneGauge value={25} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                    <View style={tw`h-[25%] w-full flex flex-row justify-center items-center mt-6 border border-gray-400 rounded-md py-2 pl-18 pr-6`}>
                        <View style={tw`flex justify-between  mr-6 h-full`}>
                            <Text style={[tw`text-gray-700 font-bold text-md mb-2 border-b text-center`, { fontFamily: "PoppinsBold" }]}>
                                TEMPERATURE
                            </Text>
                            <Text style={[tw`text-gray-700  text-center`, { fontFamily: "PoppinsRegular" }]}>Normal Range</Text>
                        </View>
                        <TemperatureGauge value={45} max={100} label="Speed" color="#ff4d4f" />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}