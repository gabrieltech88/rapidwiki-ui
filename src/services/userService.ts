import { api } from "@/api/api";

import type {
    AdminUser,
    PaginatedUsers,
    UserRole,
} from "@/types/AdminUser";


interface ApiDepartment {
    id: string;
    nome: string;
}


interface ApiUser {
    id: string;
    nome: string;
    email: string;
    role: UserRole;
    departamentos: ApiDepartment[];
}


interface GetUsersResponse {
    items: ApiUser[];
    page: number;
    pageSize: number;
    totalItems: number;
}


export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    departmentIds: string[];
}


export interface UpdateUserInput {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    departmentIds: string[];
}


function mapUser(
    user: ApiUser
): AdminUser {
    return {
        id: user.id,

        name: user.nome,

        email: user.email,

        role: user.role,

        departments:
            user.departamentos.map(
                (department) => ({
                    id: department.id,
                    name: department.nome,
                })
            ),
    };
}


export async function getUsers(
    page = 1,
    search?: string
): Promise<PaginatedUsers> {
    const response =
        await api.get<GetUsersResponse>(
            "/auth/get_users",
            {
                params: {
                    page,

                    search:
                        search?.trim() ||
                        undefined,
                },
            }
        );


    return {
        items:
            response.data.items.map(
                mapUser
            ),

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


export async function createUser(
    input: CreateUserInput
): Promise<void> {
    await api.post(
        "/auth/create_user",
        {
            nome:
                input.name,

            password:
                input.password,

            email:
                input.email,

            departamentoIds:
                input.departmentIds,

            role:
                input.role,
        }
    );
}


export async function updateUser(
    input: UpdateUserInput
): Promise<void> {
    await api.put(
        "/auth/update_user",
        {
            id:
                input.id,

            nome:
                input.name,

            email:
                input.email,

            role:
                input.role,

            departamentosIds:
                input.departmentIds,
        }
    );
}