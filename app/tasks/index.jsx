import React, { useState, useEffect,useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  StatusBar,
  Modal,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { format } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function Tasks() {
  const router = useRouter();
  const swipeableRefs = useRef({});
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [priorityFilterActive, setPriorityFilterActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const currentDate = format(new Date(), 'MMM d, yyyy');

  useEffect(() => {
    const fetchTasks = () => {
      const q = query(
        collection(db, "tasks"),
        orderBy("dueDate", "asc"),
        ...(priorityFilterActive ? [] : []),
        ...(statusFilter !== "" ? [where("completed", "==", statusFilter === "completed")] : [])
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const taskList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
        applyFilter(taskList, filterType);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchTasks();
    return unsubscribe;
  }, [priorityFilterActive, statusFilter, filterType]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      applyFilter(tasks, filterType);
    } else {
      setFilteredTasks(
        tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()))
      );
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      Alert.alert("Success", "Task deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      const taskRef = doc(db, "tasks", id);
      const task = filteredTasks.find(t => t.id === id);
      await updateDoc(taskRef, {
        completed: !task.completed
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const applyFilter = (tasksList, filter) => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    let filtered = tasksList;

    if (filter === "today") {
      filtered = tasksList.filter(
        (task) => task.dueDate.seconds * 1000 >= startOfDay.getTime() &&
          task.dueDate.seconds * 1000 <= endOfDay.getTime()
      );
    } else if (filter === "tomorrow") {
      const tomorrow = new Date(startOfDay);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startOfTomorrow = new Date(tomorrow);
      const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

      filtered = tasksList.filter(
        (task) => task.dueDate.seconds * 1000 >= startOfTomorrow.getTime() &&
          task.dueDate.seconds * 1000 <= endOfTomorrow.getTime()
      );
    } else if (filter === "thisWeek") {
      const startOfWeek = new Date(startOfDay);
      const endOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      endOfWeek.setDate(startOfDay.getDate() + (6 - startOfDay.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      filtered = tasksList.filter(
        (task) => task.dueDate.seconds * 1000 >= startOfWeek.getTime() &&
          task.dueDate.seconds * 1000 <= endOfWeek.getTime()
      );
    } else if (priorityFilterActive) {
      filtered = [...tasksList].sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (filter === "all") {
      filtered = [...tasksList].sort((a, b) => a.dueDate.seconds - b.dueDate.seconds);
    }

    setFilteredTasks(filtered);
  };

  const togglePriorityFilter = () => {
    setPriorityFilterActive(!priorityFilterActive);
    if (!priorityFilterActive) {
      applyFilter(tasks, "priority");
    } else {
      applyFilter(tasks, "all");
    }
  };

  const renderTask = ({ item }) => {
    const renderRightActions = () => (
      <TouchableOpacity 
        className="bg-red-500 w-20 h-[3.9rem] rounded-lg justify-center items-center"
        onPress={() => handleDeleteTask(item.id)}
      >
        <Text className="text-white font-poppins-medium">Delete</Text>
      </TouchableOpacity>
    );

    const renderLeftActions = () => (
      <TouchableOpacity 
        className="bg-green-500 w-20 h-[3.9rem] rounded-lg justify-center items-center"
        onPress={() => handleCompleteTask(item.id)}
      >
        <Text className="text-white font-poppins-medium">Done</Text>
      </TouchableOpacity>
    );

    const handleSwipeLeft = async () => {
      await handleCompleteTask(item.id);
      if (swipeableRefs.current[item.id]) {
        swipeableRefs.current[item.id].close();
      }
    };

    const handleSwipeRight = async () => {
      await handleDeleteTask(item.id);
      if (swipeableRefs.current[item.id]) {
        swipeableRefs.current[item.id].close();
      }
    };

    return (
      <Swipeable
        ref={(ref) => (swipeableRefs.current[item.id] = ref)}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableRightOpen={handleSwipeRight}
        onSwipeableLeftOpen={handleSwipeLeft}
        friction={2}
        overshootFriction={8}
      >
        <TouchableOpacity
          className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
          onPress={() => {
            item.expanded = !item.expanded;
            setFilteredTasks([...filteredTasks]);
          }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              className={`w-6 h-6 rounded-sm border-2 ${
                item.priority === "low"
                  ? "border-green-500"
                  : item.priority === "medium"
                  ? "border-yellow-500"
                  : "border-red-500"
              }`}
              onPress={() => handleCompleteTask(item.id)}
            >
              {item.completed && (
                <View className="w-4 h-4 bg-green-500 m-0.5" />
              )}
            </TouchableOpacity>
            <Text
              className={`text-lg font-poppins-medium ml-4 flex-1 ${
                item.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
            >
              {item.title}
            </Text>
          </View>

          {item.expanded && (
            <View className="bg-gray-50 mt-4 p-4 rounded-lg">
              <Text className="text-gray-700 font-poppins-medium">{item.description}</Text>
              <View className="flex-row justify-between mt-4">
                <Text className="text-sm text-gray-500 font-poppins-medium">
                  Due: {new Date(item.dueDate.seconds * 1000).toLocaleDateString()}
                </Text>
                <Text
                  className={`text-sm font-poppins-medium ${
                    item.completed ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {item.completed ? "Completed" : "Incomplete"}
                </Text>
              </View>
              <TouchableOpacity
                className="mt-4 px-6 py-3 bg-[#806DFB] rounded-lg self-center"
                onPress={() => router.push(`/tasks/edit?id=${item.id}`)}
              >
                <Text className="text-white font-poppins-medium text-center">Edit Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-white">
        <StatusBar backgroundColor="#806DFB" barStyle="light-content" />
          
        <View className="bg-[#806DFB] px-4 pt-16 pb-8">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => console.log("Left button clicked")}>
              <Image source={require("../../assets/header/open-menu.png")} className="w-8 h-8" />
            </TouchableOpacity>
            <TextInput
              className="flex-1 ml-5 mr-2 h-12 bg-white rounded-full px-4 text-gray-700 font-poppins-medium"
              placeholder="Search tasks..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={() => console.log("Right button clicked")}>
              <Image source={require("../../assets/header/menu.png")} className="w-10 h-12" />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-3xl font-poppins-semibold text-center pt-8">My Tasks</Text>
          <Text className="text-white font-poppins-medium text-m pl-2 pt-4">
            {currentDate}
          </Text>
        </View>

        <View className="bg-[#806DFB]">
          <View className="flex-row justify-around py-4 bg-white shadow-md rounded-t-[2.5rem]">
            {['All', 'Today', 'Tomorrow', 'This Week'].map((filter) => (
              <View key={filter} className="items-center">
                <TouchableOpacity 
                  onPress={() => {
                    setFilterType(filter.toLowerCase());
                    setSelectedFilter(filter.toLowerCase());
                  }}
                >
                  <Text className={`text-m font-poppins-medium ${
                    selectedFilter === filter.toLowerCase() ? 'text-[#806DFB]' : 'text-gray-500'
                  }`}>
                    {filter}
                  </Text>
                </TouchableOpacity>
                {selectedFilter === filter.toLowerCase() && (
                  <View className="h-0.5 w-12 bg-[#806DFB] mt-2" />
                )}
              </View>
            ))}
          </View>

          <FlatList
            className="bg-white px-4"
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
            ListEmptyComponent={() => (
              <Text className="text-center font-poppins-medium text-gray-500 mt-16">
                No tasks to display
              </Text>
            )}
          />
        </View>
     
        <View className="absolute bottom-0 left-0 right-0 h-24 bg-white  flex-row items-center justify-around rounded-t-5xl p-4 shadow-lg"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 2, height: -2 },
          shadowOpacity: 2,
          shadowRadius: 10,
          elevation: 10, 
        }}
      >
        {/* Priority Filter Button */}
        <TouchableOpacity onPress={togglePriorityFilter} className="p-3 rounded-full">
          <Image
            source={require("../../assets/images/setting.png")}
            className="w-12 h-12"
          />
        </TouchableOpacity>
      
        {/* Add Task Button (Floating Effect) */}
        <TouchableOpacity
          className="w-16 h-16 bg-[#806DFB] rounded-full justify-center items-center shadow-lg"
          style={{
            shadowColor: "#806DFB",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8, // More elevation for floating effect
          }}
          onPress={() => router.push("/tasks/create")}
        >
          <Image 
            source={require("../../assets/images/add.png")} 
            className="w-8 h-8" 
          />
        </TouchableOpacity>
      
        {/* Calendar Button */}
        <TouchableOpacity onPress={() => setIsCalendarVisible(true)} className="p-3 rounded-full">
          <Image
            source={require("../../assets/images/google-calendar.png")}
            className="w-12 h-12"
          />
        </TouchableOpacity>
      </View>
      
      
      <Modal
      visible={isCalendarVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsCalendarVisible(false)}
    >
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-white mx-4 pb-4 rounded-2xl">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-poppins-semibold text-gray-800">Calendar</Text>
            <TouchableOpacity 
              onPress={() => setIsCalendarVisible(false)}
              className="p-2"
            >
              <Text className="text-[#806DFB] font-poppins-medium">Close</Text>
            </TouchableOpacity>
          </View>
          
          <Calendar
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              selectedDayBackgroundColor: '#806DFB',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#806DFB',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              arrowColor: '#806DFB',
              monthTextColor: '#2d4150',
              textMonthFontFamily: 'Poppins-Medium',
              textDayFontFamily: 'Poppins-Regular',
              textDayHeaderFontFamily: 'Poppins-Medium'
            }}
          />
        </View>
      </View>
    </Modal>
      </View>
    </GestureHandlerRootView>
  );
}