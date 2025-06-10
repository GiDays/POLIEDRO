import React, {useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground, useWindowDimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface Tentativa {
  _id: string;
  email: string;
  pontuacao: number;
  data: string;
  serie?: string;
}

export default function HistoricoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions(); // responsividade
  const isDesktop = width > 768;

  const [email, setEmail] = useState<string | null>(null);
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busca, setBusca] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState<string>('todos');
  const [alunos, setAlunos] = useState<string[]>([]);


  useFocusEffect(
    React.useCallback(() => {
      async function loadEmailAndData() {
        try {
          const usuarioSalvo = await AsyncStorage.getItem('usuario');
          if (usuarioSalvo) {
            const usuario = JSON.parse(usuarioSalvo);
            setEmail(usuario.email);

            let response;
            if (usuario.email.endsWith('@sistemapoliedro.com.br')) {
              // Professor: busca todas as tentativas
              response = await axios.get(`http://192.168.0.18:5000/partidas-todas`);
              setTentativas(response.data);
              const tentativasData: Tentativa[] = response.data;
              setTentativas(tentativasData);

              const alunosUnicos = [...new Set(tentativasData.map(t => t.email))];
              setAlunos(alunosUnicos);

            } else {
              // Aluno: busca apenas suas tentativas
              response = await axios.get(`http://192.168.0.18:5000/partidas?email=${usuario.email}`);
              setTentativas(response.data);
            }
            
          } else {
            setError('Usuário não encontrado no armazenamento.');
          }
        } catch (err: any) {
          setError('Erro ao carregar tentativas: ' + err.message);
        } finally {
          setLoading(false);
        }
      }

      loadEmailAndData();
    }, [])
  );

  const tentativasFiltradas = alunoSelecionado === 'todos'
    ? tentativas
    : tentativas.filter(t => t.email === alunoSelecionado);

  const alunosFiltrados = alunos.filter(aluno =>
    aluno.toLowerCase().includes(busca.toLowerCase())
  );
    
  return (
    <ImageBackground
      source={require('../../../assets/images/TelaVermelha.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Ícones superiores */}
      <TouchableOpacity style={[styles.backIcon, isDesktop && styles.backIconDesktop]} onPress={() => router.push('../../../(tabs)/HomeScreen/')}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.soundIcon, isDesktop && styles.soundIconDesktop]}>
        <Ionicons name="volume-high" size={30} color="white" />
      </TouchableOpacity>

      {/* Conteúdo principal com overlay */}
      <View style={[styles.overlay, isDesktop && styles.overlayDesktop]}>
        {/* Cabeçalho */}
        <View style={styles.titleRow}>
          <Image source={require('../../../assets/images/Coin.png')} style={styles.coin} />
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>POLIEDRO{"\n"}DO MILHÃO</Text>
        </View>

        {/* Título da tela */}
        <Text style={[styles.historyTitle, isDesktop && styles.historyTitleDesktop]}>HISTÓRICO</Text>

        {/* Bloco com tentativas */}
        <View style={[styles.historyBox, isDesktop && styles.historyBoxDesktop]}>
          
          {email?.endsWith('@sistemapoliedro.com.br') && (
            <View style={{ marginBottom: 10, width: '90%' }}>
              <Text style={{ color: 'white', textAlign: 'left', marginBottom: 4 }}>
                Selecione um aluno:
              </Text>

              {/* Campo de busca */}
              <TextInput
                placeholder="Digite o nome ou e-mail"
                placeholderTextColor="#888"
                value={busca}
                onChangeText={setBusca}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  fontSize: 15,
                  marginBottom: 8,
                }}
              />

              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  height: 30, 
                  justifyContent: 'center',
                }}
              >
                <Picker
                  selectedValue={alunoSelecionado}
                  onValueChange={(itemValue) => setAlunoSelecionado(itemValue)}
                  style={{
                    height: 30, 
                    fontSize: 15,
                  }}
                  dropdownIconColor="#790000" // se estiver no Android
                >
                  <Picker.Item label="Todos os alunos" value="todos" />
                  {alunosFiltrados.map(aluno => (
                    <Picker.Item key={aluno} label={aluno} value={aluno} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Tentativas */}
          <View style={[styles.attemptsBox, isDesktop && styles.attemptsBoxDesktop]}>
            
            <ScrollView>
              {tentativasFiltradas.length === 0 ? (
                <Text style={[styles.attemptText, isDesktop && styles.attemptTextDesktop]}>
                  Nenhuma tentativa encontrada.
                </Text>
              ) : (
                tentativasFiltradas.map((tentativa, index) => (
                  <View key={tentativa._id}>
                    {email?.endsWith('@sistemapoliedro.com.br') && (
                      <Text style={[styles.attemptText, isDesktop && styles.attemptTextDesktop]}>
                        Aluno: {tentativa.email}
                      </Text>
                    )}
                    <Text style={[styles.attemptText, isDesktop && styles.attemptTextDesktop]}>
                      Tentativa {index + 1}: R$ {tentativa.pontuacao.toLocaleString('pt-BR')}
                    </Text>
                    <Text style={[styles.attemptText, isDesktop && styles.attemptTextDesktop]}>
                      Data: {new Date(tentativa.data).toLocaleDateString('pt-BR')} {new Date(tentativa.data).toLocaleTimeString('pt-BR')}
                    </Text>
                    <Text style={[styles.attemptText, isDesktop && styles.attemptTextDesktop]}>
                      Série: {tentativa.serie || 'N/A'}
                    </Text>
                    <View style={styles.separator} />
                  </View>
                ))
              )}
            </ScrollView>

          </View>
          
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayDesktop: {
    paddingHorizontal: 80,
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backIconDesktop: {
    position: 'absolute',
    top: 40,
    right: 40,
    zIndex: 5,
  },
  soundIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  soundIconDesktop: {
    position: 'absolute',
    top: 40,
    right: 40,
    zIndex: 5,
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
    marginBottom: 100,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 100,
  },
   titleDesktop: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 100,
  },
  historyTitle: {
    fontSize: 20,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 5,
  },
  historyTitleDesktop: {
    fontSize: 25,
  },
  historyBox: {
    width: '70%',
    backgroundColor: '#790000',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 25,
  },
  historyBoxDesktop: {
    width: '60%',
    backgroundColor: '#790000',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
  },
  attemptsBox: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 15,
    maxHeight: 200,
  },
  attemptsBoxDesktop: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 10,
    padding: 15,
    maxHeight: 200,
  },
  attemptText: {
    fontSize: 16,
    marginVertical: 5,
  },
  attemptTextDesktop: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5,
  },
});
