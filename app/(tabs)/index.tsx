import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from '../src/providers/ReduxProvider';
import MapScreen from '../src/components/MapScreen';
import DestinationScreen from '../src/components/DestinationScreen';
import SettingsScreen from '../src/components/SettingsScreen';

const { width } = Dimensions.get("window");

const NajedApp = () => {
  const [currentStatus, setCurrentStatus] = useState("ready");
  const [destination, setDestination] = useState("");
  const [waitingTime, setWaitingTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let interval: number | null = null;

    if (currentStatus === "waiting" && waitingTime > 0) {
      interval = setInterval(() => {
        setWaitingTime((prev) => {
          if (prev <= 1) {
            setCurrentStatus("clear");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    if (interval) {
      return () => clearInterval(interval);
    }
  }, [currentStatus, waitingTime]);

  const handleStart = () => {
    if (!destination) {
      Alert.alert("يرجى تحديد الوجهة أولاً");
      return;
    }
    const isRoadBusy = Math.random() > 0.4;
    if (isRoadBusy) {
      setCurrentStatus("waiting");
      setWaitingTime(Math.floor(Math.random() * 360) + 120);
    } else {
      setCurrentStatus("clear");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
    setIsActive(true);
  };

  const resetApp = () => {
    setCurrentStatus("ready");
    setDestination("");
    setWaitingTime(0);
    setIsActive(false);
    setShowNotification(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const destinations = [
    "شمال الرياض - حي النرجس",
    "جنوب الرياض - حي الملقا",
    "شرق الرياض - حي الريان",
    "غرب الرياض - حي الشفا",
    "وسط الرياض - حي العليا",
    "طريق الملك فهد",
    "طريق خريص",
    "الدائري الشرقي",
    "الدائري الغربي",
  ];

  const getStatusColor = () => {
    switch (currentStatus) {
      case "clear":
        return "#34C759";
      case "waiting":
        return "#FF3B30";
      default:
        return "#C7C7CC";
    }
  };

  const getStatusText = () => {
    switch (currentStatus) {
      case "clear":
        return {
          title: "العبور متاح الآن!",
          desc: "يمكنك الانطلاق إلى الطريق الرئيسي",
        };
      case "waiting":
        return { title: "الطريق مزدحم", desc: "يرجى الانتظار لضمان عبور سلس" };
      default:
        return { title: "جاهز للانطلاق", desc: "حدد وجهتك وابدأ رحلتك" };
    }
  };

  const styles = StyleSheet.create({
    destinationContainer: {
      marginVertical: 20,
    },
    destinationLabel: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    destinationPicker: {
      width: "100%",
      height: 40,
    },

    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#dbe4e9ff",
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 18,
      color: "#666",
    },
    statusContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    statusCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    statusTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    statusDesc: {
      fontSize: 16,
      color: "#666",
    },
    actionButton: {
      backgroundColor: "#007AFF",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    resetButton: {
      backgroundColor: "#FF3B30",
      alignSelf: width > 700 ? "center" : "stretch",
    },
    actionButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    notification: {
      backgroundColor: "#dff0d8",
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
    },
    notificationText: {
      fontSize: 16,
      color: "#3e8e41",
    },
    waitingTime: {
      fontSize: 24,
      color: "white",
    },
  });

type RootStackParamList = {
  Map: undefined;
  Destination: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

return (
  <Provider store={store}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ناجد</Text>
        <Text style={styles.subtitle}>إدارة المرور الذكية</Text>
      </View>
      {showNotification && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>العبور متاح الآن!</Text>
        </View>
      )}
      <View style={styles.statusContainer}>
        <View style={[styles.statusCircle, { backgroundColor: getStatusColor() }]}>
          {currentStatus === "clear" && (
            <Ionicons name="checkmark" size={40} color="white" />
          )}
          {currentStatus === "waiting" && (
            <Text style={styles.waitingTime}>{formatTime(waitingTime)}</Text>
          )}
          {currentStatus === "ready" && (
            <Ionicons name="car" size={40} color="white" />
          )}
        </View>
        <Text style={styles.statusTitle}>{getStatusText().title}</Text>
        <Text style={styles.statusDesc}>{getStatusText().desc}</Text>
      </View>
      {!isActive && (
        <View style={styles.destinationContainer}>
          <Text style={styles.destinationLabel}>حدد الوجهة</Text>
          <Picker
            selectedValue={destination}
            style={styles.destinationPicker}
            onValueChange={(itemValue) => setDestination(itemValue)}
          >
            <Picker.Item label="اختر وجهتك..." value="" />
            {destinations.map((dest, idx) => (
              <Picker.Item key={idx} label={dest} value={dest} />
            ))}
          </Picker>
        </View>
      )}
      {!isActive ? (
        <TouchableOpacity style={styles.actionButton} onPress={handleStart}>
          <Text style={styles.actionButtonText}>بدء الرحلة</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={resetApp}
        >
          <Text style={styles.actionButtonText}>إنهاء الرحلة</Text>
        </TouchableOpacity>
      )}
    </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Destination" component={DestinationScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </Provider>
);

};

export default NajedApp;
