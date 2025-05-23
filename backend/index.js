// const express = require("express"); // para criar o servidor HTTP e definir rotas
// const mongoose = require("mongoose"); // para conectar e interagir com o MongoDB usando objetos JavaScript
// const cors = require("cors"); // permitir requisições de origens diferentes
// const bodyParser = require("body-parser"); // transforma o corpo das requisições em req.body
// //const bcrypt = require('bcrypt'); 
// //const { networkInterfaces } = require("os");
// //require("dotenv").config(); // carrega variáveis do arquivo .env

// const app = express();
// const PORT = process.env.PORT || 5000;
// //const path = require("path");

// app.use(
//   cors({
//     origin: "*", // ambiente de produção
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(bodyParser.json());


// // // Conexão com o MongoDB Atlas
// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => console.log("Conectado ao MongoDB Atlas"))
// //   .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// // // Modelo de usuário
// // const UsuarioSchema = new mongoose.Schema({
// //   email: { type: String, required: true, unique: true },
// //   senha: { type: String, required: true },
// //   nome: { type: String },
// // });

// // const Usuario = mongoose.model("usuarios", UsuarioSchema);

// // // Rotas de Cadastro
// // app.post("/registro", async (req, res) => {
// //   console.log("Requisição de registro recebida:", req.body);
// //   console.log("Headers:", req.headers);

// //   const { email, senha, nome } = req.body || {};

// //   console.log("Email recebido:", email);
// //   console.log("Senha recebida:", senha);
// //   console.log("Nome recebido:", nome);

// //   if (!email || !senha) {
// //     console.log("Email ou senha ausentes");
// //     return res.status(400).json({ error: "Email e senha são obrigatórios" });
// //   }

// //   try {
// //     const usuarioExistente = await Usuario.findOne({ email });
// //     if (usuarioExistente) {
// //       console.log("Usuário já existe:", email);
// //       return res.status(400).json({ error: "Usuário já existe" });
// //     }

// //     //const salt = await bcrypt.genSalt(10);
// //     //const senhaHash = await bcrypt.hash(senha, salt);

// //     const novoUsuario = new Usuario({ email, senha, nome });
// //     await novoUsuario.save();
// //     console.log("Usuário registrado com sucesso:", email);
// //     res.status(201).json({ message: "Usuário registrado com sucesso" });
// //   } catch (err) {
// //     console.error("Erro ao registrar usuário:", err);
// //     res.status(500).json({ error: "Erro ao registrar usuário" });
// //   }
// // });

// // Conexão com MongoDB
// const url = 'mongodb+srv://raissaduart2:Raissa71*@bdpoliedromilhao.psw6lp4.mongodb.net/';
// const dbName = 'test';

// MongoClient.connect(url, { useUnifiedTopology: true })
//   .then(client => {
//     console.log('Conectado ao MongoDB');
//     const db = client.db(dbName);
//     const usuariosCollection = db.collection('usuarios');

//     // Rota para receber dados do front
//     app.post('/usuarios', async (req, res) => {
//       const { nome, senha, email } = req.body;

//       if (!nome || !senha || !email) {
//         return res.status(400).send({ erro: 'Todos os campos são obrigatórios.' });
//       }

//       try {
//         const resultado = await usuariosCollection.insertOne({ nome, senha, email });
//         res.status(201).send({ mensagem: 'Usuário criado!', id: resultado.insertedId });
//       } catch (err) {
//         console.error('Erro ao inserir:', err);
//         res.status(500).send({ erro: 'Erro no servidor.' });
//       }
//     });
//       // Inicia o servidor
//     app.listen(port, () => {
//       console.log(`Servidor rodando em http://localhost:${port}`);
//     });
//   })
//   .catch(err => console.error('Erro de conexão:', err));


// //Rota para login 
// app.post("/login", async (req, res) => {

//   console.log("Requisição de login recebida:", req.body);
//   const { email, senha } = req.body;

//   try {

//     const usuario = await Usuario.findOne({ email });
//     if (!usuario) {
//       console.log(`Login falhou para email: ${email}`);
//       return res.status(400).json({ error: "Credenciais inválidas" });
//     }

//     const senhaValida = await bcrypt.compare(senha, usuario.senha);
//     if (!senhaValida) {
//       return res.status(400).json({ error: "Credenciais inválidas" });
//     }
//     console.log(`Login bem-sucedido para email: ${email}`);
//     res.status(200).json({
//       message: "Login bem-sucedido",
//       nome: usuario.nome, // Return the user's name
//     });
//   } catch (err) {
//     console.error("Erro no processamento do login:", err);
//     res.status(500).json({ error: "Erro ao fazer login" });
//     }

// });

// // // Iniciar o servidor
// // app.listen(PORT, "0.0.0.0", () => {
// //   console.log(`Servidor rodando na porta ${PORT}`);

// //   const { networkInterfaces } = require("os");
// //   const nets = networkInterfaces();

// //   console.log(`Acesso local: http://localhost:${PORT}`);
// //   console.log("Endereços para acesso de dispositivos móveis:");

// //   Object.keys(nets).forEach((name) => {
// //     nets[name].forEach((net) => {
// //       if (net.family === "IPv4" && !net.internal) {
// //         console.log(`- http://${net.address}:${PORT} (${name})`);
// //       }
// //     });
// //   });
// // });

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
  senha: { type: String, required: true }
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

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch(err => console.error('Erro na conexão:', err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
