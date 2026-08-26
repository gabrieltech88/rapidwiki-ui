import type { User } from "@/types/User";

export const usersMock: User[] = [
    {
        id: "1",
        name: "Gabriel",
        email: "gabriel@rapidwiki.com",
        departmentId: "1",
        departmentName: "Redes",
        roles: ["Admin"],
    },
    {
        id: "2",
        name: "Lucas",
        email: "lucas@rapidwiki.com",
        departmentId: "2",
        departmentName: "Suporte",
        roles: ["User"],
    },
    {
        id: "3",
        name: "Mariana",
        email: "mariana@rapidwiki.com",
        departmentId: "3",
        departmentName: "Financeiro",
        roles: ["User"],
    },
];