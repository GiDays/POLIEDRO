Funcionalidade: Login de usuário

Cenário: Login de aluno com dados válidos
Dado que estou na página de login
Quando preencho o e-mail "joana\@aluno" e a senha "senha123"
E clico em "Entrar"
Então o sistema exibe "Login realizado com sucesso"

Cenário: Login de professor com dados válidos
Dado que estou na página de login
Quando preencho o e-mail "carlos\@professor" e a senha "prof456"
E clico em "Entrar"
Então o sistema exibe "Login realizado com sucesso"

Cenário: E-mail inválido
Quando preencho o e-mail "[usuario@gmail.com](mailto:usuario@gmail.com)" e a senha "qualquer123"
E clico em "Entrar"
Então o sistema exibe "Use um e-mail com @aluno ou @professor para fazer login"

Cenário: Campos vazios
Quando clico em "Entrar" sem preencher os campos
Então o sistema exibe "Preencha todos os campos obrigatórios

