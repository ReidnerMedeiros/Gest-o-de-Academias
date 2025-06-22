const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Registrar novo usuário
 */
const registrar = async (req, res) => {
  const { nome, email, senha, responsabilidade } = req.body;

  if (!nome || !email || !senha || !responsabilidade) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (!['Administrador', 'Recepcionista'].includes(responsabilidade)) {
    return res.status(400).json({ mensagem: 'Responsabilidade inválida.' });
  }

  try {
    const { data: userExists } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (userExists) {
      return res.status(400).json({ mensagem: 'Usuário já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const { error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha: senhaHash, responsabilidade }]);

    if (error) {
      return res.status(500).json({ mensagem: 'Erro ao inserir usuário.', error: error.message });
    }

    return res.json({ mensagem: 'Usuário registrado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor.', error: err.message });
  }
};

/**
 * Login de usuário
 */
const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios.' });
  }

  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email, responsabilidade: usuario.responsabilidade },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        responsabilidade: usuario.responsabilidade
      },
      mensagem: 'Login realizado com sucesso.'
    });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor.', error: err.message });
  }
};

/**
 * Alterar senha do usuário
 */
const alterarSenha = async (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ mensagem: 'Email e nova senha são obrigatórios.' });
  }

  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ senha: senhaHash })
      .eq('id', usuario.id);

    if (updateError) {
      return res.status(500).json({ mensagem: 'Erro ao atualizar senha.', error: updateError.message });
    }

    return res.json({ mensagem: 'Senha atualizada com sucesso.' });
  } catch (err) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor.', error: err.message });
  }
};

module.exports = {
  registrar,
  login,
  alterarSenha
};
