# Prompts de imagens do ÉLAN

Anexe [o banner](../Assets/banner.png), [o Dashboard](../Assets/Dashboard.png), [a tela de simulado](../Assets/Simulation.png) e, quando fizer sentido, [a Lumi](../frontend/src/assets/lumi.png) como referências. Copie o bloco visual e acrescente um dos cinco blocos de cena. Gere uma imagem por vez. Use a mesma composição, as mesmas cores e os mesmos pesos de tipografia na série.

## Bloco visual para todas as imagens

```text
Crie uma imagem horizontal 16:9 de portfólio técnico para ÉLAN. Use as imagens anexadas como referência de identidade. Fundo quase preto azulado #070710, cartões de vidro escuro #121222 com cantos arredondados, bordas finas translúcidas, halos discretos violeta #7C3AED e azul #3B82F6, lilás #A855F7 para destaque e contraste alto com texto branco. Iluminação suave, sombras profundas e respiro entre os elementos. Use tipografia sans-serif limpa, com hierarquia clara e textos grandes em português do Brasil. Preserve o acento em ÉLAN. Use ícones simples e conectores finos com setas claramente orientadas. Mostre só os rótulos pedidos, sem logotipos inventados ou textos pequenos ilegíveis. Priorize uma leitura clara em miniatura de README. Se não conseguir renderizar um rótulo com precisão, reserve um espaço limpo para inseri-lo depois.
```

## 1. Conheça o ÉLAN

```text
Título «ÉLAN». Subtítulo «Estudo de idiomas e preparação para IELTS e DELF/DALF». Mostre uma tela central de estudo inspirada no Dashboard anexado e quatro cartões discretos com os rótulos «Reading», «Listening», «Writing» e «Speaking». Abaixo, conecte uma sequência curta «Praticar → Revisar → Acompanhar progresso». Mostre o simulado, os flashcards e a Lumi por meio de ícones ou recortes reais dos anexos. A imagem deve deixar claro que o produto reúne prática e rotina de estudo. Use dados fictícios simples e não inclua notas oficiais, métricas de produto ou promessas de aprovação.
```

## 2. Como a aplicação funciona

```text
Título «Arquitetura do ÉLAN». Mostre «Navegador · React/Vite» na esquerda, «API · Node.js/Express» no centro e «MongoDB» na direita. Conecte navegador à API com «HTTPS + Firebase ID token nas rotas privadas». Acima, conecte o navegador a «Firebase Auth · Login Google», e a API a «Firebase Auth · Verificação do token». Abaixo do navegador, conecte «Armazenamento local · Histórico, notas e flashcards». A API acessa «MongoDB · Perfis, flashcards da API e catálogo». Conecte «AI Harness» à API e da API ao «Gemini» por uma seta de servidor para servidor. A chave privada fica somente na API. Evite setas do navegador para o banco ou Gemini. Use espaço entre os blocos e mantenha o agrupamento legível.
```

## 3. Por que a stack foi escolhida

```text
Título «Por que essas tecnologias?». Componha seis cartões em uma grade 3×2. Rótulos e funções: «React + Vite + Tailwind» / «UI modular e build estático»; «Node.js + Express» / «API única e controle de acesso»; «Firebase Auth» / «Login Google e identidade verificada»; «MongoDB» / «Perfis e conteúdo publicado»; «Gemini + AJV» / «Geração opcional com respostas validadas»; «Docker + Terraform» / «Ambiente reproduzível e infraestrutura versionada». Cada cartão deve explicar uma decisão técnica em uma linha. Reserve um traço visual comum entre cartões que pertencem ao navegador, backend e infraestrutura.
```

## 4. Como funciona a IA e a publicação

```text
Título «Da prática ao conteúdo publicado». Mostre «Aluno autenticado» e «Administrador» entrando em trilhas distintas. A trilha do aluno segue «Lumi ou correção → API → AI Harness → Gemini → resposta validada». A trilha do administrador segue «Prévia → validação → rascunho → revisão humana → publicação». Mostre dentro do harness três rótulos curtos «Prompt IELTS/DELF», «Limites de uso», «Validação JSON». Coloque o catálogo publicado ao final da trilha administrativa e destaque que a prática do aluno não publica conteúdo. Use um cadeado no backend para indicar que as credenciais ficam ali. O resultado é material de prática e feedback, sem selo de certificação oficial.
```

## 5. Como a hospedagem foi planejada

```text
Título «Deploy da demonstração». Represente como proposta «Cloudflare Pages · Frontend», «Render Free · API», «Atlas Free · Banco», «Firebase Auth · Login» e «Gemini Free Tier · Opcional». Legende o fluxo com «Frontend estático», «API em container» e «MongoDB com TLS». Use uma faixa inferior pequena para «Decisões: manter a aplicação modular, separar credenciais do navegador, publicar conteúdo após revisão». Acrescente em um painel separado «GCP · Arquitetura futura» com «Cloud Run», «Artifact Registry», «Secret Manager» e «Cloud Monitoring». Identifique o painel GCP como «Infraestrutura definida em código». Não desenhe as duas topologias como se estivessem implantadas ou como dependências da mesma instalação.
```
