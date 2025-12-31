
import { ScrollView, Text, View, TextInput, Dimensions, Touchable, TouchableOpacity, Pressable, Modal, FlatList, Image } from "react-native"
import tw from "twrnc";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

const SignupScreen = () => {
  const [darkMode, setDarkmode] = useState(true);
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const options = [
    { label: 'SMS', value: 'SMS' },
    { label: 'EMAIL', value: 'EMAIL' },
  ];

  return (
    <SafeAreaView style={[darkMode ? tw`bg-black` : tw`bg-white`]}>
      <ScrollView style={[darkMode ? tw`px-6` : tw` px-6`]}>
        <View style={tw`flex items-center justify-center w-full h-full`}>
          <View style={tw`flex flex-row justify-center`}>
            <Image style={tw`w-24 h-24`} source={require("../assets/images/9feae60ea81842259049ab0f27467b93-free-removebg-preview.png")} />
            <Text style={[darkMode ? tw`self-center  text-2xl font-semibold text-white` : tw`self-center  text-2xl font-semibold dark:text-white`]}>
              Fire <Text style={tw` text-red-600 `}>Eyes</Text>
            </Text>
          </View>
          <View style={tw`w-full `}>
            <Text style={[darkMode ? tw`text-center text-2xl text-white font-bold py-1` : tw` py-1 text-center text-2xl text-black font-bold`]}>Register</Text>
            <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Name</Text>
            <TextInput
              placeholder="Jane Doe"
              placeholderTextColor="#B2BEB5"
              style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black` : tw`h-12 rounded-md px-4 bg-black text-white`]}
            />
            <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Email</Text>
            <View style={tw`flex flex-row`}>
              <TextInput
                placeholder="Johndoe@gmail.com"
                placeholderTextColor="#B2BEB5"
                style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black w-60` : tw`h-12 rounded-md px-4 bg-black text-white w-60`]}
              />
              <TouchableOpacity style={tw`bg-red-600 rounded-md h-12 px-4 ml-2 flex items-center justify-center`}>
                <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>Send OTP</Text>
              </TouchableOpacity>
            </View>
            <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Phone Number</Text>
            <View style={tw`flex flex-row `}>
              <TextInput
                placeholder="+234"
                placeholderTextColor="#B2BEB5"
                style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black w-60` : tw`h-12 rounded-md px-4 bg-black text-white w-60`]}
              />
              <TouchableOpacity style={tw`bg-red-600 rounded-md h-12 px-4 ml-2 flex items-center justify-center`}>
                <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>Send OTP</Text>
              </TouchableOpacity>
            </View>
            <View style={tw`w-full my-2`}>
              <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>How'd you like to get notifications?</Text>
              <Pressable
                onPress={() => setOpen(true)}
                style={[darkMode ? tw`border border-gray-300 rounded-lg px-4 py-3 bg-white`: tw`border border-gray-300 rounded-lg px-4 py-3 bg-black`]}
              >
                <Text style={[darkMode ? tw`text-base text-black` : tw`text-base text-white`]}>
                  {value ?? 'Select language'}
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
                <View style={[darkMode ? tw`bg-black px-4 pt-4 pb-6 rounded-t-2xl` : tw`bg-white px-4 pt-4 pb-6 rounded-t-2xl`]}>
                  <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>
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
                          setOpen(false);
                        }}
                        style={tw`py-4`}
                      >
                        <Text style={[darkMode ? tw`text-base text-white` : tw`text-base text-black`]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    )}
                  />
                </View>
              </Modal>
            </View>
            <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Password</Text>
            <TextInput
              placeholder="XXXXX"
              placeholderTextColor="#B2BEB5"
              style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black w-full` : tw`h-12 rounded-md px-4 bg-black text-white w-full`]}
            />
            <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>SMS OTP</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="#B2BEB5"
              style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black w-full` : tw`h-12 rounded-md px-4 bg-black text-white w-full`]}
            />
            <Text style={[darkMode ? tw`text-white py-2` : tw`text-black py-2`, { fontFamily: "PoppinsRegular" }]}>Email OTP</Text>
            <TextInput
              placeholder=""
              placeholderTextColor="white"
              style={[darkMode ? tw`h-12 rounded-md px-4 bg-white text-black w-full` : tw`h-12 rounded-md px-4 bg-black text-white w-full`]}
            />
          </View>
          <TouchableOpacity style={tw`bg-red-600 rounded-md h-12 w-full my-4 flex items-center justify-center`}>
            <Text style={[tw`text-white`, { fontFamily: "PoppinsRegular" }]}>Signup</Text>
          </TouchableOpacity>
          <Text style={[darkMode ? tw`text-white pb-2` : tw`text-black pb-2`, { fontFamily: "PoppinsRegular" }]}>Already have an account? <Text style={tw`text-blue-600`} onPress={() => router.push("/Login")}>Login</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignupScreen