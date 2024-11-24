// src/components/Footer.tsx
import React from "react";
import { View, Text } from "react-native";

const Footer = () => (
   <View className={`bg-green-600 p-4`}>
      <Text className={`text-center text-white text-sm`}>
         © 2024 Barbearia App
      </Text>
   </View>
);

export default Footer;
