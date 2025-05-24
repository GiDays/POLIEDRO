import React, { useEffect, useState } from 'react';
import {TouchableOpacity, ImageBackground,View,Text,StyleSheet,useWindowDimensions,ScrollView,Image, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Estrutura da pergunta
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
  const [parou, setParou] = useState(false); // Parar o jogo 
  const [usosPular, setUsosPular] = useState(3); // Pular pergunta
  const [alternativasVisiveis, setAlternativasVisiveis] = useState<string[]>([]); // -2 alternativas
  const perguntaAtual = perguntas[indicePergunta];

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

  // -2 alternativas
  useEffect(() => {
  if (perguntaAtual) {
    setAlternativasVisiveis(perguntaAtual.alternativas);
  }
  }, [indicePergunta, perguntas]);

  // Conexão perguntas
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

  // Função de cálculo de patamar
  function calcularPatamar(indice: any) {
    if (indice >= 7) return premios[6]; // R$50.000
    if (indice >= 4) return premios[4]; // R$10.000
    return 0;
  }

  // Lógica do Jogo
  function responder(letraSelecionada: string) {
  const perguntaAtual = perguntas[indicePergunta];

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

  let premioFinal = 0;

  if (parou) {
    premioFinal = premios[indicePergunta - 1] || 0;
  } else if (jogoFinalizado) {
    if (pontuacao === perguntas.length) {
      // Acertou tudo!
      premioFinal = premios[premios.length - 1];
    } else {
      // Errou
      premioFinal = calcularPatamar(indicePergunta);
    }
  }

  if (jogoFinalizado) {
    return (
      <View style={styles.centered}>
        <Text style={styles.prizeText}>Jogo finalizado!</Text>
        <Text style={styles.prizeText}>
          {parou ? "Você parou e ganhou: " : "Você ganhou: "} R$ {premioFinal.toLocaleString('pt-BR')}
        </Text>
        <TouchableOpacity style={styles.controlButton} onPress={() => router.push('../../(tabs)/HomeScreen')}>
          <Text style={styles.controlText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }


  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={{ color: '#FFF' }}>Carregando perguntas...</Text>
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

// Função para parar o jogo
function pararJogo() {
  setParou(true);
  setJogoFinalizado(true);
}

// Função para Pular uma pergunta 
function pularPergunta() {
  if (usosPular > 0 && indicePergunta + 1 < perguntas.length) {
    setUsosPular(prev => prev - 1);
    setIndicePergunta(prev => prev + 1);
  } else {
    alert('Você não pode mais pular!');
  }
}

// Função para remover duas alternativas
function removerDuasAlternativas() {
  const incorretas = alternativasVisiveis.filter(
    alt => alt.charAt(0).toUpperCase() !== perguntaAtual.correta.charAt(0).toUpperCase()
  );

  const selecionadas = incorretas.sort(() => 0.5 - Math.random()).slice(0, 2);

  const novas = alternativasVisiveis.filter(
    alt => !selecionadas.includes(alt)
  );

  setAlternativasVisiveis(novas);
}


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
              {alternativasVisiveis.map((alt, index) => {
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
              
              <TouchableOpacity style={styles.controlButton} onPress={pularPergunta}>
                <Text style={styles.controlText}>Pular</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={removerDuasAlternativas}>
                <Text style={styles.controlText}>-2 Alternativas</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={pararJogo}>
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
