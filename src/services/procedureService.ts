import { api } from "@/api/api";
import { getDepartmentById } from "@/services/departmentService";

import type {
    Procedure,
    ProcedureDetails,
    ProcedureInput,
    ProcedureStatus,
} from "@/types/Procedure";


interface ApiAuthor {
    id: string;
    nome: string;
}

interface ApiDepartment {
    id: string;
    nome: string;
}

interface ApiProcedure {
    id: string;
    titulo: string;
    descricao: string;
    conteudo: string;
    autor: ApiAuthor;
    atualizadoEm: string;
}

interface GetProceduresResponse {
    page: number;
    pageSize: number;
    totalItems: number;
    items: ApiProcedure[];
}

interface GetProcedureByIdResponse {
    id: string;
    titulo: string;
    descricao: string;
    conteudo: string;
    autor: ApiAuthor;
    departamentos: ApiDepartment[];
    criadoEm: string;
    atualizadoEm: string;
    status: ProcedureStatus | "Rascunho" | "Publicado";
}

interface ApiDraft {
    id: string;
    titulo: string;
    descricao: string;
    autorId: string;
    autorNome: string;
    editorId: string;
    editorNome: string;
    atualizadoEm: string;
    possuiVersaoPublicada: boolean;
}

interface GetDraftsResponse {
    page: number;
    pageSize: number;
    totalItems: number;
    items: ApiDraft[];
}

interface CreateProcedureRequest {
    titulo: string;
    descricao: string;
    departamentosIds: string[];
    conteudo: string;
    status: ProcedureStatus;
}

interface UpdateProcedureRequest {
    id: string;
    titulo: string;
    descricao: string;
    departamentosIds: string[];
    conteudo: string;
    status: ProcedureStatus;
}

interface SaveProcedureResult {
    id: string;
}


