import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Series = '1' | '2' | '3';

const SERIES_GAME_SCREENS: Record<Series, string> = {
  '1': '../../../(tabs)/Jogo1Screen/',
  '2': '../../../(tabs)/Jogo2Screen/',
  '3': '../../../(tabs)/Jogo3Screen/',
} as const;

export default function SerieScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const handleSelectSerie = (serie: Series) => {
    router.navigate({
      pathname: `/${SERIES_GAME_SCREENS[serie]}` as never,
      params: { serie },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ImageBackground
        source={require('../../../assets/images/TelaAzul.png')}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Seta de voltar */}
        <TouchableOpacity style={[styles.backIcon, width > 768 && styles.backIconDesktop]} onPress={() => router.push('/(tabs)/HomeScreen')}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* Ícone de som */}
        <TouchableOpacity style={[styles.soundIcon, width > 768 && styles.soundIconDesktop]}>
          <Ionicons name="volume-high" size={30} color="white" />
        </TouchableOpacity>

        <View style={[styles.overlay, width > 768 && styles.overlayDesktop]}>
          <Text style={[styles.title, width > 768 && styles.titleDesktop]}>
            POLIEDRO{"\n"}DO MILHÃO
          </Text>

          <Image source={require('../../../assets/images/Coin.png')} style={styles.coin} />

          {/* <Image source={require('../../../assets/images/Cortina1.png')} style={styles.Image} /> */}

          <Text style={[styles.subtitle, width > 768 && styles.subtitleDesktop]}>
            SELECIONE SUA SÉRIE:
          </Text>

          <TouchableOpacity style={[styles.button, width > 768 && styles.buttonDesktop]} onPress={() => handleSelectSerie('1')}>
            <Text style={styles.buttonText}>1ª Série</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, width > 768 && styles.buttonDesktop]} onPress={() => handleSelectSerie('2')}>
            <Text style={styles.buttonText}>2ª Série</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, width > 768 && styles.buttonDesktop]} onPress={() => handleSelectSerie('3')}>
            <Text style={styles.buttonText}>3ª Série</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayDesktop: {
    paddingHorizontal: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitleDesktop: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#d5241c',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 20,
    width: '60%',
    alignItems: 'center',
  },
  buttonDesktop: {
    width: 400,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  coin: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  // Image: {
  //   position: 'absolute',
  //   top: 0,
  //   transform: [{ translateY: -40 }],
  //   width: '100%',
  //   height: undefined,
  //   aspectRatio: 3 / 2,
  //   resizeMode: 'cover',
  //   zIndex: -1,
  // },
  soundIcon: {
    position: 'absolute',
    top: 40,
    right: 30,
    zIndex: 5,
  },
  soundIconDesktop: {
    position: 'absolute',
    top: 40,
    right: 40,
    zIndex: 5,
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 5,
  },
  backIconDesktop: {
    position: 'absolute',
    top: 40,
    right: 40,
    zIndex: 5,
  },
});
