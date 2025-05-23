const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { networkInterfaces } = require("os");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

// app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "*", // ambiente de produção
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Função para conectar ao MongoDB
async function conectarAoMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MongoDB Atlas");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
  }
}

// Conexão com o MongoDB Atlas
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Conectado ao MongoDB Atlas"))
//   .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Modelo de usuário
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nome: { type: String },
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Rotas

app.post("/registro", async (req, res) => {
  console.log("Requisição de registro recebida:", req.body);
  //console.log("Headers:", req.headers);

  const { email, senha, nome } = req.body || {};

  // console.log("Email recebido:", email);
  // console.log("Senha recebida:", senha);
  // console.log("Nome recebido:", nome);

  if (!email || !senha) {
    console.log("Email ou senha ausentes");
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      console.log("Usuário já existe:", email);
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({ email, senha, nome });
    await novoUsuario.save();
    console.log("Usuário registrado com sucesso:", email);
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// Rota para conectar com o banco 
// app.listen(5000, () => {
//     try {
//         conectarAoMongoDB()
//         console.log("Conectado ao banco de dados")
//     }
//     catch (e) {
//         console.log("Erro de conexão")
//     }
// });

// Iniciar o servidor
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Servidor rodando na porta ${PORT}`);

//   // Mostra os IPs disponíveis para acesso
//   const { networkInterfaces } = require("os");
//   const nets = networkInterfaces();

//   console.log(`Acesso local: http://localhost:${PORT}`);
//   console.log("Endereços para acesso de dispositivos móveis:");

//   // Lista todos os IPs disponíveis
//   Object.keys(nets).forEach((name) => {
//     nets[name].forEach((net) => {
//       // Mostra apenas endereços IPv4 e não-internos
//       if (net.family === "IPv4" && !net.internal) {
//         console.log(`- http://${net.address}:${PORT} (${name})`);
//       }
//     });
//   });
// });

//Rota para login 
app.post("/login", async (req, res) => {

  console.log("Requisição de login recebida:", req.body);
  const { email, senha } = req.body;

  try {

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log(`Login falhou para email: ${email}`);
      return res.status(400).json({ error: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: "Credenciais inválidas" });
    }
    console.log(`Login bem-sucedido para email: ${email}`);
    res.status(200).json({
      message: "Login bem-sucedido",
      nome: usuario.nome, // Return the user's name
    });
  } catch (err) {
    console.error("Erro no processamento do login:", err);
    res.status(500).json({ error: "Erro ao fazer login" });
    }

});

// Iniciar o servidor
app.listen(PORT, "0.0.0.0", async () => {
  await conectarAoMongoDB();

  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesso local: http://localhost:${PORT}`);
  console.log("Endereços para acesso de dispositivos móveis:");

  const nets = networkInterfaces();

  Object.keys(nets).forEach((name) => {
    nets[name].forEach((net) => {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`- http://${net.address}:${PORT} (${name})`);
      }
    });
  });
});