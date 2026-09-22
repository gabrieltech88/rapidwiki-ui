import type { Department } from "@/types/Department";


// Usado para ENVIAR ao backend.
export type ProcedureStatus = 0 | 1;


// Usado para RECEBER do backend.
export type ProcedureStatusLabel =
    | "Rascunho"
    | "Publicado";


export interface Procedure {
    id: string;

    title: string;
    description: string;
    content: string;

    departmentId: string;
    departmentName: string;

    writerName: string;
    lastUpdate: string;

    status: ProcedureStatusLabel;
}


export interface ProcedureDetails extends Procedure {
    departments: Department[];

    createdAt: string;
}


export interface ProcedureInput {
    title: string;
    description: string;
    content: string;

    departmentIds: string[];

    status: ProcedureStatus;
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