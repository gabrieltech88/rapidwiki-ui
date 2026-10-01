import { api } from "@/api/api";

import type {
    Arquivo,
    PaginatedArquivos,
} from "@/types/Arquivo";


interface ApiArquivoDepartment {
    id: string;
    nome: string;
}

interface ApiArquivo {
    id: string;
    nome: string;
    tipo: string;
    tamanhoBytes: number;
    criadoEm: string;
    departamentos: ApiArquivoDepartment[];
}

interface GetArquivosResponse {
    items: ApiArquivo[];
    page: number;
    pageSize: number;
    totalItems: number;
}


function mapArquivo(
    arquivo: ApiArquivo
): Arquivo {
    return {
        id: arquivo.id,
        name: arquivo.nome,
        type: arquivo.tipo,
        sizeBytes: arquivo.tamanhoBytes,
        createdAt: arquivo.criadoEm,
        departments:
            arquivo.departamentos.map(
                (department) => ({
                    id: department.id,
                    name: department.nome,
                })
            ),
    };
}


export async function uploadArquivo(
    file: File,
    departamentoIds: string[]
): Promise<string> {
    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    departamentoIds.forEach(
        (departamentoId) => {
            formData.append(
                "departamentoIds",
                departamentoId
            );
        }
    );

    const response =
        await api.post<string>(
            "/arquivo/upload_arquivo",
            formData
        );

    return response.data;
}


export async function getArquivos(
    page = 1,
    search?: string,
    departamentoId?: string
): Promise<PaginatedArquivos> {
    const response =
        await api.get<GetArquivosResponse>(
            "/arquivo/get_arquivos",
            {
                params: {
                    page,
                    search:
                        search?.trim() ||
                        undefined,
                    departamentoId:
                        departamentoId ||
                        undefined,
                },
            }
        );

    const data = response.data;

    return {
        items:
            data.items.map(
                mapArquivo
            ),

        page:
            data.page,

        pageSize:
            data.pageSize,

        totalItems:
            data.totalItems,

        totalPages:
            Math.ceil(
                data.totalItems /
                data.pageSize
            ),
    };
}

export async function downloadArquivo(
    arquivoId: string,
    nomeArquivo: string
): Promise<void> {
    const response = await api.get(
        `/arquivo/download_arquivo/${arquivoId}`,
        {
            responseType: "blob",
        }
    );

    const url =
        window.URL.createObjectURL(
            response.data
        );

    const link =
        document.createElement("a");

    link.href = url;
    link.download = nomeArquivo;

    document.body.appendChild(
        link
    );

    link.click();
    link.remove();

    window.URL.revokeObjectURL(
        url
    );
}

export async function deleteArquivo(
    arquivoId: string
): Promise<void> {
    await api.delete(
        `/arquivo/delete_arquivo/${arquivoId}`
    );
}