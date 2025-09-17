import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PATH = "LIVE_TRACK_PATH";

// Save path (array of points)
export const savePath = async (path) => {
  try {
    await AsyncStorage.setItem(KEY_PATH, JSON.stringify(path));
  } catch (e) {
    console.error("Error saving path", e);
  }
};

// Load path
export const loadPath = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY_PATH);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error loading path", e);
    return [];
  }
};

// Clear path
export const clearPath = async () => {
  try {
    await AsyncStorage.removeItem(KEY_PATH);
  } catch (e) {
    console.error("Error clearing path", e);
  }
};
