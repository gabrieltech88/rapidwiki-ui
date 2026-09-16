import { api } from "@/api/api";

import { proceduresMock } from "@/mocks/procedures";
import { departmentsMock } from "@/mocks/departments";

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

    status: ProcedureStatus;
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


export interface PaginatedProcedures {
    items: Procedure[];

    page: number;

    pageSize: number;

    totalItems: number;

    totalPages: number;
}


function formatDate(
    date: string
): string {
    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return date;
    }


    return parsedDate.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }
    );
}


function mapProcedure(
    procedure: ApiProcedure,
    departmentId = "",
    departmentName = ""
): Procedure {
    return {
        id:
            procedure.id,

        title:
            procedure.titulo,

        description:
            procedure.descricao,

        content:
            procedure.conteudo,

        departmentId,

        departmentName,

        writerName:
            procedure.autor.nome,

        lastUpdate:
            formatDate(
                procedure.atualizadoEm
            ),
    };
}


export async function getRecentProcedures(): Promise<Procedure[]> {
    return proceduresMock;
}


export async function getProceduresByDepartment(
    departmentId: string,
    page = 1,
    search?: string
): Promise<PaginatedProcedures> {
    const response =
        await api.get<GetProceduresResponse>(
            "/procedimento/get_procedimentos",
            {
                params: {
                    departamentoId:
                        departmentId,

                    page,

                    search:
                        search || undefined,

                    /*
                     * Publicado
                     */
                    status: 1,
                },
            }
        );


    const department =
        departmentsMock.find(
            (department) =>
                department.id ===
                departmentId
        );


    const items =
        response.data.items.map(
            (procedure) =>
                mapProcedure(
                    procedure,
                    departmentId,
                    department?.name ?? ""
                )
        );


    return {
        items,

        page:
            response.data.page,

        pageSize:
            response.data.pageSize,

        totalItems:
            response.data.totalItems,

        totalPages:
            Math.ceil(
                response.data.totalItems /
                    response.data.pageSize
            ),
    };
}


export async function getDraftProcedures(
    page = 1,
    search?: string
): Promise<PaginatedProcedures> {
    const response =
        await api.get<GetProceduresResponse>(
            "/procedimento/get_procedimentos",
            {
                params: {
                    page,

                    search:
                        search || undefined,

                    /*
                     * Rascunho
                     */
                    status: 0,
                },
            }
        );


    const items =
        response.data.items.map(
            (procedure) =>
                mapProcedure(
                    procedure
                )
        );


    return {
        items,

        page:
            response.data.page,

        pageSize:
            response.data.pageSize,

        totalItems:
            response.data.totalItems,

        totalPages:
            Math.ceil(
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


    const procedure =
        response.data;


    const departments =
        procedure.departamentos.map(
            (department) => ({
                id:
                    department.id,

                name:
                    department.nome,
            })
        );


    return {
        id:
            procedure.id,

        title:
            procedure.titulo,

        description:
            procedure.descricao,

        content:
            procedure.conteudo,

        departmentId:
            departments[0]?.id ?? "",

        departmentName:
            departments[0]?.name ?? "",

        departments,

        writerName:
            procedure.autor.nome,

        createdAt:
            formatDate(
                procedure.criadoEm
            ),

        lastUpdate:
            formatDate(
                procedure.atualizadoEm
            ),

        status:
            procedure.status,
    };
}


export async function searchProcedures(
    search: string
): Promise<Procedure[]> {
    const term =
        search
            .trim()
            .toLowerCase();


    if (!term) {
        return proceduresMock;
    }


    return proceduresMock.filter(
        (procedure) =>
            procedure.title
                .toLowerCase()
                .includes(term) ||

            procedure.description
                .toLowerCase()
                .includes(term) ||

            procedure.departmentName
                .toLowerCase()
                .includes(term)
    );
}


export async function createProcedure(
    input: ProcedureInput
): Promise<ProcedureDetails> {
    if (
        input.departmentIds.length ===
        0
    ) {
        throw new Error(
            "Selecione pelo menos um departamento."
        );
    }


    const request:
        CreateProcedureRequest = {
        titulo:
            input.title,

        descricao:
            input.description,

        departamentosIds:
            input.departmentIds,

        conteudo:
            input.content,

        status:
            input.status,
    };


    const response =
        await api.post<string>(
            "/procedimento/create_procedimento",
            request
        );


    return await getProcedureById(
        response.data
    );
}


export async function updateProcedure(
    procedureId: string,
    input: ProcedureInput
): Promise<ProcedureDetails> {
    if (
        input.departmentIds.length ===
        0
    ) {
        throw new Error(
            "Selecione pelo menos um departamento."
        );
    }


    const request:
        UpdateProcedureRequest = {
        id:
            procedureId,

        titulo:
            input.title,

        descricao:
            input.description,

        departamentosIds:
            input.departmentIds,

        conteudo:
            input.content,

        status:
            input.status,
    };


    const response =
        await api.put<string>(
            "/procedimento/update_procedimento",
            request
        );


    return await getProcedureById(
        response.data
    );
}