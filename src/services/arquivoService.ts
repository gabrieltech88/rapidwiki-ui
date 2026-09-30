import { api } from "@/api/api";

export async function uploadArquivo(
    file: File,
    departamentoIds: string[]
): Promise<string> {
    const formData = new FormData();

    formData.append("file", file);

    departamentoIds.forEach((departamentoId) => {
        formData.append(
            "departamentoIds",
            departamentoId
        );
    });

    const response = await api.post<string>(
        "/arquivo/upload_arquivo",
        formData
    );

    return response.data;
}