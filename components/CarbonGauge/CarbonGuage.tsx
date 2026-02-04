// components/CarbonGauge.tsx
import { useGasStore } from '@/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

interface SpeedGaugeProps {
  value: number | undefined; // 0-100
  max?: number;
  label?: string;
  color?: string;
}

const CarbonGauge: React.FC<SpeedGaugeProps> = ({
  value = 0,
  max = 100,
}) => {

  const { gasData, fetchGasData } = useGasStore();
  // Ensure value is within bounds
  const percentage = Math.min(Math.max(value ?? 0, 0), max);
  const rotation = (percentage / max) * 180 - 90; // -90 to 90 degrees

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [color, setColor] = useState("green");

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    let id: number | null = null;

    const loadAndFetch = async () => {
      try {
        const ph = await AsyncStorage.getItem("phonenumber");
        const mac = await AsyncStorage.getItem("macAddress");
        if (!mounted) return;
        setPhoneNumber(ph);
        setMacAddress(mac);
        if (!ph || !mac) return;
        fetchGasData(ph, mac, controller.signal);
        id = setInterval(() => fetchGasData(ph, mac, controller.signal), 5000) as unknown as number;
      } catch (e) {
        // ignore
      }
    };

    loadAndFetch();

    return () => {
      mounted = false;
      if (id !== null) clearInterval(id as any);
      controller.abort();
    };
  }, [fetchGasData]);

  useEffect(() => {
    if (value < 30) {
      setColor("green");
    } else if (value >= 30) {
      setColor("#FACC15");
    } else if (value >= 50) {
      setColor("red");
    }
  }, [value]);


  return (
    <View style={styles.container}>
      {/* SVG Gauge */}
      <Svg width={180} height={128} viewBox="0 0 200 100">
        {/* Gray background arc */}
        <Path
          d="M 20 80 A 80 80 0 0 1 180 80"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={12}
          strokeLinecap="round"
        />

        {/* Colored progress arc */}
        <Path
          d="M 20 80 A 80 80 0 0 1 180 80"
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * percentage) / max}
        />

        {/* Center Circle */}
        <Circle cx={100} cy={80} r={4} fill="#1f2937" />

        {/* Needle */}
        <G transform={`rotate(${rotation} 100 80)`}>
          <Path
            d="M 100 80 L 100 15"
            stroke="#1f2937"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <Circle cx={100} cy={12} r={4} fill={color} />
        </G>
      </Svg>

      {/* Value Display */}
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{Math.round(percentage)} PPM</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 256,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  valueContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
  }
  // label: {
  //   fontSize: 12,
  //   color: '#6b7280',
  //   textTransform: 'uppercase',
  //   marginTop: 4,
  // },
});

export default CarbonGauge;