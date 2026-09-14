import {
    Search,
    FileText,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import { useParams } from "react-router";

import { ProcedureItem } from "@/components/ProcedureItem/ProcedureItem";

import { getDepartmentById } from "@/services/departmentService";
import { getProceduresByDepartment } from "@/services/procedureService";

import type { Department as DepartmentType } from "@/types/Department";
import type { Procedure } from "@/types/Procedure";

import styles from "./Department.module.css";

type DepartmentSection =
    | "procedures"
    | "documents";

interface DepartmentProps {
    section: DepartmentSection;
}

export function Department({
    section,
}: DepartmentProps) {
    const { departmentId } = useParams();

    const [department, setDepartment] =
        useState<DepartmentType | null>(null);

    const [procedures, setProcedures] =
        useState<Procedure[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadDepartment() {
            if (!departmentId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const departmentData =
                    await getDepartmentById(
                        departmentId
                    );

                setDepartment(
                    departmentData ?? null
                );

                if (section === "procedures") {
                    const proceduresData =
                        await getProceduresByDepartment(
                            departmentId
                        );

                    setProcedures(
                        proceduresData
                    );
                } else {
                    setProcedures([]);
                }
            } finally {
                setLoading(false);
            }
        }

        loadDepartment();
    }, [
        departmentId,
        section,
    ]);

    if (loading) {
        return (
            <p>
                Carregando...
            </p>
        );
    }

    if (!department) {
        return (
            <p>
                Departamento não encontrado.
            </p>
        );
    }

    return (
        <div className={styles.department}>
            <header className={styles.header}>
                <h1>
                    {department.name}
                </h1>

                <p>
                    Procedimentos e documentação
                    deste departamento.
                </p>
            </header>

            {section === "procedures" ? (
                <section>
                    <div
                        className={
                            styles.sectionTop
                        }
                    >
                        <div
                            className={
                                styles.sectionHeader
                            }
                        >
                            <h2>
                                Procedimentos
                            </h2>

                            <span>
                                {procedures.length} procedimento
                                {procedures.length !== 1 &&
                                    "s"}
                            </span>
                        </div>

                        <div
                            className={
                                styles.search
                            }
                        >
                            <Search
                                size={16}
                            />

                            <input
                                type="search"
                                placeholder="Pesquisar procedimentos..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                aria-label="Pesquisar procedimentos"
                            />
                        </div>
                    </div>

                    {procedures.length > 0 ? (
                        <div
                            className={
                                styles.procedureList
                            }
                        >
                            {procedures.map(
                                (procedure) => (
                                    <ProcedureItem
                                        key={
                                            procedure.id
                                        }
                                        procedure={
                                            procedure
                                        }
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        <div
                            className={
                                styles.empty
                            }
                        >
                            <p>
                                Nenhum procedimento
                                neste departamento.
                            </p>
                        </div>
                    )}
                </section>
            ) : (
                <section>
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <h2>
                            Documentos
                        </h2>
                    </div>

                    <div
                        className={
                            styles.documentsEmpty
                        }
                    >
                        <FileText
                            size={20}
                        />

                        <p>
                            Nenhum documento neste
                            departamento.
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}