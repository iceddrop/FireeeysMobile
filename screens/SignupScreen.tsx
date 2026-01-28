import backendInstance from "@/api/AxiosInstance";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import tw from "twrnc";
import { useTheme } from "@/context/ThemeContext";

const SignupScreen = () => {
  const { darkMode } = useTheme();
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    email: "",
    password: "",
    notificationPreference: "SMS",
    otp: "",
    emailVerificationCode: "",
  });

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

  const [error] = useState("");
  const [loading, setLoading] = useState(false);
  const [color] = useState("#ffffff");

  const handleChange = (name: string, val: string) => {
    setFormData({ ...formData, [name]: val });
  };

  const handleSendOtp = async () => {
    try {
      setOtpLoadingState({ ...otpLoadingState, sms: true });
      const response = await backendInstance.post(
        `/user/sendOtp/${formData.phonenumber}`,
      );
      console.log(response);

      Toast.show({
        type: "success",
        text1: "SMS OTP sent successfully!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: 'Failed to send SMS OTP' + error,
      });
    } finally {
      setOtpLoadingState({ ...otpLoadingState, sms: false });
    }
  };

  const handleSendEmailOtp = async () => {
    try {
      setOtpLoadingState({ ...otpLoadingState, email: true });
      const response = await backendInstance.post(
        `/user/sendOtpToEmail/${encodeURIComponent(formData.email)}`,
      );
      console.log(response);
      Toast.show({
        type: "success",
        text1: '"Email OTP sent successfully!"',
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: 'Error occured' + error,
      });
    } finally {
      setOtpLoadingState({ ...otpLoadingState, email: false });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await backendInstance.post(
        "/user/verifyOtpAndCreateUser",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (
        response.status === 200 &&
        response.data === " User registered successfully."
      ) {
        Toast.show({
          type: "success",
          text1: "Registration Successful!",
        });
        router.push("/Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Registration failed: " + response.data,
        });
        router.push("/Login");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Registration error:",
          // error.response?.data ||
          error.message,
        );

        Toast.show({
          type: "error",
          text1: "Error occured" + error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView style={[darkMode ? tw`px-6` : tw` px-6`]}>
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
              value={formData.name}
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
              value={formData.email}
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
              placeholder="+234"
              placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
              value={formData.phonenumber}
              onChangeText={(t) => handleChange("phonenumber", t)}
              style={[
                darkMode
                  ? tw`h-12 rounded-md px-4 bg-white text-black `
                  : tw`h-12 rounded-md px-4 bg-gray-400 text-white `,
              ]}
            />

            <View style={tw`w-full my-2`}>
              <Text
                style={[
                  darkMode ? tw`text-white py-2` : tw`text-black py-2`,
                  { fontFamily: "PoppinsRegular" },
                ]}
              >
                How'd you like to get notifications?
              </Text>
              <Pressable
                onPress={() => setOpen(true)}
                style={[
                  darkMode
                    ? tw`border border-gray-300 rounded-lg px-4 py-3 bg-white`
                    : tw`border border-gray-300 rounded-lg px-4 py-3 bg-gray-400`,
                ]}
              >
                <Text
                  style={[
                    darkMode
                      ? tw`text-base text-black`
                      : tw`text-base text-white`,
                  ]}
                >
                  {value ??
                    formData.notificationPreference ??
                    "Select language"}
                </Text>
              </Pressable>

              {/* Modal */}
              <Modal visible={open} transparent animationType="slide">
                {/* Backdrop */}
                <Pressable
                  style={tw`flex-1 bg-black/40`}
                  onPress={() => setOpen(false)}
                />

                {/* Bottom Sheet */}
                <View
                  style={[
                    darkMode
                      ? tw`bg-black px-4 pt-4 pb-6 rounded-t-2xl`
                      : tw`bg-white px-4 pt-4 pb-6 rounded-t-2xl`,
                  ]}
                >
                  <Text
                    style={[
                      darkMode ? tw`text-white py-2` : tw`text-black py-2`,
                      { fontFamily: "PoppinsRegular" },
                    ]}
                  >
                    How'd you like to get your notifications?
                  </Text>

                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value}
                    ItemSeparatorComponent={() => (
                      <View style={[tw`h-px bg-gray-600`]} />
                    )}
                    renderItem={({ item }) => (
                      <Pressable
                        onPress={() => {
                          setValue(item.value);
                          setFormData({
                            ...formData,
                            notificationPreference: item.value,
                          });
                          setOpen(false);
                        }}
                        style={tw`py-4`}
                      >
                        <Text
                          style={[
                            darkMode
                              ? tw`text-base text-white`
                              : tw`text-base text-black`,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
              </Modal>
            </View>
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
              placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
              secureTextEntry
              value={formData.password}
              onChangeText={(t) => handleChange("password", t)}
              style={[
                darkMode
                  ? tw`h-12 rounded-md px-4 bg-white text-black w-full`
                  : tw`h-12 rounded-md px-4 bg-gray-400 text-white w-full`,
              ]}
            />
            <Text
              style={[
                darkMode ? tw`text-white py-2` : tw`text-black py-2`,
                { fontFamily: "PoppinsRegular" },
              ]}
            >
              SMS OTP
            </Text>
            <View style={tw`flex flex-row justify-between`}>
              <TextInput
                placeholder="Enter SMS OTP"
                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                value={formData.otp}
                onChangeText={(t) => handleChange("otp", t)}
                style={[
                  darkMode
                    ? tw`h-12 rounded-md px-4 bg-white text-black w-56 mr-1`
                    : tw`h-12 rounded-md px-4 bg-gray-400 text-white w-56 mr-1`,
                ]}
              />

              <TouchableOpacity
                onPress={handleSendOtp}
                disabled={otpLoadingState.sms}
                style={[
                  tw`bg-red-600 rounded-md h-12 px-4 flex items-center justify-center`,
                  otpLoadingState.sms && { opacity: 0.6 },
                ]}
              >
                {otpLoadingState.sms ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}
                  >
                    Send OTP
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text
              style={[
                darkMode ? tw`text-white py-2` : tw`text-black py-2`,
                { fontFamily: "PoppinsRegular" },
              ]}
            >
              Email OTP
            </Text>
            <View style={tw`flex flex-row justify-between`}>
              <TextInput
                placeholder="Enter Email OTP"
                placeholderTextColor={darkMode ? "#B2BEB5" : "#374151"}
                value={formData.emailVerificationCode}
                onChangeText={(t) => handleChange("emailVerificationCode", t)}
                style={[
                  darkMode
                    ? tw`h-12 rounded-md px-4 bg-white text-black w-56 mr-1`
                    : tw`h-12 rounded-md px-4 bg-gray-400 text-white w-56 mr-1`,
                ]}
              />

              <TouchableOpacity
                onPress={handleSendEmailOtp}
                disabled={otpLoadingState.email}
                style={[
                  tw`bg-red-600 rounded-md h-12 px-4 flex items-center justify-center`,
                  otpLoadingState.email && { opacity: 0.6 },
                ]}
              >
                {otpLoadingState.email ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}
                  >
                    Send OTP
                  </Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
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
                Signup      </Text>
            )}
          </TouchableOpacity>
          <View style={tw`flex flex-row justify-center`}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
