import React, { useEffect, useState } from 'react';
import {TouchableOpacity, ImageBackground,View,Text,StyleSheet,useWindowDimensions,ScrollView,Image, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface Pergunta {
  pergunta: string;
  alternativas: string[];
  correta: string;
  dificuldade: 'fácil' | 'médio' | 'difícil' | 'muito_dificil';
}

export default function QuizScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const premios = [
    1000,     // Pergunta 1 - fácil
    2000,     // Pergunta 2 - fácil
    3000,     // Pergunta 3 - fácil
    5000,     // Pergunta 4 - média
    10000,    // Pergunta 5 - média -> PATAMAR
    20000,    // Pergunta 6 - média
    50000,    // Pergunta 7 - difícil -> PATAMAR
    100000,   // Pergunta 8 - difícil
    300000,   // Pergunta 9 - difícil
    1000000   // Pergunta 10 - muito difícil
  ];

  useEffect(() => {
  axios.get('http://192.168.15.169:5000/quiz')
    .then(response => {
      if (Array.isArray(response.data) && response.data.length > 0) {
        setPerguntas(response.data);
      } else {
        console.error('Nenhuma pergunta recebida.');
      }
      setCarregando(false);
    })
    .catch(error => {
      console.error('Erro ao carregar perguntas:', error);
      setCarregando(false);
    });
}, []);


  function responder(letraSelecionada: string) {
  const perguntaAtual = perguntas[indicePergunta];

  // Pega só a letra maiúscula da resposta correta e da selecionada
  const correta = perguntaAtual.correta.charAt(0).toUpperCase();
  const selecionada = letraSelecionada.toUpperCase();

  if (correta === selecionada) {
    // Resposta correta: incrementa pontuação e vai pra próxima pergunta ou finaliza
    setPontuacao(prev => prev + 1);

    if (indicePergunta + 1 === perguntas.length) {
      setJogoFinalizado(true);
    } else {
      setIndicePergunta(prev => prev + 1);
    }

  } else {
    // Resposta errada: finaliza o jogo imediatamente
    setJogoFinalizado(true);
  }
  }


  const perguntaAtual = perguntas[indicePergunta];

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ color: '#FFF' }}>Carregando perguntas...</Text>
      </View>
    );
  }

  if (jogoFinalizado) {
    return (
      <View style={styles.centered}>
        <Text style={styles.prizeText}>Jogo finalizado!</Text>
        <Text style={styles.prizeText}>Sua pontuação: {pontuacao} / {perguntas.length}</Text>
        <TouchableOpacity style={styles.controlButton} onPress={() => router.push('../../(tabs)/HomeScreen')}>
          <Text style={styles.controlText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!perguntaAtual) {
  return (
    <View style={styles.centered}>
      <Text style={{ color: '#FFF' }}>Nenhuma pergunta disponível.</Text>
      <TouchableOpacity style={styles.controlButton} onPress={() => router.push('/')}>
        <Text style={styles.controlText}>Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
}

//const currentPrize = `R$ ${(indicePergunta + 1) * 1000}`;
const currentPrize = `R$ ${premios[indicePergunta]?.toLocaleString('pt-BR') || '0'}`;


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
            
            <Text style={styles.questionText}>{perguntaAtual.pergunta}</Text>

            <View style={styles.alternativesContainer}>
              {perguntaAtual.alternativas.map((alt, index) => {
                const letra = alt.charAt(0);
                return (
                
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.alternativeButton,
                      width > 768 && styles.alternativeButtonDesktop,
                    ]}
                    onPress={() => responder(letra)}
                  >
                    <Text style={styles.alternativeText}>{alt}</Text>

                  </TouchableOpacity>
              );
            })}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
