import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {TextInput,TouchableOpacity,ImageBackground,Image,View,Text,StyleSheet,useWindowDimensions,ScrollView,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroUsuario() {
  const { width } = Dimensions.get('window');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleFinalizarCadastro = () => {
    //Alert.alert('Cadastro finalizado!');
    router.push('../(tabs)/HomeScreen');
  };


  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ImageBackground
        source={require('../../../assets/images/TelaAzul.png')}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Seta de voltar */}
        <TouchableOpacity style={[styles.backIcon, width > 768 && styles.backIconDesktop]} onPress={() => router.push('../(tabs)')}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        
        {/* Ícone de som */}
        <TouchableOpacity style={[styles.soundIcon, width > 768 && styles.soundIconDesktop]}>
          <Ionicons name="volume-high" size={30} color="white" />
        </TouchableOpacity>

        <View style={[styles.overlay, width > 768 && styles.overlayDesktop]}>

          <Text style={[styles.title, width > 768 && styles.titleDesktop]}>POLIEDRO{"\n"}DO MILHÃO</Text>
          <Image source={require('../../../assets/images/Coin.png')} style={styles.coin} />
          
          <Text style={[styles.subtitle, width > 768 && styles.subtitleDesktop]}>CADASTRO USUÁRIO</Text>

          <TextInput
            style={[styles.input, width > 768 && styles.inputDesktop]}
            placeholder="Email"
            placeholderTextColor="#fff"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={[styles.input, width > 768 && styles.inputDesktop]}
            placeholder="Nome"
            placeholderTextColor="#fff"
            onChangeText={setNome}
            value={nome}
          />
          <TextInput
            style={[styles.input, width > 768 && styles.inputDesktop]}
            placeholder="Senha"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={setSenha}
            value={senha}
          />

          <TouchableOpacity style={styles.button} onPress={handleFinalizarCadastro}>
            <Text style={styles.buttonText}>Finalizar Cadastro</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scroll: {
    flexGrow: 1,
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
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 10,
  },
  titleDesktop: {
    fontSize: 40,
  },
  subtitle: {
    fontSize: 20,
    //fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: 10,
  },
  subtitleDesktop: {
    fontSize: 20,
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
  inputDesktop: {
    width: 400,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#7b1113',
    fontWeight: 'bold',
  },
  coin: {
    width: 80,
    height: 80,
    marginBottom: 30,
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