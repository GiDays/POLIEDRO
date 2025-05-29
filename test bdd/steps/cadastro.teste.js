import cucumber from 'cucumber';

describe('Cadastro de usuário', () => {
  it('Deve cadastrar aluno com e-mail e senha válidos', () => {
    const resultado = cadastrarUsuario("ana@aluno", "senha123");
    assert.equal(resultado.mensagem, 'Cadastro realizado com sucesso');
    assert.equal(resultado.sucesso, true);
  });
it('Deve cadastrar professor com e-mail e senha válidos', () => {
    const resultado = cadastrarUsuario("mario@professor", "senha789");
    assert.equal(resultado.mensagem, 'Cadastro realizado com sucesso');
    assert.equal(resultado.sucesso, true);
  });
it('Não deve permitir e-mail sem domínio aluno ou professor', () => {
    const resultado = cadastrarUsuario("joao@gmail.com", "senha123");
    assert.equal(resultado.mensagem, 'Use um e-mail com @aluno ou @professor para se cadastrar');
    assert.equal(resultado.sucesso, false);
  });
it('Não deve permitir campos vazios', () => {
    const resultado = cadastrarUsuario("", "");
    assert.equal(resultado.mensagem, 'Preencha todos os campos obrigatórios');
    assert.equal(resultado.sucesso, false);
  });
});