import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { ProcedureItem } from "@/components/ProcedureItem/ProcedureItem";

import { getDepartmentById } from "@/services/departmentService";
import { getProceduresByDepartment } from "@/services/procedureService";

import type { Department as DepartmentType } from "@/types/Department";
import type { Procedure } from "@/types/Procedure";

import styles from "./Department.module.css";

export function Department() {
    const { departmentId } = useParams();

    const [department, setDepartment] =
        useState<DepartmentType | null>(null);

    const [procedures, setProcedures] =
        useState<Procedure[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDepartment() {
            if (!departmentId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const [departmentData, proceduresData] =
                    await Promise.all([
                        getDepartmentById(departmentId),
                        getProceduresByDepartment(departmentId),
                    ]);

                setDepartment(departmentData ?? null);
                setProcedures(proceduresData);
            } finally {
                setLoading(false);
            }
        }

        loadDepartment();
    }, [departmentId]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!department) {
        return <p>Departamento não encontrado.</p>;
    }

    return (
        <div className={styles.department}>
            <header className={styles.header}>
                <h1>{department.name}</h1>

                <p>
                    Procedimentos e documentação deste departamento.
                </p>
            </header>

            <section>
                <div className={styles.sectionHeader}>
                    <h2>Procedimentos</h2>

                    <span>
                        {procedures.length} procedimento
                        {procedures.length !== 1 && "s"}
                    </span>
                </div>

                {procedures.length > 0 ? (
                    <div className={styles.procedureList}>
                        {procedures.map((procedure) => (
                            <ProcedureItem
                                key={procedure.id}
                                procedure={procedure}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <p>Nenhum procedimento neste departamento.</p>
                    </div>
                )}
            </section>
        </div>
    );
}