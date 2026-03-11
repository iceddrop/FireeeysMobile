import SignupScreen from "@/screens/SignupScreen";
import { Stack } from "expo-router";
export default function index() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SignupScreen />
    </>
  );
}