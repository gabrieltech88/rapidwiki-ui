export interface ArquivoDepartment {
    id: string;
    name: string;
}

export interface Arquivo {
    id: string;
    name: string;
    type: string;
    sizeBytes: number;
    createdAt: string;
    departments: ArquivoDepartment[];
}

export interface PaginatedArquivos {
    items: Arquivo[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}