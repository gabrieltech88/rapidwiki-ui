import { ChevronRight } from "lucide-react";

import { Link } from "react-router";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "../Procedure/Procedure.module.css";


const DOCUMENTATION_STANDARD = `
# 1. Título

O título deve permitir que uma pessoa identifique rapidamente **sobre o que é o documento** ou **qual atividade ele ensina a realizar**.

A forma de escrever o título depende do tipo de conteúdo.

## Procedimentos

Quando o documento ensina a executar uma atividade, prefira títulos que representem claramente a ação que será realizada.

Uma estrutura recomendada é:

**Ação + objeto + contexto**

### Exemplos

**Recomendado**

- Configurar uma VLAN em uma OLT Huawei
- Autorizar uma ONU em uma OLT Huawei
- Criar um usuário na Wiki
- Restaurar o banco de dados da Wiki
- Publicar uma nova versão da API

**Evite**

- VLAN
- Configuração da OLT
- Usuários
- Banco de dados

O título de um procedimento deve responder:

> **O que este documento ensina a fazer?**

---

## Documentações internas

Nem todo conteúdo da Wiki representa uma ação.

Documentações internas podem existir para registrar arquiteturas, estruturas, conceitos, ambientes, equipamentos, sistemas ou outras informações importantes para a empresa.

Nesse caso, o título deve representar claramente **o assunto documentado**.

### Exemplos

**Recomendado**

- Infraestrutura da Wiki
- Arquitetura da API
- Estrutura do banco de dados
- Ambientes de desenvolvimento e produção
- Topologia da rede óptica
- Repositórios e organização do código-fonte

**Evite**

- Wiki
- API
- Banco
- Rede
- Repositórios

O título de uma documentação interna deve responder:

> **Sobre o que é este documento?**

---

# 2. Resumo

O resumo deve apresentar rapidamente o conteúdo do documento.

Seu objetivo é permitir que uma pessoa descubra se encontrou a informação que procura **sem precisar ler todo o documento**.

Um bom resumo normalmente deve responder:

- o que o documento contém;
- qual assunto ou processo é abordado;
- para que ele pode ser utilizado, quando isso for relevante.

O resumo deve ser curto e direto.

---

## Exemplo de resumo de um procedimento

### Título

**Configurar uma VLAN em uma OLT Huawei**

### Resumo

> Este procedimento apresenta o processo para criação e configuração de uma VLAN em uma OLT Huawei, incluindo a definição da VLAN, associação ao serviço e validação da configuração.

---

## Exemplo de resumo de uma documentação interna

### Título

**Infraestrutura da Wiki**

### Resumo

> Este documento descreve a infraestrutura utilizada pela Wiki, incluindo aplicações, repositórios, tecnologias, banco de dados, ambientes e os principais relacionamentos entre seus componentes.

---

## Evite

Resumos que apenas repetem o título:

> Documento sobre a infraestrutura da Wiki.

Ou:

> Aqui veremos como configurar uma VLAN.

O resumo deve acrescentar contexto suficiente para que o leitor compreenda **o que encontrará no documento**.

---

# 3. Corpo do documento

O corpo contém as informações principais do procedimento ou da documentação.

Ele deve ser dividido em **seções e subseções claras**, evitando grandes blocos de texto com assuntos diferentes misturados.

Não existe uma única estrutura obrigatória para todos os conteúdos da Wiki.

A organização deve acompanhar o objetivo do documento.

Existem, porém, duas estruturas principais:

- procedimentos;
- documentações internas.

---

# 4. Estrutura de um procedimento

Um procedimento deve ser organizado principalmente seguindo **a ordem em que a atividade é executada**.

Uma estrutura recomendada é:

1. contexto ou objetivo;
2. pré-requisitos;
3. execução;
4. validação;
5. problemas conhecidos, quando aplicável.

Nem todas essas seções precisam existir em todos os procedimentos. Utilize apenas aquelas que agregarem informação ao documento.

---

## Objetivo ou contexto

Quando necessário, explique o resultado esperado ou o motivo da execução do procedimento.

### Exemplo

> Este procedimento tem como objetivo configurar uma nova VLAN na OLT e disponibilizá-la para utilização pelos serviços correspondentes.

Se o resumo já fornecer contexto suficiente, não é necessário repetir a mesma informação apenas para criar uma seção de objetivo.

---

## Pré-requisitos

Informe o que a pessoa precisa possuir, saber ou verificar antes de iniciar o procedimento.

### Exemplo

Antes de iniciar, certifique-se de possuir:

- acesso administrativo à OLT;
- endereço IP da OLT;
- identificação da VLAN que será criada;
- informação sobre qual serviço utilizará a VLAN.

Não assuma que informações essenciais já são conhecidas pelo leitor.

---

## Execução

Divida o procedimento em etapas seguindo a ordem real da atividade.

### 1. Acessar a OLT

Explique a ação que deve ser realizada e forneça as informações necessárias para executá-la.

Quando houver comandos, apresente-os em um bloco próprio:

\`\`\`bash
ssh USUARIO@IP_DA_OLT
\`\`\`

### 2. Criar a VLAN

Explique a próxima ação.

\`\`\`text
vlan ID_DA_VLAN smart
\`\`\`

### 3. Configurar o serviço

Continue seguindo a sequência real da atividade.

Evite colocar várias ações diferentes dentro da mesma etapa quando elas puderem ser separadas.

---

## Validação

Sempre que for relevante, explique como confirmar que o procedimento foi concluído corretamente.

### Exemplo

Após criar a VLAN, consulte as VLANs configuradas:

\`\`\`text
display vlan
\`\`\`

Confirme que a VLAN criada aparece na listagem com os parâmetros esperados.

Um procedimento não deve explicar apenas **como executar** uma ação quando também for importante saber **como confirmar que ela funcionou**.

---

## Problemas comuns

Quando um procedimento possuir erros ou situações recorrentes, documente-os próximo das etapas relacionadas ou em uma seção própria.

### Exemplo

#### A VLAN já existe

Explique:

- como identificar a situação;
- por que ela ocorre;
- o que deve ser verificado;
- qual ação deve ser tomada.

Evite apenas informar que um erro pode acontecer sem explicar como lidar com ele.

---

# 5. Estrutura de uma documentação interna

Uma documentação interna normalmente não representa uma sequência de ações.

Nesse caso, organize o conteúdo **do geral para o específico** e divida o assunto em partes que façam sentido para quem estiver consultando a informação.

Considere, por exemplo, uma documentação chamada:

**Infraestrutura da Wiki**

Ela poderia ser organizada da seguinte maneira.

---

## Visão geral

Apresente primeiro uma visão geral do que está sendo documentado.

Explique os principais componentes e como eles se relacionam antes de entrar nos detalhes de cada um.

---

## Aplicações

Separe os diferentes componentes da solução.

### Front-end

Descreva informações relevantes como:

- responsabilidade;
- tecnologia utilizada;
- localização;
- comunicação com outros componentes.

### API

Explique o papel da API, as principais tecnologias utilizadas e sua relação com outros componentes.

---

## Repositórios

Liste os repositórios relacionados ao projeto e explique a responsabilidade de cada um.

Evite apenas fornecer links ou nomes sem indicar o que existe em cada repositório.

---

## Stack tecnológica

Apresente as principais tecnologias utilizadas.

Por exemplo:

- React;
- TypeScript;
- ASP.NET Core;
- Entity Framework Core;
- MySQL.

Quando for relevante para a compreensão da arquitetura, explique também **qual papel cada tecnologia desempenha**.

---

## Banco de dados

Documente as informações necessárias para compreender o banco utilizado pela aplicação.

Dependendo do contexto, podem ser relevantes:

- tecnologia utilizada;
- ambiente onde está hospedado;
- principais entidades;
- relacionamentos;
- forma como a aplicação acessa os dados.

Quando um diagrama explicar melhor uma relação, prefira utilizá-lo em conjunto com a explicação.

---

## Ambientes

Quando existirem diferentes ambientes, documente-os separadamente.

### Desenvolvimento

Explique como funciona o ambiente utilizado durante o desenvolvimento.

### Produção

Explique como a aplicação está disponibilizada em produção e quais componentes fazem parte desse ambiente.

---

## Relacionamento entre componentes

Quando vários componentes fizerem parte da solução, mostre como eles se relacionam.

Um exemplo simples:

\`\`\`text
Usuário
   ↓
Front-end
   ↓
API
   ↓
Banco de dados
\`\`\`

O objetivo é permitir que uma pessoa que não participou da implementação consiga compreender a estrutura existente.

---

# 6. Títulos e subtítulos

Utilize títulos e subtítulos para dividir assuntos.

Uma estrutura bem organizada facilita tanto a leitura completa quanto a consulta rápida.

### Exemplo

\`\`\`text
Banco de dados

    Entidades

        Procedure

        Department

    Relacionamentos

    Migrations
\`\`\`

Cada seção deve representar um assunto específico.

Evite criar seções excessivamente grandes contendo vários temas diferentes.

---

# 7. Parágrafos

Utilize parágrafos para explicar conceitos, decisões, comportamentos e contextos.

Prefira parágrafos menores, cada um concentrado em uma ideia principal.

Evite grandes blocos de texto quando a informação puder ser organizada de maneira mais clara com:

- subtítulos;
- listas;
- etapas;
- tabelas;
- blocos de código;
- imagens;
- diagramas.

---

# 8. Listas

Utilize listas quando estiver apresentando um conjunto de informações relacionadas que não precisam seguir uma sequência.

### Exemplo

A aplicação utiliza:

- React no front-end;
- ASP.NET Core na API;
- MySQL como banco de dados.

Quando a ordem de execução for importante, prefira uma lista numerada ou divida o procedimento em etapas.

---

# 9. Comandos e código

Comandos, consultas, configurações e trechos de código devem ser destacados utilizando blocos de código.

### Recomendado

\`\`\`bash
dotnet ef database update
\`\`\`

Comandos pequenos também podem aparecer dentro de uma explicação quando fizer sentido.

Nunca publique no documento:

- senhas;
- tokens;
- chaves privadas;
- secrets;
- outras credenciais sensíveis.

Utilize valores representativos quando necessário.

### Exemplo

\`\`\`text
ssh USUARIO@IP_DO_SERVIDOR
\`\`\`

---

# 10. Imagens e diagramas

Utilize imagens quando elas ajudarem a identificar uma opção, configuração, equipamento ou comportamento visual.

Utilize diagramas quando eles facilitarem a compreensão de:

- arquiteturas;
- fluxos;
- relacionamentos;
- topologias;
- processos.

Imagens e diagramas devem complementar a documentação, e não substituir completamente a explicação textual.

Sempre deixe claro o que o leitor deve observar.

---

# 11. Destaques importantes

Quando uma informação exigir atenção especial, destaque-a no conteúdo.

Use esse recurso principalmente para:

- comportamentos inesperados;
- riscos;
- impactos;
- limitações;
- ações que precisam de atenção adicional.

Evite destacar informações comuns em excesso, pois isso reduz a importância dos avisos realmente relevantes.

---

# 12. Antes de publicar

Antes de publicar ou atualizar um conteúdo, verifique:

- O título identifica claramente o assunto ou a ação?
- O resumo explica o que será encontrado no documento?
- As informações estão divididas em seções coerentes?
- O conteúdo segue uma ordem fácil de compreender?
- Os comandos e códigos estão destacados corretamente?
- Uma pessoa que não escreveu o documento conseguiria entendê-lo?
- Existem informações importantes que estão sendo assumidas, mas não foram documentadas?
- O conteúdo permite identificar o resultado esperado quando isso for necessário?

O objetivo não é fazer todos os documentos seguirem exatamente a mesma estrutura.

O objetivo é manter um padrão de **clareza, organização e facilidade de consulta** em toda a Wiki.
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