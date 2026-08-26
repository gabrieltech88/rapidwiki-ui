import { departmentsMock } from "@/mocks/departments";
import type { Department } from "@/types/Department";

export async function getDepartments(): Promise<Department[]> {
    return departmentsMock;
}

export async function getDepartmentById(
    departmentId: string
): Promise<Department | undefined> {
    return departmentsMock.find(
        (department) => department.id === departmentId
    );
}