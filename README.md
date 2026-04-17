# INVISIO — Renda Invisível IA

> Plataforma SaaS gamificada de aprendizado e execução focada em geração de renda com Inteligência Artificial — sem aparecer, sem experiência prévia, do zero.

---

## O que é

INVISIO é um ambiente gamificado onde o aluno não apenas aprende sobre IA e marketing de afiliados — ele **executa dentro da plataforma**. Cada ação gera XP real, desbloqueia mundos e avança o aluno em direção à primeira comissão como afiliado no Instagram.

O diferencial central é a combinação de três elementos que normalmente existem separados: **método prático**, **gamificação real** (tipo Duolingo, não superficial) e **anonimato total** — o aluno nunca precisa aparecer na câmera.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | Tailwind CSS + shadcn/ui |
| Animações | Framer Motion |
| Backend / Auth / DB | Supabase (PostgreSQL + RLS + Realtime) |
| Pagamentos | Stripe (Subscriptions + Webhooks) |
| Email | Resend + React Email |
| Deploy | Vercel |
| Analytics | PostHog + Sentry |

---

## Estrutura de pastas

```
invisio/
├── app/
│   ├── (auth)/              # Login, cadastro, onboarding
│   ├── (platform)/          # Área de membros protegida
│   │   ├── dashboard/
│   │   ├── world/[slug]/
│   │   │   └── lesson/[id]/
│   │   ├── prompt-lab/
│   │   ├── missions/
│   │   ├── inventory/
│   │   └── settings/
│   ├── (marketing)/         # Landing page pública
│   └── api/
│       ├── webhooks/stripe/
│       ├── progress/
│       └── xp/
├── components/
│   ├── platform/            # Navbar, Sidebar, WorldCard, Shado...
│   └── ui/                  # shadcn/ui customizado
├── lib/
│   ├── supabase/            # Client, server, middleware
│   ├── stripe/              # Config + webhook handlers
│   └── gamification.ts      # Motor de XP, levels, streak
├── supabase/
│   ├── migrations/          # SQL versionado
│   └── seed.sql
└── emails/                  # Templates React Email
```

---

## Banco de dados

Schema PostgreSQL completo com Row Level Security. Tabelas principais:

- `profiles` — espelho de `auth.users` com XP, level, streak
- `worlds` — os 10 mundos do curso
- `lessons` — aulas com conteúdo em JSONB
- `user_progress` — progresso por mundo e por aula
- `xp_log` — log auditável de cada ganho de XP
- `missions` — missões diárias, semanais e únicas
- `subscriptions` — sync com Stripe

A função SQL `add_xp()` calcula level up atomicamente e garante consistência sem race conditions.

---

## Gamificação

| Elemento | Funcionamento |
|---|---|
| XP | Ganho por ação: aula concluída (+50), checklist (+15), missão diária (+75), mundo completo (+200) |
| Levels | 10 níveis: Iniciante → Explorador → Executor → Estrategista → Operador → Especialista → Escalador → Autoridade → Mestre → Lendário |
| Streak | Cron diário verifica acesso. Marcos em 3, 7, 14 e 30 dias dão XP bônus |
| Missões | Diárias, semanais e únicas. Reset automático por `reset_hours` |
| Shado | Mascote com mensagens contextuais por progresso |

---

## Planos

| Plano | Preço | Acesso |
|---|---|---|
| Starter | R$ 67/mês | Mundos 0–4 |
| Pro | R$ 97/mês | Todos os 10 mundos + suporte |
| Lifetime | R$ 497 único | Tudo + sessão de mentoria + badge fundador |

Trial de 7 dias sem cartão de crédito no plano Pro.

---

## Configuração local

**Pré-requisitos:** Node.js 18+, conta Supabase, conta Stripe

```bash
# 1. Clonar e instalar
git clone https://github.com/seu-usuario/invisio.git
cd invisio
npm install

# 2. Variáveis de ambiente
cp .env.example .env.local
# Preencher com suas keys (ver seção abaixo)

# 3. Banco de dados
npx supabase init
npx supabase db push          # Aplica migrations
npx supabase db seed          # Popula mundos e aulas

# 4. Rodar localmente
npm run dev
```

Acesse `http://localhost:3000`.

---

## Variáveis de ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_LIFETIME_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://invisio.app
```

> `SUPABASE_SERVICE_ROLE_KEY` é usado apenas no servidor (webhooks Stripe). Nunca expor no cliente.

---

## Deploy

O projeto usa deploy contínuo via Vercel. Cada push na branch `main` gera deploy em produção. Pull requests geram preview URLs automáticas.

```bash
npm i -g vercel
vercel --prod
```

Configurar o webhook do Stripe apontando para `https://seu-dominio.com/api/webhooks/stripe`.

---

## Identidade visual

- **Paleta:** `#0F172A` fundo · `#8B5CF6` roxo primário · `#10B981` verde · `#F59E0B` laranja · `#F9FAFB` texto
- **Tipografia:** Poppins (800/700/500/400) + Geist Mono para código
- **Símbolo:** I-Eye — combinação da letra I com um olho estilizado, representando invisibilidade e visão estratégica
- **Modo:** Dark mode exclusivo

---

## Roadmap

- [x] Schema do banco + gamificação
- [x] Landing page de vendas
- [x] Protótipo da plataforma (HTML)
- [ ] Migração para Next.js + componentes React
- [ ] Integração Stripe completa
- [ ] Onboarding interativo
- [ ] App mobile (React Native / Expo)
- [ ] Dashboard admin
- [ ] Programa de afiliados da própria plataforma

---

## Licença

Proprietário. Todos os direitos reservados © 2025 INVISIO.
