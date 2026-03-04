import backendInstance from "@/api/AxiosInstance";
import { useTheme } from "@/context/ThemeContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSignupStore } from "../store/store";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import tw from "twrnc";

const SignupScreen = () => {
  const { darkMode } = useTheme();
  const { setFormData } = useSignupStore();
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    email: "",
    password: "",
  })

  // const [formData, setFormData] = useState({
  //   name: "",
  //   phonenumber: "",
  //   email: "",
  //   password: "",
  //   notificationPreference: "SMS",
  //   otp: "",
  //   emailVerificationCode: "",
  // });

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const options = [
    { label: "SMS", value: "SMS" },
    { label: "EMAIL", value: "EMAIL" },
  ];

  const [otpLoadingState, setOtpLoadingState] = useState({
    sms: false,
    email: false,
  });


  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(false)

  const handleChange = (name: string, val: string) => {
    setForm({ ...form, [name]: val });
  };

  const validate = () => {
    const isAllNumbers = (str: any) => /^\d+$/.test(str);

    const isEmail = (str: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      newErrors.name = "name is required";
    }
    if (!form.phonenumber) {
      newErrors.phonenumber = "phone number is required"
    } else if (form.phonenumber.length !== 11 || isAllNumbers(form.phonenumber) == false) {
      newErrors.phonenumber = "Phone number is in wrong format, no extra characters '#+'"
    }

    if (!form.email) {
      newErrors.email = "email is required"
    } else if (isEmail(form.email) == false) {
      newErrors.email = "email is in wrong format"
    }

    if (!form.password) {
      newErrors.password = "password is required"
    }

    return newErrors;
  };

  const handleSignupOne = (e: any) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setFormData(form);
      router.push("/SignupTwo");
    } else if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((err) => {
        Toast.show({
          type: "error",
          text1: "Error occured: " + err,
        });
      });
    }
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
                Register
              </Text>
              <Text
                style={[
                  darkMode ? tw`text-white py-2` : tw`text-black py-2`,
                  { fontFamily: "PoppinsRegular" },
                ]}
              >
                Name
              </Text>
              <TextInput
                placeholder="Jane Doe"
                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                value={form.name}
                onChangeText={(t) => handleChange("name", t)}
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
                Email
              </Text>

              <TextInput
                placeholder="Johndoe@gmail.com"
                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                value={form.email}
                onChangeText={(t) => handleChange("email", t)}
                style={[
                  darkMode
                    ? tw`h-12 rounded-md px-4 bg-white text-black `
                    : tw`h-12 rounded-md px-4 bg-gray-400 text-white `,
                ]}
              />


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
                value={form.phonenumber}
                onChangeText={(t) => handleChange("phonenumber", t)}
                style={[
                  darkMode
                    ? tw`h-12 rounded-md px-4 bg-white text-black `
                    : tw`h-12 rounded-md px-4 bg-gray-400 text-white `,
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
              <View style={darkMode ? tw`flex flex-row items-center bg-white rounded-md` : tw`flex flex-row items-center bg-gray-400 rounded-md`}>
                <TextInput
                  placeholder="XXXXX"
                  placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                  secureTextEntry={passwordHidden}
                  value={form.password}
                  onChangeText={(t) => handleChange("password", t)}
                  style={[
                    darkMode
                      ? tw`h-12 rounded-l-md px-4 bg-white text-black w-[90%]`
                      : tw`h-12 rounded-l-md px-4 bg-gray-400 text-white w-[90%]`,
                  ]}
                />
                <AntDesign onPress={() => setPasswordHidden(!passwordHidden)} name={passwordHidden ? "eye" : "eye-invisible"} size={24} color="black" style={tw`mr-4`} />
              </View>
              <View style={tw`flex flex-row justify-center pt-2`}>
                <Text
                  onPress={() => router.push("/Login")}
                  style={[
                    darkMode ? tw`text-white pb-2` : tw`text-black pb-2`,
                    { fontFamily: "PoppinsRegular", flexShrink: 1 },
                  ]}
                >
                  Already have an account?{" "}
                </Text>
                <Text onPress={() => router.push("/Login")}
                  style={[tw`text-blue-600`, { fontFamily: "PoppinsRegular" }]}

                >
                  Login{" "}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleSignupOne}
                style={[
                  tw`bg-red-600 rounded-md h-12 w-full my-4 flex items-center justify-center`,
                  loading && { opacity: 0.6 },
                ]}
              >

                <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>
                  Submit      </Text>

              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>

      </SafeAreaView>
    );
  };

  export default SignupScreen;
