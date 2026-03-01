import backendInstance from "@/api/AxiosInstance";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from "react-native-toast-message";
import tw from "twrnc";

import { useTheme } from "@/context/ThemeContext";

const ForgotPasswordScreen = () => {
  const { darkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const [emailAddress, setEmailAddress] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const color = "#ffffff";

  // Handle input change (React Native uses onChangeText)
  const handleChange = (text: string) => {
    setEmailAddress(text);
  };

  // Handle form submission
  const handleSubmit = async () => {


    if (!emailAddress) {
      Toast.show({
        type: "error",
        text1: "Please enter your email address"
      });
      return;
    }

    try {
      setLoading(true);

      const response = await backendInstance.post(`/user/forgotPassword/${encodeURIComponent(emailAddress)}`);

      const message =
        typeof response.data === "string"
          ? response.data
          : response.data?.message ?? "Device linked successfully";

      setResponseMessage(message);
      setIsError(false);
      Toast.show({
        type: "success",
        text1: "Password reset link sent to mail"
      });

    //   setTimeout(() => {
    //     router.push("/Dashboard");
    //   }, 1500);

    } catch (error: any) {
      // Log detailed response for debugging
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.error("Link device error:", error?.response?.status, error?.response?.data || error);
      setResponseMessage("Operation failed, try again");
      setIsError(true);
      Toast.show({
        type: "error",
        text1: error?.response?.data
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={[darkMode ? tw`bg-black px-6` : tw`bg-white px-6`]}>
      <View style={tw`flex items-center justify-center w-full h-full`}>
        <Toast/>
        <View style={tw`flex flex-row justify-center`}>
          <Image style={tw`w-24 h-24`} source={require("../assets/images/9feae60ea81842259049ab0f27467b93-free-removebg-preview.png")} />
          <Text style={[darkMode ? tw`self-center  text-2xl font-semibold text-white` : tw`self-center  text-2xl font-semibold dark:text-white`]}>
            Fire <Text style={tw` text-red-600 `}>Eyes</Text>
          </Text>
        </View>
        <View style={tw`w-full `}>
          <Text style={[darkMode ? tw`text-center text-2xl text-white font-bold py-1` : tw` py-1 text-center text-2xl text-black font-bold`]}>Reset Your password</Text>
          <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Email Address</Text>
          <TextInput
            placeholder="johndoe@gmail.com"
            placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
            value={emailAddress}
            onChangeText={handleChange}
            style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black` : tw`h-12 rounded-md px-4 bg-gray-400 text-white`]}
          />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[tw`bg-red-600 rounded-md h-12 w-full my-4 flex items-center justify-center`, loading && { opacity: 0.6 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>Submit</Text>
              )}
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen;