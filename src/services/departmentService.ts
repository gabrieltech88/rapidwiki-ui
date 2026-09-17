import { api } from "@/api/api";

import type { Department } from "@/types/Department";


interface ApiDepartment {
    id: string;
    nome: string;
}


function mapDepartments(departments: ApiDepartment[]): Department[] {
    return departments
        .map((department) => ({
            id: department.id,
            name: department.nome,
        }));
}


export async function getDepartments(): Promise<Department[]> {
    const response = await api.get<ApiDepartment[]>(
        "/departamento/get_all_departamentos"
    );

    return mapDepartments(response.data);
}


export async function getDepartmentsForProcedure(): Promise<Department[]> {
    const response = await api.get<ApiDepartment[]>(
        "/departamento/get_departamentos_para_procedimento"
    );

    return mapDepartments(response.data);
}


export async function getDepartmentById(
    departmentId: string
): Promise<Department | undefined> {
    const departments = await getDepartments();

    return departments
        .find((department) => department.id === departmentId);
}


export async function createDepartment(name: string): Promise<void> {
    await api.post(
        "/departamento/create_departamento",
        {
            nome: name,
        }
    );
}


export async function updateDepartment(
    id: string,
    name: string
): Promise<void> {
    await api.put(
        "/departamento/update_departamento",
        {
            id,
            nome: name,
        }
    );
}


export async function deleteDepartment(id: string): Promise<void> {
    await api.delete(
        `/departamento/delete_departamento/${id}`
    );
}