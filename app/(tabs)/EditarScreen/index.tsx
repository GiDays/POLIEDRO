import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, Image, ImageBackground, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function EditarPerguntaScreen() {
  const { width } = useWindowDimensions();

  const [pergunta, setPergunta] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [alternativaCorreta, setAlternativaCorreta] = useState('');
  const [dica, setDica] = useState('');
  const [serie, setSerie] = useState('');


  type LetraAlternativa = 'A' | 'B' | 'C' | 'D';
  const [alternativas, setAlternativas] = useState<Record<LetraAlternativa, string>>({
  A: '',
  B: '',
  C: '',
  D: '',
  });

  const handleSalvar = async () => {
  if (
    !serie ||
    !pergunta ||
    !alternativas.A ||
    !alternativas.B ||
    !alternativas.C ||
    !alternativas.D ||
    !dificuldade ||
    !alternativaCorreta ||
    !dica
  ) {
    alert('Preencha todos os campos!');
    return;
  }

  const alternativasArray = (['A', 'B', 'C', 'D'] as LetraAlternativa[]).map(
    (letra) => `${letra}) ${alternativas[letra]}`
  );

  const correta = `${alternativaCorreta}) ${alternativas[alternativaCorreta as LetraAlternativa]}`;

  const data = {
    nivel: dificuldade,
    pergunta,
    alternativas: alternativasArray,   
    correta: correta,
    dica: dica
  };

  // Rotas para salvar as perguntas em diferentes bancos conforme a série
  let url = '';

  if (serie === '1') {
    url = 'http://192.168.0.18:5000/perguntas';
  } else if (serie === '2') {
    url = 'http://192.168.0.18:5000/perguntas2';
  } else {
    url = 'http://192.168.0.18:5000/perguntas3';
  }

  try {
    await axios.post(url, data);
    alert('Pergunta salva com sucesso!');
    // Reiniciar após salvar
    setDificuldade('');
    setPergunta('');
    setAlternativas({
      A: '',
      B: '',
      C: '',
      D: ''
    });
    setAlternativaCorreta('');
    setDica('');
    setSerie('');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar a pergunta');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      
      <ImageBackground
        source={require('../../../assets/images/TelaAzul.png')}
        style={styles.container}
        resizeMode="cover"
      >
        
        <View style={[styles.overlay, width > 768 && styles.overlayDesktop]}>
          <Text style={styles.title}>ADICIONAR PERGUNTA:</Text>

          <Text style={styles.label}>Pergunta:</Text>
          <TextInput
            style={styles.input}
            value={pergunta}
            onChangeText={setPergunta}
            placeholder="Digite a pergunta"
            placeholderTextColor="#fff"
          />

          <Text style={styles.label}>Dica:</Text>
          <TextInput
            style={styles.input}
            value={dica}
            onChangeText={setDica}
            placeholder="Digite a dica"
            placeholderTextColor="#fff"
          />

        {(['A', 'B', 'C', 'D'] as LetraAlternativa[]).map((letra) => (
            <View key={letra} style={{width: '60%'}}>
                <Text style={styles.label}>Alternativa {letra}:</Text>
                <TextInput
                    style={styles.alternativaInput}
                    value={alternativas[letra]}
                    onChangeText={(text) =>
                        setAlternativas((prev) => ({ ...prev, [letra]: text }))
                    }
                    placeholder={`Digite a alternativa ${letra}`}
                    placeholderTextColor="#fff"
                />
            </View>
        ))}


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 10 }}>
          <View style={{ width: '30%' }}>
              <Text style={styles.label}>Dificuldade:</Text>
              <View style={styles.pickerContainer}>
                  <Picker
                  selectedValue={dificuldade}
                  onValueChange={(itemValue) => setDificuldade(itemValue)}
                  dropdownIconColor="white"
                  style={styles.picker}
                  >
                  <Picker.Item label="Selecione..." value="" />
                  <Picker.Item label="Fácil" value="facil" />
                  <Picker.Item label="Médio" value="medio" />
                  <Picker.Item label="Difícil" value="dificil" />
                  <Picker.Item label="Muito Difícil" value="muito_dificil" />
                  </Picker>
              </View>
          </View>
            
          <View style={{ width: '30%' }}>
            <Text style={styles.label}>Alternativa:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                selectedValue={alternativaCorreta}
                onValueChange={(itemValue) => setAlternativaCorreta(itemValue)}
                dropdownIconColor="white"
                style={styles.picker}
                >
                <Picker.Item label="Selecione..." value="" />
                <Picker.Item label="A" value="A" />
                <Picker.Item label="B" value="B" />
                <Picker.Item label="C" value="C" />
                <Picker.Item label="D" value="D" />
                </Picker>
            </View>
          </View>

          <View style={{ width: '30%' }}>
            <Text style={styles.label}>Série:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                selectedValue={serie}
                onValueChange={(itemValue) => setSerie(itemValue)}
                dropdownIconColor="white"
                style={styles.picker}
                >
                <Picker.Item label="Selecione..." value="" />
                <Picker.Item label="1ª Série" value="1" />
                <Picker.Item label="2ª Série" value="2" />
                <Picker.Item label="3ª Série" value="3" />
                </Picker>
            </View>
          </View>
        </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
            <Text style={styles.saveButtonText}>Salvar</Text>
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
  overlay: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayDesktop: {
    paddingHorizontal: 350,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  input: {
    backgroundColor: '#48BFC1',
    width: '100%',
    padding: 12,
    borderRadius: 25,
    marginVertical: 5,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  alternativaInput: {
    backgroundColor: '#48BFC1',
    padding: 12,
    borderRadius: 25,
    marginVertical: 5,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: '#48BFC1',
    width: '100%',
    borderRadius: 25,
    marginVertical: 2,
    overflow: 'hidden',
  },
  picker: {
    color: 'black',
    height: 35,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#D5241C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
