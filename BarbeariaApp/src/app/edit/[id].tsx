import React, { useState, useEffect } from "react";
import { View, Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

import Header from "../../components/header";
import Button from "../../components/button";
import Input from "../../components/input";
import DateTimePickerComponent from "../../components/dateTimePicker";
import Footer from "@/src/components/footer";

const EditAppointmentScreen = () => {
   const router = useRouter();
   const { id } = useLocalSearchParams();
   const [name, setName] = useState("");
   const [dateTime, setDateTime] = useState("");

   const appointmentId = id;

   useEffect(() => {
      if (!id) {
         Alert.alert("Erro", "ID do agendamento inválido.");
         router.push("/");
      }
   }, [id]);

   useEffect(() => {
      loadAppointmentData();
   }, []);

   const loadAppointmentData = async () => {
      try {
         const storedAppointments = await AsyncStorage.getItem("appointments");
         if (storedAppointments) {
            const appointments = JSON.parse(storedAppointments);
            const appointment = appointments.find(
               (appt: any) => appt.id === Number(appointmentId)
            );

            if (appointment) {
               setName(appointment.name);
               setDateTime(appointment.dateTime);
            } else {
               Alert.alert("Erro", "Agendamento não encontrado.");
               router.push("/");
            }
         }
      } catch (error) {
         Alert.alert(
            "Erro",
            "Não foi possível carregar os dados do agendamento."
         );
      }
   };

   const isDateTimeAvailable = async (
      newDateTime: string
   ): Promise<boolean> => {
      try {
         const storedAppointments = await AsyncStorage.getItem("appointments");
         if (storedAppointments) {
            const appointments = JSON.parse(storedAppointments);

            const isTaken = appointments.some(
               (appt: any) =>
                  Math.abs(
                     new Date(appt.dateTime).getTime() -
                        new Date(newDateTime).getTime()
                  ) <
                     80 * 60 * 1000 && appt.id !== Number(appointmentId)
            );

            return !isTaken;
         }
         return true;
      } catch (error) {
         Alert.alert("Erro", "Erro ao validar a disponibilidade do horário.");
         return false;
      }
   };

   const saveUpdatedAppointment = async () => {
      try {
         const isAvailable = await isDateTimeAvailable(dateTime);

         if (!isAvailable) {
            Alert.alert(
               "Horário Indisponível",
               "O horário selecionado já está ocupado. Escolha outro horário."
            );
            return;
         }

         const storedAppointments = await AsyncStorage.getItem("appointments");
         if (storedAppointments) {
            const appointments = JSON.parse(storedAppointments);
            const updatedAppointments = appointments.map((appt: any) =>
               appt.id === Number(appointmentId)
                  ? { ...appt, name, dateTime }
                  : appt
            );

            await AsyncStorage.setItem(
               "appointments",
               JSON.stringify(updatedAppointments)
            );

            Alert.alert("Sucesso", "Agendamento atualizado!");
            router.push("/");
         }
      } catch (error) {
         Alert.alert("Erro", "Não foi possível salvar as alterações.");
      }
   };

   return (
      <View className={`h-full flex-1 bg-gray-200`}>
         <Header />

         <View className={`p-4 h-full flex-1`}>
            <Text className="text-2xl font-bold mb-4 text-center">
               Editar Agendamento
            </Text>
            <Input placeholder="Seu nome" value={name} onChangeText={setName} />

            <DateTimePickerComponent
               selectedDateTime={dateTime}
               setSelectedDateTime={setDateTime}
            />
            <View className="flex flex-col gap-2">
               <Button label="Salvar" onPress={saveUpdatedAppointment} />
               <Button
                  label="Cancelar"
                  color="red"
                  onPress={() => router.push("/")}
               />
            </View>
         </View>
         <Footer />
      </View>
   );
};

export default EditAppointmentScreen;
