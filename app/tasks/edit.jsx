import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", id);
        const task = await getDoc(docRef);
        if (task.exists()) {
          const data = task.data();
          setTitle(data.title);
          setDescription(data.description);
          setDueDate(
            new Date(data.dueDate.seconds * 1000)
              .toISOString()
              .split("T")[0]
          );
          setPriority(data.priority);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch task details");
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdateTask = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const docRef = doc(db, "tasks", id);
      await updateDoc(docRef, {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
      });
      Alert.alert("Success", "Task updated successfully");
      router.push("/tasks");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDueDate(date.toISOString().split("T")[0]);
    hideDatePicker();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#806DFB] px-4 pt-16 pb-8 rounded-b-[2.5rem]">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Image 
              source={require("../../assets/header/back.png")} 
              className="w-8 h-8 ml-6"
            />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-poppins-semibold">
            Edit Task
          </Text>
          <View className="mr-16" /> {/* Empty view for spacing */}
        </View>
      </View>

      {/* Form Container */}
      <View className="px-6 pt-8">
        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-gray-600 font-poppins-medium mb-2">Title</Text>
          <TextInput
            className="bg-gray-50 rounded-xl px-4 py-3 font-poppins-regular border border-gray-200"
            placeholder="Enter task title"
            onChangeText={setTitle}
            value={title}
          />
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-gray-600 font-poppins-medium mb-2">Description</Text>
          <TextInput
            className="bg-gray-50 rounded-xl px-4 py-3 font-poppins-regular border border-gray-200"
            placeholder="Enter task description"
            onChangeText={setDescription}
            value={description}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Due Date Picker */}
        <View className="mb-6">
          <Text className="text-gray-600 font-poppins-medium mb-2">Due Date</Text>
          <TouchableOpacity
            className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
            onPress={showDatePicker}
          >
            <Text className="font-poppins-regular text-gray-700">
              {dueDate || "Select due date"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Priority Selector */}
        <View className="mb-8">
          <Text className="text-gray-600 font-poppins-medium mb-2">Priority</Text>
          <TouchableOpacity
            className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3"
            onPress={() => setPickerVisible(true)}
          >
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-2 ${
                priority === 'low' 
                  ? 'bg-green-500' 
                  : priority === 'medium' 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`} />
              <Text className={`font-poppins-regular ${
                priority === 'low' 
                  ? 'text-green-500' 
                  : priority === 'medium' 
                  ? 'text-yellow-500' 
                  : 'text-red-500'
              }`}>
                {priority === 'low' 
                  ? 'Low Priority' 
                  : priority === 'medium' 
                  ? 'Medium Priority' 
                  : 'High Priority'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          className="bg-[#806DFB] rounded-xl py-4 shadow-sm"
          onPress={handleUpdateTask}
        >
          <Text className="text-white text-center font-poppins-semibold text-lg">
            Update Task
          </Text>
        </TouchableOpacity>
      </View>

      {/* Priority Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity 
            className="absolute inset-0 bg-black/50"
            activeOpacity={1}
            onPress={() => setPickerVisible(false)}
          />
          <View className="bg-white rounded-t-xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-poppins-medium">Select Priority</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text className="text-[#806DFB] font-poppins-medium">Close</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              className="p-4 border-b border-gray-200"
              onPress={() => {
                setPriority('low');
                setPickerVisible(false);
              }}
            >
              <Text className="text-lg font-poppins-medium text-green-500">Low Priority</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              className="p-4 border-b border-gray-200"
              onPress={() => {
                setPriority('medium');
                setPickerVisible(false);
              }}
            >
              <Text className="text-lg font-poppins-medium text-yellow-500">Medium Priority</Text>
            </TouchableOpacity>
    
            <TouchableOpacity
              className="p-4"
              onPress={() => {
                setPriority('high');
                setPickerVisible(false);
              }}
            >
              <Text className="text-lg font-poppins-medium text-red-500">High Priority</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
    </View>
  );
}