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
    res.status(200).json({ 
      mensagem: 'Login bem-sucedido!', 
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      }
    });


  } catch (error) {
    res.status(500).json({ mensagem: 'Erro no servidor.', erro: error.message });
  }
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
const Pergunta2 = mongoose.model('Pergunta2', PerguntaSchema, 'questoes2');
const Pergunta3 = mongoose.model('Pergunta3', PerguntaSchema, 'questoes3');

// Rota GET /quiz (1 serie)
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

// Rota GET /quiz (2 serie)
app.get('/quiz2', async (req, res) => {
  try {
    const faceis = await Pergunta2.aggregate([{ $match: { nivel: 'facil' } }, { $sample: { size: 3 } }]);
    console.log('Faceis:', faceis);
    const medias = await Pergunta2.aggregate([{ $match: { nivel: 'medio' } }, { $sample: { size: 3 } }]);
    console.log('Medias:', medias);
    const dificeis = await Pergunta2.aggregate([{ $match: { nivel: 'dificil' } }, { $sample: { size: 3 } }]);
    console.log('Dificeis:', dificeis);
    const muitoDificil = await Pergunta2.aggregate([{ $match: { nivel: 'muito_dificil' } }, { $sample: { size: 1 } }]);
    console.log('Muito Dificil:', muitoDificil);
    
    const perguntas = [...faceis, ...medias, ...dificeis, ...muitoDificil];
    console.log('Perguntas totais:', perguntas.length);

    res.json(perguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota GET /quiz (3 serie)
app.get('/quiz3', async (req, res) => {
  try {
    const faceis = await Pergunta3.aggregate([{ $match: { nivel: 'facil' } }, { $sample: { size: 3 } }]);
    console.log('Faceis:', faceis);
    const medias = await Pergunta3.aggregate([{ $match: { nivel: 'medio' } }, { $sample: { size: 3 } }]);
    console.log('Medias:', medias);
    const dificeis = await Pergunta3.aggregate([{ $match: { nivel: 'dificil' } }, { $sample: { size: 3 } }]);
    console.log('Dificeis:', dificeis);
    const muitoDificil = await Pergunta3.aggregate([{ $match: { nivel: 'muito_dificil' } }, { $sample: { size: 1 } }]);
    console.log('Muito Dificil:', muitoDificil);
    
    const perguntas = [...faceis, ...medias, ...dificeis, ...muitoDificil];
    console.log('Perguntas totais:', perguntas.length);

    res.json(perguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Salvar nova pergunta
app.post('/perguntas', async (req, res) => {
  try {
    const novaPergunta = new Pergunta({
      pergunta: req.body.pergunta,
      alternativas: req.body.alternativas,
      correta: req.body.correta,
      nivel: req.body.nivel,
      dica: req.body.dica
    });

    const perguntaSalva = await novaPergunta.save();
    res.status(201).json(perguntaSalva);
  } catch (err) {
    console.error('Erro ao salvar pergunta:', err);
    res.status(500).json({ error: 'Erro ao salvar pergunta' });
  }
});

app.post('/perguntas2', async (req, res) => {
  try {
    const novaPergunta = new Pergunta2(req.body);
    const perguntaSalva = await novaPergunta.save();
    res.status(201).json(perguntaSalva);
  } catch (err) {
    console.error('Erro ao salvar pergunta da série 2:', err);
    res.status(500).json({ error: 'Erro ao salvar pergunta da série 2' });
  }
});

app.post('/perguntas3', async (req, res) => {
  try {
    const novaPergunta = new Pergunta3(req.body);
    const perguntaSalva = await novaPergunta.save();
    res.status(201).json(perguntaSalva);
  } catch (err) {
    console.error('Erro ao salvar pergunta da série 3:', err);
    res.status(500).json({ error: 'Erro ao salvar pergunta da série 3' });
  }
});

// Lógica do Histórico
const partidaSchema = new mongoose.Schema({
  email: { type: String, required: true },
  pontuacao: { type: Number, required: true },
  serie: { type: String, required: true },
  data: { type: Date, default: Date.now }
});
const Partida = mongoose.model('Partida', partidaSchema, 'tentativas');

app.post('/partidas', async (req, res) => {
  const { email, pontuacao,serie } = req.body;
  try {
    const novaPartida = new Partida({ email, pontuacao, serie });
    await novaPartida.save();
    res.status(201).json({ message: 'Partida salva com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar partida' });
  }
});

// get email alunos
app.get('/partidas', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'Email não informado' });

    const partidas = await Partida.find({ email }).sort({ data: -1 });
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico' });
  }
});

// Rota para professor ver todas as tentativas
app.get('/partidas-todas', async (req, res) => {
  try {
    const partidas = await Partida.find().sort({ data: -1 });
    res.json(partidas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar histórico geral' });
  }
});



// Servidor rodando (Rota de Teste)
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
