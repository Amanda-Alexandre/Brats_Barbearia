import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Button = ({
   label,
   onPress,
   color,
}: {
   label: string;
   onPress: () => void;
   color?: string;
}) => (
   <TouchableOpacity
      className={`p-3 rounded`}
      style={{ backgroundColor: color || "green" }}
      onPress={onPress}
   >
      <Text className={`text-center text-base text-white font-bold`}>
         {label}
      </Text>
   </TouchableOpacity>
);

export default Button;
