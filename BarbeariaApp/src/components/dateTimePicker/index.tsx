import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateTimePickerComponentProps {
   selectedDateTime: string;
   setSelectedDateTime: (value: string) => void;
   availableHours?: string[];
}

const DateTimePickerComponent = ({
   selectedDateTime,
   setSelectedDateTime,
   availableHours = [
      "09:00",
      "10:20",
      "11:40",
      "13:00",
      "14:20",
      "15:40",
      "17:00",
      "18:20",
   ],
}: DateTimePickerComponentProps) => {
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [showTimePicker, setShowTimePicker] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

   const onDateChange = (event: any, date?: Date) => {
      setShowDatePicker(false);
      if (date) {
         setSelectedDate(date);
         setShowTimePicker(true);
      }
   };

   const onTimeSelect = (time: string) => {
      if (selectedDate) {
         const [hours, minutes] = time.split(":");
         const updatedDate = new Date(selectedDate);
         updatedDate.setHours(parseInt(hours));
         updatedDate.setMinutes(parseInt(minutes));

         setSelectedDateTime(updatedDate.toISOString());
      }
      setShowTimePicker(false);
   };

   const formatDateTime = (dateTime: string) => {
      const date = new Date(dateTime);
      return new Intl.DateTimeFormat("pt-BR", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(date);
   };

   return (
      <View>
         <TouchableOpacity
            className={`border border-gray-300 rounded p-3 mb-4 bg-white`}
            onPress={() => setShowDatePicker(true)}
         >
            <Text className={`text-gray-700`}>
               {selectedDateTime
                  ? formatDateTime(selectedDateTime)
                  : "Selecione a data e horário"}
            </Text>
         </TouchableOpacity>

         {showDatePicker && (
            <DateTimePicker
               value={selectedDate || new Date()}
               mode="date"
               display="calendar"
               onChange={onDateChange}
               minimumDate={new Date()}
            />
         )}

         <Modal visible={showTimePicker} transparent animationType="slide">
            <View className={`flex-1 justify-center bg-black/40`}>
               <View className={`bg-white rounded-lg mx-4 p-4`}>
                  <Text className={`text-lg font-bold mb-4 text-center`}>
                     Selecione um horário
                  </Text>
                  <FlatList
                     data={availableHours}
                     keyExtractor={(item) => item}
                     renderItem={({ item }) => (
                        <TouchableOpacity
                           className={`p-4 border-b border-gray-200`}
                           onPress={() => onTimeSelect(item)}
                        >
                           <Text className={`text-center text-gray-800`}>
                              {item}
                           </Text>
                        </TouchableOpacity>
                     )}
                  />
                  <TouchableOpacity
                     className={`mt-4 p-4 bg-red-500 rounded`}
                     onPress={() => setShowTimePicker(false)}
                  >
                     <Text className={`text-center text-white font-bold`}>
                        Cancelar
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
      </View>
   );
};

export default DateTimePickerComponent;
