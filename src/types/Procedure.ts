import type { Department } from "@/types/Department";

export type ProcedureStatus = 0 | 1;

export interface Procedure {
    id: string;

    title: string;
    description: string;
    content: string;

    departmentId: string;
    departmentName: string;

    writerName: string;
    lastUpdate: string;
}

export interface ProcedureDetails extends Procedure {
    departments: Department[];

    createdAt: string;

    status: ProcedureStatus;
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