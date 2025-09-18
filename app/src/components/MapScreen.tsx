import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';

type GridCell = {
  id: string;
  latitude: number;
  longitude: number;
  width: number;
  height: number;
  occupancy: number;
  capacity: number;
  color: string;
};

const sampleGrid: GridCell[] = Array.from({ length: 9 }).map((_, i) => ({
  id: `g-${i}`,
  latitude: 24.5 + (i % 3) * 0.01,
  longitude: 46.7 + Math.floor(i / 3) * 0.01,
  width: 0.01,
  height: 0.01,
  occupancy: Math.floor(Math.random() * 100),
  capacity: 100,
  color: 'green',
}));

export default function MapScreen({ navigation }: any) {
  const grid = sampleGrid;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 24.6,
          longitude: 46.75,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {grid.map((cell) => {
          let fillColor = '#2ECC71';
          if (cell.occupancy > cell.capacity * 0.8) fillColor = '#E74C3C';
          else if (cell.occupancy > cell.capacity * 0.5) fillColor = '#F1C40F';

          const coords = [
            { latitude: cell.latitude, longitude: cell.longitude },
            { latitude: cell.latitude, longitude: cell.longitude + cell.width },
            { latitude: cell.latitude + cell.height, longitude: cell.longitude + cell.width },
            { latitude: cell.latitude + cell.height, longitude: cell.longitude },
          ];

          return (
            <Polygon
              key={cell.id}
              coordinates={coords}
              strokeColor="#000000"
              fillColor={fillColor}
              strokeWidth={1}
              tappable
              onPress={() => {
                navigation.navigate('Destination', {
                  origin: {
                    latitude: cell.latitude,
                    longitude: cell.longitude,
                  },
                });
              }}
            />
          );
        })}
      </MapView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Destination')}
        >
          <Text style={styles.buttonText}>Destination</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonTextSecondary}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
  },
});
