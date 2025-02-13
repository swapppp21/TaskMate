import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100 px-6 py-8">
    <StatusBar 
        backgroundColor="#f3f4f6" // Your desired background color
        barStyle="light-content"     // 'light-content' or 'dark-content'
      />
      {/* Icon/Illustration in Top Left */}
      <View className="absolute top-10 left-10">
        <View className="bg-[#EAE9FE] w-36 h-36 justify-center items-center rounded-lg">
          <Image
            source={require("../assets/images/Tick.png")}
            className="w-54 h-54 ml-24 mt-24"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Title and Subtitle */}
      <View className=" mt-80  ">
        <Text className="font-poppins-bold text-2xl text-black ">
          Get things done.
        </Text>
        <Text className="font-poppins-medium text-lg text-gray-500 ">
          Just a click away from planning your tasks.
        </Text>
      </View>

      {/* Bottom Right Semi-Circle with Arrow */}
      <View className="absolute bottom-0 right-0 w-52 h-52 bg-[#806DFB] rounded-tl-full justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="w-16 h-16  rounded-full justify-center items-center"
        >
          <Image
            source={require("../assets/images/Arrow.png")} // Update to the correct path of your Arrow image
            className="w-24 h-24 mt-10 ml-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
