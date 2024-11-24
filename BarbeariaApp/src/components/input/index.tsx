import React from "react";
import { TextInput } from "react-native";

const Input = ({
   placeholder,
   value,
   onChangeText,
}: {
   placeholder: string;
   value: string;
   onChangeText: (text: string) => void;
}) => (
   <TextInput
      className={`border bg-white border-gray-300 rounded p-3 mb-4`}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
   />
);

export default Input;
