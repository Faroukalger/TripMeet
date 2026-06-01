import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, Animated, StyleSheet } from 'react-native';

export default function RadarButton({ onPress, size = 36 }) {
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.8)).current;
  const opacity2 = useRef(new Animated.Value(0.6)).current;
  const opacity3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = (scale, opacity, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 2.5,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.8,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const anim1 = animate(pulse1, opacity1, 0);
    const anim2 = animate(pulse2, opacity2, 500);
    const anim3 = animate(pulse3, opacity3, 1000);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { width: size * 2, height: size * 2 }]}>
      {/* Cercles de pulsation */}
      <Animated.View style={[styles.pulse, {
        width: size, height: size, borderRadius: size/2,
        transform: [{ scale: pulse1 }],
        opacity: opacity1,
      }]} />
      <Animated.View style={[styles.pulse, {
        width: size, height: size, borderRadius: size/2,
        transform: [{ scale: pulse2 }],
        opacity: opacity2,
      }]} />
      <Animated.View style={[styles.pulse, {
        width: size, height: size, borderRadius: size/2,
        transform: [{ scale: pulse3 }],
        opacity: opacity3,
      }]} />

      {/* Bouton radar */}
      <View style={[styles.btn, { width: size, height: size, borderRadius: size/2 }]}>
        <Image
          source={require('../../assets/radar.png')}
          style={{ width: size * 0.7, height: size * 0.7 }}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    backgroundColor: 'rgba(42, 171, 220, 0.3)',
    borderWidth: 1.5,
    borderColor: 'rgba(42, 171, 220, 0.6)',
  },
  btn: {
    backgroundColor: 'rgba(13, 53, 71, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2AABDC',
    zIndex: 10,
  },
});