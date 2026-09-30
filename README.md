# ONG Solidária

Site institucional desenvolvido para uma organização do terceiro setor, com o objetivo de apresentar sua atuação, projetos e informações de contato de forma acessível, responsiva e organizada.

## Sobre o projeto

A aplicação apresenta informações institucionais da ONG, seus projetos e um formulário de cadastro. O projeto foi desenvolvido ao longo das atividades práticas da disciplina, evoluindo desde a estruturação semântica até a implementação de interatividade, versionamento e acessibilidade.

## Funcionalidades

- Página institucional da ONG
- Apresentação dos projetos
- Formulário de cadastro com validação
- Persistência dos dados do formulário no navegador
- Navegação dinâmica entre páginas
- Menu responsivo
- Modal e notificações
- Interface responsiva
- Recursos de acessibilidade

## Tecnologias utilizadas

- HTML5 — estrutura semântica e acessível
- CSS3 — estilização, responsividade e layouts
- JavaScript — interatividade, validação e navegação
- Vite — ambiente de desenvolvimento e build
- Git — controle de versão
- GitHub — hospedagem do repositório e colaboração

## Estrutura do projeto

```text
ong/
├── html/
│   ├── index.html
│   ├── projetos.html
│   └── cadastro.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── imagens/
│   └── ong.jpg
└── README.md
Instalação e execução
Pré-requisitos
Node.js
npm
Instalação
npm install
Desenvolvimento
npm run dev

Após iniciar o servidor, acesse o endereço informado pelo Vite no terminal.

Build de produção

Para gerar a versão de produção:

npm run build

A build gerada pode ser utilizada para publicação da aplicação.

Versionamento

O projeto utiliza Git e GitHub para controle de versão, seguindo uma organização baseada em GitFlow.

main — versão estável
develop — integração do desenvolvimento
feature/* — desenvolvimento de funcionalidades específicas

As mensagens de commit seguem o padrão Conventional Commits.

Acessibilidade

O projeto utiliza HTML semântico, hierarquia adequada de títulos, labels em formulários, foco visível, navegação por teclado, textos alternativos e atenção aos requisitos de acessibilidade baseados na WCAG 2.1 AA.

Licença

Projeto desenvolvido para fins acadêmicos.


### 2. Salvar e conferir

No terminal:

```bash
git status