export interface PaginatedProcedures {
    items: Procedure[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface DraftProcedure {
    id: string;
    title: string;
    description: string;
    authorId: string;
    authorName: string;
    editorId: string;
    editorName: string;
    lastUpdate: string;
    hasPublishedVersion: boolean;
}

export interface PaginatedDraftProcedures {
    items: DraftProcedure[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}


function formatDate(date: string): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
}

function normalizeStatus(
    status: ProcedureStatus | "Rascunho" | "Publicado"
): ProcedureStatus {
    if (status === "Rascunho") {
        return 0 as ProcedureStatus;
    }

    if (status === "Publicado") {
        return 1 as ProcedureStatus;
    }

    return status;
}

function mapProcedure(
    procedure: ApiProcedure,
    departmentId = "",
    departmentName = ""
): Procedure {
    return {
        id: procedure.id,
        title: procedure.titulo,
        description: procedure.descricao,
        content: procedure.conteudo,
        departmentId,
        departmentName,
        writerName: procedure.autor.nome,
        lastUpdate: formatDate(procedure.atualizadoEm),
    };
}

function mapProcedureDetails(
    procedure: GetProcedureByIdResponse
): ProcedureDetails {
    const departments = procedure.departamentos.map((department) => ({
        id: department.id,
        name: department.nome,
    }));

    return {
        id: procedure.id,
        title: procedure.titulo,
        description: procedure.descricao,
        content: procedure.conteudo,
        departmentId: departments[0]?.id ?? "",
        departmentName: departments[0]?.name ?? "",
        departments,
        writerName: procedure.autor.nome,
        createdAt: formatDate(procedure.criadoEm),
        lastUpdate: formatDate(procedure.atualizadoEm),
        status: normalizeStatus(procedure.status),
    };
}

function mapDraft(draft: ApiDraft): DraftProcedure {
    return {
        id: draft.id,
        title: draft.titulo,
        description: draft.descricao,
        authorId: draft.autorId,
        authorName: draft.autorNome,
        editorId: draft.editorId,
        editorName: draft.editorNome,
        lastUpdate: formatDate(draft.atualizadoEm),
        hasPublishedVersion: draft.possuiVersaoPublicada,
    };
}


async function getAllAccessibleProcedures(
    search?: string
): Promise<Procedure[]> {
    const term = search?.trim() || undefined;

    const firstResponse = await api.get<GetProceduresResponse>(
        "/procedimento/get_procedimentos",
        {
            params: {
                page: 1,
                search: term,
            },
        }
    );

    const firstPage = firstResponse.data;

    const totalPages = Math.ceil(
        firstPage.totalItems / firstPage.pageSize
    );

    const procedures = firstPage.items.map((procedure) =>
        mapProcedure(procedure)
    );

    if (totalPages <= 1) {
        return procedures;
    }

    const remainingRequests = Array.from(
        { length: totalPages - 1 },
        (_, index) =>
            api.get<GetProceduresResponse>(
                "/procedimento/get_procedimentos",
                {
                    params: {
                        page: index + 2,
                        search: term,
                    },
                }
            )
    );

    const remainingResponses = await Promise.all(
        remainingRequests
    );

    for (const response of remainingResponses) {
        procedures.push(
            ...response.data.items.map((procedure) =>
                mapProcedure(procedure)
            )
        );
    }

    return procedures;
}


export async function getRecentProcedures(): Promise<Procedure[]> {
    return await getAllAccessibleProcedures();
}

export async function searchProcedures(
    search: string
): Promise<Procedure[]> {
    return await getAllAccessibleProcedures(search);
}

export async function getProceduresByDepartment(
    departmentId: string,
    page = 1,
    search?: string
): Promise<PaginatedProcedures> {
    const response = await api.get<GetProceduresResponse>(
        "/procedimento/get_procedimentos",
        {
            params: {
                departamentoId: departmentId,
                page,
                search: search || undefined,
                status: 1,
            },
        }
    );

    const department = await getDepartmentById(
        departmentId
    );

    const items = response.data.items.map((procedure) =>
        mapProcedure(
            procedure,
            departmentId,
            department?.name ?? ""
        )
    );

    return {
        items,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
        totalPages: Math.ceil(
            response.data.totalItems /
                response.data.pageSize
        ),
    };
}

export async function getDraftProcedures(
    page = 1,
    search?: string
): Promise<PaginatedDraftProcedures> {
    const response = await api.get<GetDraftsResponse>(
        "/procedimento/get_rascunhos",
        {
            params: {
                page,
                search: search?.trim() || undefined,
            },
        }
    );

    const items = response.data.items.map((draft) =>
        mapDraft(draft)
    );

    return {
        items,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
        totalPages: Math.ceil(
            response.data.totalItems /
                response.data.pageSize
        ),
    };
}

export async function getProcedureById(
    procedureId: string
): Promise<ProcedureDetails> {
    const response =
        await api.get<GetProcedureByIdResponse>(
            `/procedimento/get_procedimento_by_id/${procedureId}`
        );

    return mapProcedureDetails(response.data);
}

export async function getProcedureForEdit(
    procedureId: string
): Promise<ProcedureDetails> {
    const response =
        await api.get<GetProcedureByIdResponse>(
            `/procedimento/get_procedimento_for_edit/${procedureId}`
        );

    return mapProcedureDetails(response.data);
}

export async function createProcedure(
    input: ProcedureInput
): Promise<SaveProcedureResult> {
    if (input.departmentIds.length === 0) {
        throw new Error(
            "Selecione pelo menos um departamento."
        );
    }

    const request: CreateProcedureRequest = {
        titulo: input.title,
        descricao: input.description,
        departamentosIds: input.departmentIds,
        conteudo: input.content,
        status: input.status,
    };

    const response = await api.post<string>(
        "/procedimento/create_procedimento",
        request
    );

    return {
        id: response.data,
    };
}

export async function updateProcedure(
    procedureId: string,
    input: ProcedureInput
): Promise<SaveProcedureResult> {
    if (input.departmentIds.length === 0) {
        throw new Error(
            "Selecione pelo menos um departamento."
        );
    }

    const request: UpdateProcedureRequest = {
        id: procedureId,
        titulo: input.title,
        descricao: input.description,
        departamentosIds: input.departmentIds,
        conteudo: input.content,
        status: input.status,
    };

    const response = await api.put<string>(
        "/procedimento/update_procedimento",
        request
    );

    return {
        id: response.data,
    };
}

export async function deleteProcedure(
    procedureId: string
): Promise<void> {
    await api.delete(
        `/procedimento/delete_procedimento/${procedureId}`
    );
}

export async function deleteDraft(
    procedureId: string
): Promise<void> {
    await api.delete(
        `/procedimento/delete_rascunho/${procedureId}`
    );
}

export async function getHomeProcedures(
    page = 1,
    search?: string
): Promise<PaginatedProcedures> {
    const response = await api.get<GetProceduresResponse>(
        "/procedimento/get_procedimentos",
        {
            params: {
                page,
                search: search?.trim() || undefined,
            },
        }
    );

    const items = response.data.items.map((procedure) =>
        mapProcedure(procedure)
    );

    return {
        items,
        page: response.data.page,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
        totalPages: Math.ceil(
            response.data.totalItems /
                response.data.pageSize
        ),
    };
}