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

export interface ProcedureInput {
    title: string;
    description: string;
    content: string;
    departmentId: string;
}