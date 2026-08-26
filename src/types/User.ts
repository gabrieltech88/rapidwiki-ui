export interface User {
    id: string;
    name: string;
    email: string;

    departmentId: string;
    departmentName: string;

    roles: string[];
}