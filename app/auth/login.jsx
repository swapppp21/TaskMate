import { View, Text, TextInput, TouchableOpacity, Image, Alert, Animated, Easing } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const jiggleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jiggleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(jiggleAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotation = jiggleAnim.interpolate({
    inputRange: [ 0.25, 0.5, 0.75],
    outputRange: [ '-10deg', '0deg', '10deg',],
  });

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login Successful");
      router.push("/tasks");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1 bg-white px-8 py-12">
      <View className="justify-center items-center mt-8">
        <Animated.Image
          source={require("../../assets/images/Frame 1.png")}
          className="w-56 h-56"
          resizeMode="contain"
          style={{
            transform: [{ rotate: rotation }]
          }}
        />
      </View>

      <Text className="text-3xl text-center font-poppins-semibold text-gray-800 mb-4">
        Welcome back!
      </Text>

      <View className="bg-white rounded-xl p-4 mb-2">
        <Text className="text-sm text-gray-600 font-poppins-medium mb-2">Email</Text>
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 font-poppins-regular"
          placeholder="JohnDoe@example.com"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />

        <Text className="text-sm text-gray-600 font-poppins-medium mb-2">Password</Text>
        <TextInput
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 font-poppins-regular"
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity className="">
          <Text className="text-[#806DFB] font-poppins-medium text-sm text-right">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <View className="items-center">
        <TouchableOpacity
          className="w-11/12 py-4 bg-[#806DFB] rounded-xl mb-8 shadow-sm"
          onPress={handleLogin}
        >
          <Text className="text-white text-center font-poppins-semibold text-lg">
            Log In
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-center mb-8">
        <View className="flex-1 h-[1px] bg-gray-200"></View>
        <Text className="px-4 text-gray-400 font-poppins-medium text-sm">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-200"></View>
      </View>

      <View className="flex-row justify-center mb-8">
        <TouchableOpacity className="bg-gray-50 p-4 rounded-full">
          <Image
            source={require("../../assets/images/google.png")}
            className="w-12 h-12"
          />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-50 p-4 ml-4 mr-4 rounded-full">
          <Image
            source={require("../../assets/images/apple.png")}
            className="w-12 h-12"
          />
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-50 p-4 rounded-full">
          <Image
            source={require("../../assets/images/communication.png")}
            className="w-12 h-12"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => router.push("/auth/signup")} 
        className="justify-center items-center"
      >
        <Text className="text-gray-600 font-poppins-regular">
          New to TaskMate?{" "}
          <Text className="text-[#806DFB] font-poppins-semibold">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}