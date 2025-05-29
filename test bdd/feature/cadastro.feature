Funcionalidade: Cadastro de usuário

Cenário: Cadastro de aluno com dados válidos
  Dado que estou na página de cadastro
  Quando preencho o e-mail "joana@aluno" e a senha "senha123"
  E clico em "Cadastrar"
  Então o sistema exibe "Cadastro realizado com sucesso"
Cenário: Cadastro de professor com dados válidos
  Dado que estou na página de cadastro
  Quando preencho o e-mail "carlos@professor" e a senha "prof456"
  E clico em "Cadastrar"
  Então o sistema exibe "Cadastro realizado com sucesso"
Cenário: E-mail inválido
  Quando preencho o e-mail "usuario@gmail.com" e a senha "qualquer123"
  E clico em "Cadastrar"
  Então o sistema exibe "Use um e-mail com @aluno ou @professor para se cadastrar"
Cenário: Campos vazios
  Quando clico em "Cadastrar" sem preencher os campos
  Então o sistema exibe "Preencha todos os campos obrigatórios"