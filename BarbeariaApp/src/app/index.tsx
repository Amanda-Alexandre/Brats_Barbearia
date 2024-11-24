import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Navigator, useRouter } from "expo-router";
import Header from "../components/header";
import Footer from "../components/footer";
import Button from "../components/button";
import Input from "../components/input";
import DateTimePickerComponent from "../components/dateTimePicker";

const HomeScreen = () => {
   const [name, setName] = useState("");
   const [dateTime, setDateTime] = useState("");
   const [appointments, setAppointments] = useState<any[]>([]);
   const router = useRouter();

   useEffect(() => {
      loadAppointments();
   }, []);

   const loadAppointments = async () => {
      try {
         const storedAppointments = await AsyncStorage.getItem("appointments");
         if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
         }
      } catch (error) {
         Alert.alert("Erro", "Não foi possível carregar os agendamentos.");
      }
   };

   const saveAppointments = async (newAppointments: any[]) => {
      try {
         await AsyncStorage.setItem(
            "appointments",
            JSON.stringify(newAppointments)
         );
      } catch (error) {
         Alert.alert("Erro", "Não foi possível salvar os agendamentos.");
      }
   };

   const handleAddAppointment = () => {
      if (!name || !dateTime) {
         Alert.alert("Aviso", "Por favor, preencha todos os campos.");
         return;
      }

      const parsedDateTime = new Date(dateTime);
      const isValid = appointments.every(
         (appt) =>
            Math.abs(
               new Date(appt.dateTime).getTime() - parsedDateTime.getTime()
            ) >=
            80 * 60 * 1000
      );

      if (!isValid) {
         Alert.alert(
            "Horário Indisponível",
            "O horário selecionado já está ocupado. Escolha outro horário."
         );
         return;
      }

      const newAppointment = { id: Date.now(), name, dateTime };
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      saveAppointments(updatedAppointments);
      setName("");
      setDateTime("");
   };

   const handleDeleteAppointment = (id: number) => {
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);
      saveAppointments(updatedAppointments);
   };

   const formatDateTime = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      };
      return new Intl.DateTimeFormat("pt-BR", options).format(
         new Date(dateString)
      );
   };

   return (
      <View className={`h-full flex-1 bg-gray-100`}>
         <Header />

         <View className={`p-4 h-full flex-1`}>
            <Text className="text-2xl font-bold mb-4 text-center">
               Agende seu horário
            </Text>
            <Input placeholder="Seu nome" value={name} onChangeText={setName} />

            <DateTimePickerComponent
               selectedDateTime={dateTime}
               setSelectedDateTime={setDateTime}
            />

            <Button label="AGENDAR" onPress={handleAddAppointment} />

            {appointments.length > 0 && (
               <Text className={`mt-6 text-xl font-bold`}>Agendamentos:</Text>
            )}
            <FlatList
               data={appointments}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => (
                  <View className={`p-4 my-2 bg-green-400/20 rounded`}>
                     <Text className={`text-xl font-bold`}>{item.name}</Text>
                     <Text className={`text-gray-800 font-medium text-base`}>
                        {formatDateTime(item.dateTime)}
                     </Text>

                     <View className={`flex-row mt-2 justify-end gap-2 `}>
                        <Button
                           label="Editar"
                           color="blue"
                           onPress={() =>
                              router.push({
                                 pathname: "/edit/[id]",
                                 params: { id: item.id.toString() },
                              })
                           }
                        />
                        <Button
                           label="Remover"
                           color="red"
                           onPress={() => handleDeleteAppointment(item.id)}
                        />
                     </View>
                  </View>
               )}
            />
         </View>
         <Footer />
      </View>
   );
};

export default HomeScreen;
