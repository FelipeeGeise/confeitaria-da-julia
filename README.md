# Confeitaria da Júlia — site em Next.js

## Como rodar
1. Instale o Node.js 18+.
2. `npm install`
3. Copie `.env.local.example` para `.env.local` e troque usuário/senha.
4. `npm run dev` → http://localhost:3000
5. Produção: `npm run build && npm start`

## Personalizar
- Telefone, redes, endereço e frases: `lib/config.js`
- Foto da confeiteira (capa): coloque em `public/confeiteira.jpg`
- Painel: http://localhost:3000/admin

## Onde ficam os dados
- Bolos e mensagens: `data/db.json`; fotos enviadas: `data/uploads/`.
- Precisa de hospedagem com disco persistente (VPS, Railway, Render com disco).
  Na Vercel o disco é temporário: aí o ideal é trocar por banco (Supabase/Postgres) e armazenamento de imagens (Cloudinary/S3).
