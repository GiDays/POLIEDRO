const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Modelo de usuário
const usuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

 // Rota de cadastro
app.post('/registro', async (req, res) => {
  console.log(req.body);
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'Email já cadastrado!' });
    }

    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado!' });
    }

    // Verifica a senha
    if (usuario.senha !== senha) {
      return res.status(400).json({ mensagem: 'Senha incorreta!' });
    }

    // Se deu certo
    res.status(200).json({ mensagem: 'Login bem-sucedido!' });

  } catch (error) {
    res.status(500).json({ mensagem: 'Erro no servidor.', erro: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor backend está rodando!');
});

// Modelo de Pergunta
const PerguntaSchema = new mongoose.Schema({
  nivel: String,
  pergunta: String,
  alternativas: [String],
  correta: String,
  dica: String
});
const Pergunta = mongoose.model('Pergunta', PerguntaSchema, 'questoes'); // nome da coleção

// Rota GET /quiz
app.get('/quiz', async (req, res) => {
  try {
    const faceis = await Pergunta.aggregate([{ $match: { nivel: 'facil' } }, { $sample: { size: 3 } }]);
    console.log('Faceis:', faceis);
    const medias = await Pergunta.aggregate([{ $match: { nivel: 'medio' } }, { $sample: { size: 3 } }]);
    console.log('Medias:', medias);
    const dificeis = await Pergunta.aggregate([{ $match: { nivel: 'dificil' } }, { $sample: { size: 3 } }]);
    console.log('Dificeis:', dificeis);
    const muitoDificil = await Pergunta.aggregate([{ $match: { nivel: 'muito_dificil' } }, { $sample: { size: 1 } }]);
    console.log('Muito Dificil:', muitoDificil);
    
    const perguntas = [...faceis, ...medias, ...dificeis, ...muitoDificil];
    console.log('Perguntas totais:', perguntas.length);

    res.json(perguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servidor rodando
app.get('/', (req, res) => {
  res.send('Servidor backend está rodando!');
});

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.error('Erro na conexão:', err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
