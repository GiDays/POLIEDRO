import React from 'react';
import {TouchableOpacity, ImageBackground,View,Text,StyleSheet,useWindowDimensions,ScrollView,Image,} from 'react-native';
import { useRouter } from 'expo-router';

export default function QuizScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Dados simulados
  const question = "Qual é a capital do Brasil?";
  const alternatives = [
    "A) Rio de Janeiro",
    "B) São Paulo",
    "C) Brasília",
    "D) Salvador"
  ];
  const currentPrize = "R$ 100.000";

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ImageBackground
        source={require('../../../assets/images/TelaAzul.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={[styles.overlay, width > 768 && styles.overlayDesktop]}>
          
          {/* Cabeçalho */}
          <View style={styles.titleRow}>
            <Image source={require('../../../assets/images/Coin.png')} style={styles.coin} />
            <Text style={[styles.title, width > 768 && styles.titleDesktop]}>
              POLIEDRO{"\n"}DO MILHÃO
            </Text>
          </View>

          {/* Pergunta */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>

            <View style={styles.alternativesContainer}>
              {alternatives.map((alt, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.alternativeButton,
                    width > 768 && styles.alternativeButtonDesktop,
                  ]}
                >
                  <Text style={styles.alternativeText}>{alt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.prizeText}>VALENDO {currentPrize}</Text>

            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlText}>Pular</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlText}>-2 Alternativas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlText}>Parar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlText}>Dica</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayDesktop: {
    paddingHorizontal: 80,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 0,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
  },
  titleDesktop: {
    fontSize: 28,
  },
  questionContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  alternativesContainer: {
    width: '100%',
    maxWidth: 600,
  },
  alternativeButton: {
    backgroundColor: '#5bbcc0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
  },
  alternativeButtonDesktop: {
    padding: 20,
  },
  alternativeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  prizeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  controlButton: {
    backgroundColor: '#d5241c',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    margin: 5,
  },
  controlText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
