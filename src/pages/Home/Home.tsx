import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { ProcedureItem } from "@/components/ProcedureItem/ProcedureItem";

import {
    getRecentProcedures,
    searchProcedures,
} from "@/services/procedureService";

import type { Procedure } from "@/types/Procedure";

import styles from "./Home.module.css";

export function Home() {
    const [search, setSearch] = useState("");
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    console.log(user);

    useEffect(() => {
        async function loadProcedures() {
            setLoading(true);

            try {
                const data = search.trim()
                    ? await searchProcedures(search)
                    : await getRecentProcedures();

                setProcedures(data);
            } finally {
                setLoading(false);
            }
        }

        loadProcedures();
    }, [search]);

    return (
        <div className={styles.home}>
            <header className={styles.header}>
                <h1>Base de conhecimento</h1>

                <p>
                    Encontre procedimentos e documentação interna.
                </p>

                <div className={styles.search}>
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Buscar procedimentos..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>
            </header>

            <section className={styles.recent}>
                <div className={styles.sectionHeader}>
                    <h2>
                        {search
                            ? "Resultados"
                            : "Procedimentos recentes"}
                    </h2>

                    {search && !loading && (
                        <span>
                            {procedures.length} resultado
                            {procedures.length !== 1 && "s"}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className={styles.empty}>
                        <p>Carregando...</p>
                    </div>
                ) : procedures.length > 0 ? (
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
                        <p>Nenhum procedimento encontrado.</p>

                        <span>
                            Tente buscar por outro termo.
                        </span>
                    </div>
                )}
            </section>
        </div>
    );
}