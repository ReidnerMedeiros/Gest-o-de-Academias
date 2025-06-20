const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Variáveis de ambiente (configure no seu .env)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

// Cria a conexão com o Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Login do usuário
 */
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Autentica o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      return res.status(401).json({
        mensagem: 'Email ou senha incorretos.',
        error: error.message
      });
    }

    // Gera token JWT (opcional)
    const token = jwt.sign(
      { email: data.user.email, userId: data.user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      mensagem: 'Login realizado com sucesso.'
    });

  } catch (err) {
    return res.status(500).json({
      mensagem: 'Erro interno no servidor.',
      error: err.message
    });
  }
};

/**
 * Registro do usuário
 */
const registrar = async (req, res) => {
  const { nome, email, senha, responsabilidade } = req.body;

  if (!nome || !email || !senha || !responsabilidade) {
    return res.status(400).json({
      mensagem: 'Todos os campos são obrigatórios.'
    });
  }

  if (!['Administrador', 'Recepcionista'].includes(responsabilidade)) {
    return res.status(400).json({
      mensagem: 'Responsabilidade inválida.'
    });
  }

  try {
    // Cria o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha
    });

    if (error) {
      return res.status(400).json({
        mensagem: 'Erro ao criar usuário no Supabase Auth.',
        error: error.message
      });
    }

    // Insere na tabela usuarios do banco
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        { nome, email, senha, responsabilidade }
      ]);

    if (dbError) {
      return res.status(400).json({
        mensagem: 'Erro ao inserir na tabela usuarios.',
        error: dbError.message
      });
    }

    return res.json({
      mensagem: 'Usuário registrado com sucesso.',
      userId: data.user.id
    });

  } catch (err) {
    return res.status(500).json({
      mensagem: 'Erro interno no servidor.',
      error: err.message
    });
  }
};

module.exports = {
  login,
  registrar
};
