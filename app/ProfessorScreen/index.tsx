import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const usuarioSalvo = await AsyncStorage.getItem('usuario');
        if (usuarioSalvo) {
          const usuario = JSON.parse(usuarioSalvo);
          console.log('Usuário carregado na Home:', usuario);
          setEmail(usuario.email); // verifica se o campo é mesmo `email`
        } else {
          console.log('Nenhum usuário encontrado no AsyncStorage.');
        }
      } catch (erro) {
        console.error('Erro ao carregar usuário:', erro);
      }
    };

    carregarUsuario();
  }, []);

  const handleCadastro = () => {
    router.push('/CadastroScreen');
  };

  const handleEditar = () => {
    router.push('/EditarScreen');
  };

  const handleHistory = () => {
    router.push('/HistoricoScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ImageBackground
        source={require('../../assets/images/TelaAzul.png')}
        style={styles.container}
        resizeMode="cover"
      >

        {/* Seta de voltar */}
        <TouchableOpacity style={[styles.backIcon, width > 768 && styles.backIconDesktop]} onPress={() => router.push('/(tabs)')}>
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

          <Image source={require('../../assets/images/Coin.png')} style={styles.coin} />

          <TouchableOpacity style={[styles.button, width > 768 && styles.buttonDesktop]} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar Aluno</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, width > 768 && styles.buttonDesktop]} onPress={handleEditar}>
            <Text style={styles.buttonText}>Editar Perguntas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, width > 768 && styles.buttonDesktop]} onPress={handleHistory}>
            <Text style={styles.buttonText}>Histórico</Text>
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
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayDesktop: {
    paddingHorizontal: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleDesktop: {
    fontSize: 40,
  },
  coin: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#d5241c',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 12,
    width: '70%',
    alignItems: 'center',
  },
  buttonDesktop: {
    width: 400,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
