const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// 🔐 Variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

// 🔗 Cria a conexão com o Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    //  Autentica o usuário no Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      return res.status(401).json({ mensagem: 'Email ou senha incorretos.', error: error.message });
    }

    // 🟩 Gera token JWT local (opcional, se quiser usar junto com o Supabase)
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
    return res.status(500).json({ mensagem: 'Erro interno no servidor.', error: err.message });
  }
};

module.exports = {
  login
};
