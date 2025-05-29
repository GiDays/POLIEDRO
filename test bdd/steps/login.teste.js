import cucumber from 'cucumber';

describe('Login de usuário', () => {
  it('Deve permitir login de aluno com e-mail e senha válidos', () => {
    const resultado = loginUsuario("ana@aluno", "senha123");
    assert.equal(resultado.mensagem, 'Login realizado com sucesso');
    assert.equal(resultado.sucesso, true);
  });

  it('Deve permitir login de professor com e-mail e senha válidos', () => {
    const resultado = loginUsuario("mario@professor", "senha789");
    assert.equal(resultado.mensagem, 'Login realizado com sucesso');
    assert.equal(resultado.sucesso, true);
  });

  it('Não deve permitir login com e-mail sem domínio aluno ou professor', () => {
    const resultado = loginUsuario("joao@gmail.com", "senha123");
    assert.equal(resultado.mensagem, 'Use um e-mail com @aluno ou @professor para fazer login');
    assert.equal(resultado.sucesso, false);
  });

  it('Não deve permitir login com campos vazios', () => {
    const resultado = loginUsuario("", "");
    assert.equal(resultado.mensagem, 'Preencha todos os campos obrigatórios');
    assert.equal(resultado.sucesso, false);
  });
});
