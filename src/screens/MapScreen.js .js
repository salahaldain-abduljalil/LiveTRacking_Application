import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
  Button,
} from "react-native";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { savePath, loadPath } from "../services/trackStorage";
import {
  connectSocket,
  sendPoint,
  disconnectSocket,
} from "../services/websocket";
import { useIsFocused } from "@react-navigation/native";

const REQUEST_LOCATION_PERMISSION = async () => {
  if (Platform.OS === "ios") {
    return true;
  }
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message:
          "This app needs access to your location to track your movement.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const MapScreen = () => {
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const watchIdRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    let canceled = false;
    const init = async () => {
      const saved = await loadPath();
      if (!canceled) {
        setPath(saved);
        setLoading(false);
      }
    };
    init();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    const token = null;
    const socket = connectSocket("https://your-backend.example.com", token);
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (isFocused && tracking) {
      // placeholder for re-activation if needed
    }
  }, [isFocused, tracking]);

  const handleLocationUpdate = (coords) => {
    const { latitude, longitude, altitude, accuracy } = coords;
    const point = {
      latitude,
      longitude,
      altitude: altitude ?? null,
      accuracy: accuracy ?? null,
      timestamp: Date.now(),
    };
    setPath((p) => {
      const next = [...p, point];
      if (next.length % 5 === 0) {
        savePath(next);
      }
      sendPoint(point);
      return next;
    });
  };

  const startTracking = async () => {
    const hasPerm = await REQUEST_LOCATION_PERMISSION();
    if (!hasPerm) {
      Alert.alert(
        "إذن المكان غير مُمنوح",
        "من فضلك امنح التطبيق أذونات الوصول للمكان."
      );
      return;
    }
    setTracking(true);
    watchIdRef.current = Geolocation.watchPosition(
      (pos) => {
        handleLocationUpdate(pos.coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 2000,
      }
    );
  };

  const stopTracking = () => {
    if (watchIdRef.current != null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTracking(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        followsUserLocation={false}
        initialRegion={{
          latitude: path.length > 0 ? path[path.length - 1].latitude : 0,
          longitude: path.length > 0 ? path[path.length - 1].longitude : 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {path.length > 0 && (
          <Polyline coordinates={path} strokeWidth={3} strokeColor="#1E90FF" />
        )}
        {path.length > 0 && <Marker coordinate={path[path.length - 1]} />}
      </MapView>

      <View style={styles.controls}>
        {!tracking ? (
          <Button title="Start Tracking" onPress={startTracking} />
        ) : (
          <Button title="Stop Tracking" onPress={stopTracking} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default MapScreen;
