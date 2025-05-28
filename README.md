
# Sistema de Gestão de Academias 🏋️

Sistema web para gestão administrativa e operacional de academias. Desenvolvido como projeto acadêmico na disciplina de Arquitetura de Software na UNIRV.

## 🚀 Funcionalidades

- Cadastro e gerenciamento de membros (CRUD)
- Cadastro e gerenciamento de profissionais (CRUD)
- Controle financeiro: registro de mensalidades, receita e inadimplência
- Gestão de frequência com gráficos por horário e dia da semana
- Calendário de eventos com agendamento e visualização
- Painel estatístico (dashboard) com indicadores e gráficos
- Configuração do sistema e gerenciamento de usuários
- Autenticação com diferentes níveis de acesso
- Layout responsivo para desktop, tablet e smartphone

## 🛠️ Tecnologias Utilizadas

### Front-end
- HTML
- CSS
- JavaScript
- Bootstrap

### Back-end
- Node.js
- Express.js

### Banco de Dados
- PostgreSQL (via Supabase ou local)

### Deploy
- Vercel (Front-end)
- Render ou ambiente local (Back-end)

## 📁 Estrutura do Projeto

```
academia-system/
├── public/               # Arquivos estáticos (HTML, CSS, JS)
├── controllers/          # Lógica de controle (MVC)
├── models/               # Modelos de dados
├── routes/               # Rotas da API Express
├── views/                # Páginas HTML e modais
├── utils/                # Funções auxiliares
├── services/             # Integração com Supabase ou banco local
├── app.js                # Arquivo principal do Express
└── config.js             # Configurações e variáveis de ambiente
```

## 🔐 Autenticação

- Utiliza JWT (JSON Web Token)
- Tokens armazenados em localStorage
- Rotas protegidas por verificação de token
- Perfis distintos: Administrador, Recepcionista, Instrutor

## ▶️ Como Executar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/seuusuario/academia-system.git
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente em um arquivo `.env`:

```env
DATABASE_URL=...
JWT_SECRET=...
```

4. Inicie o servidor:

```bash
node app.js
```

5. Acesse:  
[http://localhost:5000](http://localhost:5000)

## 📦 Deploy

- Front-end hospedado no Vercel.  
- Back-end executado localmente ou implantado no Render.

## 👨‍🎓 Projeto Acadêmico

Este projeto foi desenvolvido como parte da disciplina de **Arquitetura de Software**, do curso de **Engenharia de Software** da **UNIRV**.

## 📈 Melhorias Futuras

- Geração de relatórios financeiros em PDF  
- Notificações automáticas via e-mail  
- Integração com métodos de pagamento  
- Módulo de treinos personalizados  
- Suporte a múltiplas unidades de academias  

**Desenvolvido como um MVP funcional e didático.**  
Contribuições e feedbacks são bem-vindos!
