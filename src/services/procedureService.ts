import { proceduresMock } from "@/mocks/procedures";
import type { Procedure, ProcedureInput} from "@/types/Procedure";
import { departmentsMock } from "@/mocks/departments";


export async function getRecentProcedures(): Promise<Procedure[]> {
    return proceduresMock;
}

export async function getProceduresByDepartment(
    departmentId: string
): Promise<Procedure[]> {
    return proceduresMock.filter(
        (procedure) => procedure.departmentId === departmentId
    );
}

export async function getProcedureById(
    procedureId: string
): Promise<Procedure | undefined> {
    return proceduresMock.find(
        (procedure) => procedure.id === procedureId
    );
}

export async function searchProcedures(
    search: string
): Promise<Procedure[]> {
    const term = search.trim().toLowerCase();

    if (!term) {
        return proceduresMock;
    }

    return proceduresMock.filter((procedure) =>
        procedure.title.toLowerCase().includes(term) ||
        procedure.description.toLowerCase().includes(term) ||
        procedure.departmentName.toLowerCase().includes(term)
    );
}

export async function createProcedure(
    input: ProcedureInput
): Promise<Procedure> {
    const department = departmentsMock.find(
        (department) => department.id === input.departmentId
    );

    if (!department) {
        throw new Error("Departamento não encontrado.");
    }

    const procedure: Procedure = {
        id: crypto.randomUUID(),

        title: input.title,
        description: input.description,
        content: input.content,

        departmentId: department.id,
        departmentName: department.name,

        writerName: "Gabriel",
        lastUpdate: "Agora",
    };

    proceduresMock.push(procedure);

    return procedure;
}

export async function updateProcedure(
    procedureId: string,
    input: ProcedureInput
): Promise<Procedure> {
    const procedure = proceduresMock.find(
        (procedure) => procedure.id === procedureId
    );

    if (!procedure) {
        throw new Error("Procedimento não encontrado.");
    }

    const department = departmentsMock.find(
        (department) => department.id === input.departmentId
    );

    if (!department) {
        throw new Error("Departamento não encontrado.");
    }

    procedure.title = input.title;
    procedure.description = input.description;
    procedure.content = input.content;

    procedure.departmentId = department.id;
    procedure.departmentName = department.name;

    procedure.lastUpdate = "Agora";

    return procedure;
}