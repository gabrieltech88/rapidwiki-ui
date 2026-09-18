import type { Department } from "@/types/Department";

export type UserRole =
    | "Admin"
    | "Editor"
    | "User";

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    departments: Department[];
}

export interface PaginatedUsers {
    items: AdminUser[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}