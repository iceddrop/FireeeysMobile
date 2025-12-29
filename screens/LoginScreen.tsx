import {Text, View, TextInput, Dimensions, Touchable, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import tw from "twrnc";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'; 

const LoginScreen = () => {
  const [darkMode, setDarkmode] = useState(true);

    const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  return (
    <SafeAreaView style={[darkMode ? tw`bg-black px-6`: tw`bg-white px-6`]}>
      <View style={tw`flex items-center justify-center w-full h-full`}>
        <View style={tw`flex flex-row justify-center`}>
          <Image style={tw`w-24 h-24`} source={require("../assets/images/9feae60ea81842259049ab0f27467b93-free-removebg-preview.png")} />
          <Text style={[darkMode ? tw`self-center  text-2xl font-semibold text-white` : tw`self-center  text-2xl font-semibold dark:text-white`]}>
            Fire <Text style={tw` text-red-600 `}>Eyes</Text>
          </Text>
        </View>
        <View style={tw`w-full `}>
          <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Phone Number</Text>
          <TextInput
            placeholder="+234"
            placeholderTextColor="#B2BEB5"
            style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black` : tw`h-12 rounded-md px-4 bg-black text-white`]}
          />
          
          <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Password</Text>
          <TextInput
            placeholder="XXXXX"
            placeholderTextColor="#B2BEB5"
            style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black w-full` : tw`h-12 rounded-md px-4 bg-black text-white w-full`]}
          />
         </View>
        <TouchableOpacity style={tw`bg-red-600 rounded-md h-12 w-full my-4 flex items-center justify-center`}>
          <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>Login</Text>
        </TouchableOpacity>
        <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Don't have an account? <Text style={tw`text-blue-600`} onPress={() => router.push("/")}>Signup</Text></Text>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen;