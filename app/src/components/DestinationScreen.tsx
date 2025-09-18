import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Map: undefined;
  Destination: undefined;
  Settings: undefined;
};

type DestinationScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "Destination"
>;

type DestinationItem = {
  id: string;
  title: string;
  subtitle?: string;
  coords?: { latitude: number; longitude: number };
};

const mockDestinations: DestinationItem[] = [
  {
    id: "d1",
    title: "الرياض - مركز الملك عبدالعزيز",
    coords: { latitude: 24.7136, longitude: 46.6753 },
  },
  {
    id: "d2",
    title: "الرياض - حي الملك فهد",
    coords: { latitude: 24.774, longitude: 46.85 },
  },
  {
    id: "d3",
    title: "الرياض - الجامعة",
    coords: { latitude: 24.5, longitude: 46.7 },
  },
  { id: "d4", title: "الرياض - داون تاون" },
];

export default function DestinationScreen() {
  const navigation = useNavigation<DestinationScreenProp>();
  const [query, setQuery] = useState<string>("");

  const filtered = mockDestinations.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }: { item: DestinationItem }) => (
    <TouchableOpacity
      style={styles.destinationItem}
      onPress={() => {
        // في واجهات UX حقيقية، ستنتقل إلى شاشة الخريطة مع إرسال وجهة محددة.
        // هنا نُبرز الزر كأداة UI/UX بسيطة.
        navigation.goBack();
      }}
    >
      <View style={styles.dot} />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.coords && (
          <Text style={styles.itemSubtitle}>
            lat {item.coords.latitude.toFixed(4)} • lon{" "}
            {item.coords.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>اختر وجهتك</Text>
        <Text style={styles.headerSubtitle}>ابحث عن مكان وحدد الوجهة</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="ابحث عن موقع..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.footerButtonText}>العودة إلى الخريطة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButtonPrimary}
          onPress={() => {
            // افتراضي: الذهاب إلى الخريطة مع تمثيل وجهة افتراضية
            navigation.navigate("Map" as any);
          }}
        >
          <Text style={styles.footerButtonTextPrimary}>ابدأ المسار</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  destinationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4B5563",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  footerButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  footerButtonText: {
    color: "#1f2937",
    fontWeight: "600",
  },
  footerButtonPrimary: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  footerButtonTextPrimary: {
    color: "#fff",
    fontWeight: "700",
  },
});
