import type { Procedure } from "@/types/Procedure";

export const proceduresMock: Procedure[] = [
    {
        id: "1",
        title: "Configuração de ONU",
        description:
            "Procedimento para cadastro, configuração e ativação de novas ONUs na rede.",

        departmentId: "1",
        departmentName: "Redes",

        writerName: "Gabriel",
        lastUpdate: "Há 2 horas",

        content: `
# Objetivo

Este procedimento descreve o processo de configuração de uma nova ONU.

## Pré-requisitos

Antes de iniciar, certifique-se de possuir:

- Acesso à OLT
- Credenciais administrativas
- Número da porta PON
- Serial da ONU

## Configuração

Entre na OLT e acesse o modo privilegiado:

\`\`\`bash
enable
\`\`\`

Em seguida, localize a ONU:

\`\`\`text
display ont autofind all
\`\`\`

## Atenção

Verifique sempre se a ONU está conectada à porta correta antes de realizar a configuração.
`,
    },

    {
        id: "2",
        title: "Diagnóstico de sinal óptico",
        description:
            "Orientações para identificar problemas de potência, atenuação e perda de sinal.",

        departmentId: "1",
        departmentName: "Redes",

        writerName: "Gabriel",
        lastUpdate: "Ontem",

        content: `
# Diagnóstico de sinal óptico

Este procedimento explica como analisar o sinal óptico de uma ONU.

## Valores

| Situação | Sinal |
| --- | --- |
| Bom | -15 dBm |
| Atenção | -25 dBm |
| Crítico | -30 dBm |

## Verificação

- Verifique conectores
- Verifique fusões
- Verifique splitters
`,
    },

    {
        id: "3",
        title: "Configuração de roteador",
        description:
            "Configurações padrão utilizadas na preparação de novos roteadores.",

        departmentId: "2",
        departmentName: "Suporte",

        writerName: "Gabriel",
        lastUpdate: "Há 3 dias",

        content: `
# Configuração de roteador

Procedimento padrão para configuração de roteadores.
`,
    },
];