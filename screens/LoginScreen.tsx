import backendInstance from "@/api/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import { JwtPayload } from "../types/login.types";

import { useTheme } from "@/context/ThemeContext";

const LoginScreen = () => {
  const { darkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [color] = useState("#ffffff");
  const router = useRouter();

  const handleChange = (name: string, val: string) => {
    setFormData({ ...formData, [name]: val });
  };

  const handleLogin = async () => {
    setError("");

    try {
      setLoading(true);

      const response = await backendInstance.post("/user/auth/login", formData);

      const data = response.data;

      const token = data.token;
      if (!token) {
        throw new Error("No token returned from server");
      }
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("phonenumber", formData.phoneNumber);
      const decoded = jwtDecode<JwtPayload>(token);

      const user = {
        phoneNumber: decoded.phoneNumber,
        name: decoded.name,
        role: decoded.role || "ROLE_USER",
        isVerified: decoded.isVerified ?? true,
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("role", user.role);

      if (user.role === "ROLE_ADMIN") {
        router.push("/Dashboard");
      } else {
        router.push("/LinkDevice");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Login axios error:", err.response || err);
        const serverMessage = err.response?.data?.message || err.message;
        Toast.show({
          type: "error",
          text1: serverMessage,
        });
      } else if (err instanceof Error) {
        Toast.show({
          type: "error",
          text1: err.message,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error! Try again",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[darkMode ? tw`bg-black px-6` : tw`bg-white px-6`]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <View style={tw`flex items-center justify-center w-full h-full`}>
        <Toast />
        <View style={tw`flex flex-row justify-center`}>
          <Image
            style={tw`w-24 h-24`}
            source={require("../assets/images/9feae60ea81842259049ab0f27467b93-free-removebg-preview.png")}
          />
          <Text
            style={[
              darkMode
                ? tw`self-center  text-2xl font-semibold text-white`
                : tw`self-center  text-2xl font-semibold dark:text-white`,
            ]}
          >
            Fire <Text style={tw` text-red-600 `}>Eyes</Text>
          </Text>
        </View>
        <View style={tw`w-full `}>
          <Text
            style={[
              darkMode
                ? tw`text-center text-2xl text-white font-bold py-1`
                : tw` py-1 text-center text-2xl text-black font-bold`,
            ]}
          >
            Login
          </Text>
          <Text
            style={[
              darkMode ? tw`text-white py-2` : tw`text-black py-2`,
              { fontFamily: "PoppinsRegular" },
            ]}
          >
            Phone Number
          </Text>
          <TextInput
            placeholder="+234"
            placeholderTextColor="#B2BEB5"
            onChangeText={(t) => handleChange("phoneNumber", t)}
            style={[
              darkMode
                ? tw`h-12 rounded-md px-4 bg-white text-black`
                : tw`h-12 rounded-md px-4 bg-black text-white`,
            ]}
          />

          <Text
            style={[
              darkMode ? tw`text-white py-2` : tw`text-black py-2`,
              { fontFamily: "PoppinsRegular" },
            ]}
          >
            Password
          </Text>
          <TextInput
            placeholder="XXXXX"
            placeholderTextColor="#B2BEB5"
            onChangeText={(t) => handleChange("password", t)}
            style={[
              darkMode
                ? tw`h-12 rounded-md px-4 bg-white text-black w-full`
                : tw`h-12 rounded-md px-4 bg-black text-white w-full`,
            ]}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={[
            tw`bg-red-600 rounded-md h-12 w-full my-4 flex items-center justify-center`,
            loading && { opacity: 0.6 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>
              Login
            </Text>
          )}
        </TouchableOpacity>
        <Text
          style={[
            darkMode ? tw`text-white py-2` : tw`text-black py-2`,
            { fontFamily: "PoppinsRegular" },
          ]}
        >
          Don't have an account?{" "}
          <Text style={tw`text-blue-600`} onPress={() => router.push("/")}>
            Signup     </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
