import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function App() {
  // navegação entre telas:
  const router = useRouter();
  // responsividade
  const { width } = useWindowDimensions();
  // cadastro
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setSenha('');
    }, [])
  );

  // função de login 
  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const resposta = await axios.post('http://192.168.0.18:5000/login', {
        email,
        senha
      });

      console.log('Login bem-sucedido:', resposta.data);

      const { usuario } = resposta.data; // pega os dados do usuário
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

      const teste = await AsyncStorage.getItem('usuario');
      console.log('Verificando o que foi salvo no AsyncStorage:', teste);

      alert(`Bem-vindo, ${usuario.nome}!`);
      //alert('Login realizado com sucesso!');

      if (email.includes('@sistemapoliedro.com.br')) {
        router.push('../../ProfessorScreen/');
      } else if (email.includes('@p4ed.com')) {
        router.push('../../HomeScreen/');
      } else {
        router.push('../../HomeScreen/');
      }
    
    } catch (erro) {
      const err = erro as any;
      console.error('Erro no login:', err.response?.data || err.message);
      alert(err.response?.data?.mensagem || 'Erro ao tentar logar!');
    }
  };

  const handleIrParaCadastro = () => {
      router.push('../../CadastroScreen/'); 
  };
  
  //Música
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    try {
      if (sound && isPlaying) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('../../assets/sound/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3')
        );
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();

        // Quando terminar, resetar o estado
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          if (status.didJustFinish) {
            setIsPlaying(false);
            setSound(null);
          }
        });
      }
    } catch (error) {
      console.log('Erro ao alternar o som:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      {/* imagem de fundo */}
      <ImageBackground
        source={require('../../assets/images/TelaAzul.png')} 
        style={styles.container}
        resizeMode="cover"
      > 
        <TouchableOpacity
          style={[styles.soundIcon, width > 768 && styles.soundIconDesktop]}
          onPress={playSound}
        >
          <Ionicons name="volume-high" size={30} color="white" />
        </TouchableOpacity>

        {/* largura maior que 768 ativa um estilo para 'desktop' */}
        <View style={[styles.overlay, width > 768 && styles.overlayDesktop]}>
          
          <Text style={[styles.title, width > 768 && styles.titleDesktop]}>POLIEDRO{"\n"}DO MILHÃO</Text>
          <Image source={require('../../assets/images/Coin.png')} style={styles.coin} />  

          <TextInput
            style={[styles.input, width > 768 ? styles.inputDesktop : null]}
            placeholder="Email:"
            placeholderTextColor="#fff"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={[styles.input, width > 768 ? styles.inputDesktop : null]}
            placeholder="Senha:"
            placeholderTextColor="#fff"
            secureTextEntry 
            onChangeText={setSenha}
            value={senha}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          
          <View style={styles.row}>
            <Text style={styles.text}>Ainda não tem conta?</Text>
            <TouchableOpacity style={styles.button1} onPress={handleIrParaCadastro}>
              <Text style={styles.buttonText1}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // imagem de fundo 
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // garante que o conteúdo cresça para ocupar o espaço inteiro da tela
  scroll: {
    flexGrow: 1,
  },
  // sobre o fundo azul, centralizando todos os elementos no centro
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  },
  // para telas grandes
  overlayDesktop: {
    paddingHorizontal: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 10,
  },
  // para telas grandes
  titleDesktop: {
    fontSize: 40,
  },
  coin: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#d5241c',
    width: '70%',
    padding: 12,
    borderRadius: 25,
    marginVertical: 8,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  //para telas grandes
  inputDesktop: {
    width: 400,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#7b1113',
    fontWeight: 'bold',
  },
  button1: {
    //backgroundColor: 'white',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 20,
    marginTop: 2,
  },
  buttonText1: {
    color: '#999',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  text: {
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5, 
  },
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
});