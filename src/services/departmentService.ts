import { api } from "@/api/api";

import type { Department } from "@/types/Department";


interface ApiDepartment {
    id: string;
    nome: string;
}


export async function getDepartments(): Promise<Department[]> {
    const response =
        await api.get<ApiDepartment[]>(
            "/departamento/get_all_departamentos"
        );

    return response.data.map(
        (department) => ({
            id: department.id,
            name: department.nome,
        })
    );
}


export async function getDepartmentById(
    departmentId: string
): Promise<Department | undefined> {
    const departments =
        await getDepartments();

    return departments.find(
        (department) =>
            department.id === departmentId
    );
}