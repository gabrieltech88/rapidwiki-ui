import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "../Procedure/Procedure.module.css";

const DOCUMENTATION_STANDARD = `
## 1. Título

O título deve deixar claro, de forma rápida, o que o documento apresenta.

### 1.1. Procedimentos

Para procedimentos, prefira títulos que indiquem diretamente a ação executada.

Estrutura recomendada:

**Ação + objeto + contexto**

Exemplos:

- Configurar uma VLAN em uma OLT Huawei
- Autorizar uma ONU em uma OLT Huawei
- Criar um usuário na Wiki
- Restaurar o banco de dados da Wiki
- Publicar uma nova versão da API

Evite títulos genéricos, como:

- VLAN
- Configuração da OLT
- Usuários
- Banco de dados

Ao definir o título de um procedimento, pergunte:

> **O que este documento ensina a fazer?**

### 1.2. Documentações internas

Para documentações internas, o título deve representar claramente o assunto documentado.

Exemplos:

- Infraestrutura da Wiki
- Arquitetura da API
- Estrutura do banco de dados
- Ambientes de desenvolvimento e produção
- Topologia da rede óptica
- Repositórios e organização do código-fonte

Evite títulos muito genéricos, como:

- Wiki
- API
- Banco
- Rede
- Repositórios

Ao definir o título de uma documentação interna, pergunte:

> **Sobre o que é este documento?**

---

## 2. Resumo

Todo documento deve possuir um resumo curto e objetivo.

Esse resumo deve ser preenchido no campo **Descrição** do formulário de criação ou edição do procedimento/documentação. Ele serve para apresentar rapidamente o conteúdo antes de o usuário abrir o documento completo.

O resumo deve indicar:

- o que o documento contém;
- qual processo, sistema ou assunto é abordado;
- em quais situações o conteúdo é útil, quando isso for relevante.

Evite apenas repetir o título com outras palavras.

**Exemplo — Procedimento**

**Título:** Configurar uma VLAN em uma OLT Huawei

**Resumo:**

> Este procedimento apresenta o processo para criação e configuração de uma VLAN em uma OLT Huawei, incluindo a definição da VLAN, associação ao serviço e validação da configuração.

**Exemplo — Documentação interna**

**Título:** Infraestrutura da Wiki

**Resumo:**

> Este documento descreve a infraestrutura utilizada pela Wiki, incluindo aplicações, repositórios, tecnologias, banco de dados, ambientes e os principais relacionamentos entre seus componentes.

---

## 3. Corpo do documento

O conteúdo deve ser dividido em seções e subseções claras.

Não existe uma única estrutura obrigatória para todos os documentos. A organização deve acompanhar o objetivo do conteúdo.

Os documentos da Wiki podem ser divididos principalmente em dois tipos:

- **Procedimentos:** ensinam como executar uma atividade.
- **Documentações internas:** descrevem sistemas, arquiteturas, ambientes, estruturas ou conceitos internos.

A estrutura deve facilitar a leitura e permitir que uma pessoa encontre rapidamente a informação que procura.

---

## 4. Estrutura de um procedimento

Um procedimento deve acompanhar, sempre que possível, a ordem real de execução da atividade.

Uma estrutura recomendada é:

1. Execução
2. Validação
3. Problemas comuns, quando aplicável

Nem todo procedimento precisa obrigatoriamente possuir todas essas seções.


### 4.1. Execução

A execução deve ser organizada em etapas claras.

Quando a ordem das ações for importante, utilize uma lista numerada.

Exemplo:

1. Acesse a OLT.
2. Entre no modo de configuração.
3. Crie a VLAN.
4. Associe a VLAN ao serviço.
5. Salve a configuração.

Comandos devem aparecer em blocos de código:

\`\`\`bash
ssh USUARIO@IP_DA_OLT
\`\`\`

\`\`\`text
vlan ID_DA_VLAN smart
\`\`\`

### 4.2. Validação

Sempre que possível, informe como confirmar que o procedimento foi executado corretamente.

Exemplo:

\`\`\`text
display vlan
\`\`\`

Explique também qual resultado deve ser esperado.

### 4.3. Problemas comuns

Quando o procedimento possuir falhas recorrentes ou situações conhecidas, documente:

- o problema;
- a possível causa;
- o que verificar;
- a ação recomendada.

---


## 5. Títulos e subtítulos

Títulos e subtítulos devem ser utilizados para criar uma hierarquia clara, sem fragmentar excessivamente o documento. Este próprio documento segue essa organização: seções principais usam \`1.\`, \`2.\`, \`3.\` e subseções usam \`1.1.\`, \`1.2.\`, \`2.1.\` quando realmente necessárias.

A cor dos títulos e subtítulos deve permanecer na **cor padrão do texto**.

### 5.1. Numeração em procedimentos

Em procedimentos, as seções principais devem ser numeradas em sequência:

\`\`\`text
1. Execução
2. Validação
3. Problemas comuns
\`\`\`

Quando uma seção precisar ser dividida em partes menores, utilize subtítulos numerados de acordo com a seção principal:

\`\`\`text
1. Execução
1.1. Acessar o equipamento
1.2. Criar a VLAN
1.3. Associar o serviço

2. Validação
2.1. Consultar a VLAN
2.2. Confirmar o estado esperado
\`\`\`

A numeração deve representar a hierarquia do conteúdo:

\`\`\`text
1.
├── 1.1.
├── 1.2.
└── 1.3.

2.
├── 2.1.
└── 2.2.
\`\`\`

### 5.2. Evite excesso de títulos

Não crie um título ou subtítulo para qualquer informação.

Um novo título deve ser criado apenas quando houver uma mudança clara de assunto ou quando um conjunto de informações realmente precisar ser agrupado em uma seção própria.

Para informações menores, prefira:

- parágrafos;
- listas;
- etapas numeradas;
- texto em negrito;
- blocos de código;
- observações.

Evite estruturas excessivamente fragmentadas, como:

\`\`\`text
2. Execução
2.1. Acesso
2.1.1. Usuário
2.1.2. Senha
2.1.3. IP
2.2. Configuração
2.2.1. Comando
2.2.2. Resultado
\`\`\`

quando essas informações poderiam ser apresentadas de forma mais simples dentro de \`2.1. Acesso\` e \`2.2. Configuração\`.

O objetivo da hierarquia é **facilitar a leitura**, e não criar o maior número possível de seções.

---


## 6. Listas

Use listas não ordenadas quando os itens não dependerem de uma sequência.

Exemplo:

- ASP.NET Core
- React
- MySQL
- Docker

Use listas numeradas quando a ordem das ações for importante.

Exemplo:

1. Acesse o servidor.
2. Pare a aplicação.
3. Atualize os arquivos.
4. Inicie a aplicação.
5. Valide o funcionamento.

---

## 7. Comandos e código

Comandos, consultas, configurações e trechos de código devem ser apresentados em blocos de código.

Exemplo:

\`\`\`bash
dotnet ef database update
\`\`\`

Quando possível, informe a linguagem do bloco para melhorar a leitura.

### 7.1. Informações sensíveis

Nunca publique no conteúdo da Wiki:

- senhas;
- tokens;
- chaves privadas;
- secrets;
- credenciais;
- dados de autenticação sensíveis.

Utilize valores genéricos ou placeholders.

Exemplo:

\`\`\`bash
ssh USUARIO@IP_DO_SERVIDOR
\`\`\`

Em vez de:

\`\`\`bash
ssh admin@192.168.0.10
\`\`\`

quando o endereço ou usuário real não precisar fazer parte da documentação.


### 7.2. Caminhos de sistema e navegação

Caminhos de arquivos, diretórios e rotas de navegação devem ser apresentados como código, e não como citação.

Quando o caminho aparecer dentro de uma frase, utilize código inline.

Exemplos:

- O front-end está localizado em \`src/components\`.
- Os arquivos da API estão em \`/opt/rapidwiki/backend\`.
- No Windows, o projeto pode estar em \`C:\\RapidWiki\\Api\`.

Quando o caminho precisar aparecer isolado ou for muito longo, utilize um bloco de código:

\`\`\`text
/opt/rapidwiki/backend/src/RapidWiki.Api
\`\`\`

Para representar caminhos de navegação dentro de uma interface, utilize o mesmo padrão:

\`Admin > Usuários > Novo usuário\`

Citações devem ser reservadas para observações, trechos explicativos ou informações que precisem de destaque textual.

---

## 8. Imagens e diagramas

Utilize imagens quando elas ajudarem a demonstrar:

- interfaces;
- configurações;
- telas do sistema;
- equipamentos;
- estados visuais importantes.

Utilize diagramas quando precisar representar:

- arquiteturas;
- fluxos;
- relacionamentos;
- topologias;
- processos;
- comunicação entre componentes.

Imagens e diagramas devem complementar o conteúdo escrito.

Evite depender exclusivamente de uma imagem para transmitir uma informação importante.

---

## 9. Destaques importantes

Destaques devem ser utilizados quando uma informação exigir atenção especial.

Exemplos de situações que justificam destaque:

- comportamento inesperado;
- risco;
- impacto relevante;
- limitação;
- ação que exige atenção;
- resultado esperado;
- informação técnica importante.

Evite destacar grandes partes do documento. Quando tudo recebe destaque, nada realmente se destaca.

---

## 10. Uso de cores

As cores devem ser utilizadas de forma **semântica**, e não apenas estética. O objetivo é permitir que o leitor identifique rapidamente o tipo de informação apresentada.

- **Padrão:** conteúdo normal, títulos, subtítulos e textos sem necessidade de destaque.
- **Cinza:** informações secundárias ou complementares, como observações auxiliares, referências e detalhes opcionais.
- **Vermelho:** erros, riscos graves, ações proibidas ou situações que podem causar impacto relevante.
- **Laranja:** atenção ou cautela quando uma ação exige cuidado, mas não representa necessariamente um erro ou risco crítico.
- **Amarelo:** observações importantes, lembretes ou informações que merecem atenção especial.
- **Verde:** resultado esperado, validação bem-sucedida, estado correto ou prática recomendada.
- **Azul:** informação técnica relevante, referência, conceito, comando ou dado que merece destaque sem representar alerta, erro ou sucesso.
- **Roxo:** exceções, particularidades de ambiente ou informações especiais que não se encaixem nas categorias anteriores.

Exemplos:

> **Vermelho:** Não reinicie a OLT durante o processo de atualização.

> **Verde:** A ONU deve aparecer com status **Online** após a autorização.

A mesma cor deve manter o mesmo significado em toda a Wiki. O uso excessivo de cores deve ser evitado; a maior parte do documento deve permanecer na cor padrão.
`;

export function DocumentationStandard() {
    return (
        <article className={styles.page}>
            <nav
                className={styles.breadcrumb}
                aria-label="Navegação estrutural"
            >
                <Link to="/">
                    Início
                </Link>

                <ChevronRight size={16} />

                <span>
                    Padrão de Documentação
                </span>
            </nav>

            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>
                        Padrão de Documentação
                    </h1>

                    <p className={styles.description}>
                        Referência para criação e organização dos
                        procedimentos e documentações internas da Wiki.
                    </p>
                </div>
            </header>

            <div className={styles.divider} />

            <div className={styles.markdown}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                >
                    {DOCUMENTATION_STANDARD}
                </ReactMarkdown>
            </div>
        </article>
    );
}
