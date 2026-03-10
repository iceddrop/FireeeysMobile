import { Image, ScrollView, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import tw from "twrnc";
import { useFonts } from "expo-font";


export default function NotificationsScreen() {
    const { darkMode } = useTheme();
    const [fontsLoaded] = useFonts({
        PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
        PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`]}>
            <StatusBar style={darkMode ? "light" : "dark"} />
            <ScrollView style={tw`px-4 h-full`} contentContainerStyle={tw`pb-32`} scrollEnabled={true}>
                <View style={tw`flex-row items-center p-4 space-x-2`}>
                    <Text style={[darkMode ? tw`text-white font-bold text-lg` : tw`text-black font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>Notifications</Text>
                </View>
                <View style={tw` flex items-center justify-center p-4 space-x-2`}>
                    <Image
                        source={require("../assets/images/chatbox.png")}
                        style={tw`flex justify-center w-96 h-96`}
                    />
                    <Text style={[darkMode ? tw` text-white font-bold text-lg` : tw`text-black font-bold text-lg`, { fontFamily: "PoppinsBold" }]}>No Notifications Yet!</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}