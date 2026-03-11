import backendInstance from "@/api/AxiosInstance";
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [color] = useState("#ffffff");
  const router = useRouter();
  const [passwordHidden, setPasswordHidden] = useState(false)

  const handleChange = (name: string, val: string) => {
    setFormData({ ...formData, [name]: val });
  };

  const validate = () => {

    const newErrors: { [key: string]: string } = {};
    if (!formData.phoneNumber) {
      newErrors.phonenumber = "phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "password is required"
    }

    return newErrors;
  };

  const handleLogin = async () => {

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
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
      } catch (err: any) {
        if (err.response?.status === 401) {
          Toast.show({
            type: "error",
            text1: "Unable to login with details, check and try again!",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Some error occured, Please try again.",
          });
        }
      } finally {
        setLoading(false);
      }
    } else if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((err) => {
        Toast.show({
          type: "error",
          text1: "Error occured: " + err,
        });
      })
    };
  }

  return (
    <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <KeyboardAwareScrollView style={[darkMode ? tw`px-6 h-full` : tw` px-6 h-full`]} keyboardShouldPersistTaps="handled">
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
              placeholder="080XXXXXXXX"
              placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
              onChangeText={(t) => handleChange("phoneNumber", t)}
              style={[
                darkMode
                  ? tw`h-12 rounded-md px-4 bg-white text-black`
                  : tw`h-12 rounded-md px-4 bg-gray-400 text-white`,
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
            <View style={darkMode ? tw`flex flex-row justify-between items-center bg-white rounded-md` : tw`flex flex-row items-center bg-gray-400 rounded-md`}>
              <TextInput
                placeholder="XXXXX"
                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                secureTextEntry={passwordHidden}
                value={formData.password}
                onChangeText={(t) => handleChange("password", t)}
                style={[
                  darkMode
                    ? tw` h-12 rounded-l-md px-4 bg-white text-black w-[90%]`
                    : tw` h-12 rounded-l-md px-4 bg-gray-400 text-white  w-[90%]`,
                ]}
              />
              <AntDesign onPress={() => setPasswordHidden(!passwordHidden)} name={passwordHidden ? "eye" : "eye-invisible"} size={24} color="black" style={tw`mr-4 text-end`} />
            </View>
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
          <View style={tw`w-full`}>
            <View style={tw`items-end`}>
              <Text style={tw`text-blue-600`} onPress={() => router.push("/ForgotPassword")}>
                Forgot password?
              </Text>
            </View>
          </View>
          <Text
            style={[
              darkMode ? tw`text-white my-4` : tw`text-black my-4`,
              { fontFamily: "PoppinsRegular" },
            ]}
          >
            Don't have an account?{" "}
            <Text style={tw`text-blue-600`} onPress={() => router.push("/(auth)")}>
              Signup
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView >
  );
};

export default LoginScreen;
