import React, { useState, useEffect, useRef } from "react";
import { Animated, View, Text, Image, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import "../global.css";

export default function RootLayout() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const [fontsLoaded] = useFonts({
    'Neco-Black': require('../assets/fonts/Neco-Black.otf'),
    'Neco-BlackItalic': require('../assets/fonts/Neco-BlackItalic.otf'),
    'Neco-Bold': require('../assets/fonts/Neco-Bold.otf'),
    'Neco-BoldItalic': require('../assets/fonts/Neco-BoldItalic.otf'),
    'Neco-Italic': require('../assets/fonts/Neco-Italic.otf'),
    'Neco-Medium': require('../assets/fonts/Neco-Medium.otf'),
    'Neco-MediumItalic': require('../assets/fonts/Neco-MediumItalic.otf'),
    'Neco-Regular': require('../assets/fonts/Neco-Regular.otf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins-ExtraLight.otf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.otf'),
    'Poppins-ThinItalic': require('../assets/fonts/Poppins-ThinItalic.otf'),
    'Poppins-Black': require('../assets/fonts/Poppins-Black.otf'),
    'Poppins-BlackItalic': require('../assets/fonts/Poppins-BlackItalic.otf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.otf'),
    'Poppins-BoldItalic': require('../assets/fonts/Poppins-BoldItalic.otf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.otf'),
    'Poppins-ExtraBoldItalic': require('../assets/fonts/Poppins-ExtraBoldItalic.otf'),
    'Poppins-ExtraLightItalic': require('../assets/fonts/Poppins-ExtraLightItalic.otf'),
    'Poppins-Italic': require('../assets/fonts/Poppins-Italic.otf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.otf'),
    'Poppins-LightItalic': require('../assets/fonts/Poppins-LightItalic.otf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.otf'),
    'Poppins-MediumItalic': require('../assets/fonts/Poppins-MediumItalic.otf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.otf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.otf'),
    'Poppins-SemiBoldItalic': require('../assets/fonts/Poppins-SemiBoldItalic.otf'),
  });

  const letterAnimations = "TaskMate".split("").map(() => useRef(new Animated.Value(0)).current);
  const imageScale = useRef(new Animated.Value(0)).current;

  const initialImageTranslateX = -75; // Half of image width (150)
  const imagePosition = useRef(new Animated.Value(initialImageTranslateX)).current; // Not used in this version
  const zoomScale = useRef(new Animated.Value(1)).current; // Not used in this version

  useEffect(() => {
    if (!fontsLoaded) return;

    const textAppearAnimation = Animated.stagger(
      100,
      letterAnimations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    );

    const textDisappearAnimation = Animated.stagger(
      100,
      [...letterAnimations].reverse().map((anim) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      )
    );

    const imageAppearAnimation = Animated.timing(imageScale, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    Animated.sequence([
      textAppearAnimation,
      textDisappearAnimation,
      imageAppearAnimation,
    ]).start(() => {
      setTimeout(() => {
        setIsSplashVisible(false);
      }, 100);
    });
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (isSplashVisible) {
    return (
      <View className="flex-1 bg-[#806DFB] justify-center items-center">
        <StatusBar backgroundColor="#806DFB" barStyle="light-content" />

        <View style={{ flexDirection: "row", alignItems: "center", position: "absolute" }}>
          {letterAnimations.map((anim, index) => (
            <Animated.Text
              key={index}
              className="font-neco-bold"
              style={{
                fontSize: 62,
                color: "white",
                opacity: anim,
                marginLeft: 2,
              }}
            >
              {"TaskMate"[index]}
            </Animated.Text>
          ))}
        </View>

        <Animated.Image
          source={require("../assets/images/TaskMate Logo.png")}
          style={{
            width: 150,
            height: 150,
            transform: [{ scale: imageScale }],
            opacity: imageScale,
          }}
        />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}