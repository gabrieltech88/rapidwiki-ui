import { useEffect, useMemo, useState } from "react";
import {
    Building2,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import { getDepartments } from "@/services/departmentService";
import { getUsers } from "@/services/userService";

import type { Department } from "@/types/Department";
import type { User } from "@/types/User";

import styles from "./Admin.module.css";

type AdminTab = "users" | "departments";

interface UserForm {
    id?: string;
    name: string;
    email: string;
    role: string;
    departmentIds: string[];
}

interface DepartmentForm {
    id?: string;
    name: string;
}

const EMPTY_USER_FORM: UserForm = {
    name: "",
    email: "",
    role: "",
    departmentIds: [],
};

const EMPTY_DEPARTMENT_FORM: DepartmentForm = {
    name: "",
};

export function Admin() {
    const [activeTab, setActiveTab] =
        useState<AdminTab>("users");

    const [users, setUsers] =
        useState<User[]>([]);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [userModalOpen, setUserModalOpen] =
        useState(false);

    const [
        departmentModalOpen,
        setDepartmentModalOpen,
    ] = useState(false);

    const [userForm, setUserForm] =
        useState<UserForm>(EMPTY_USER_FORM);

    const [
        departmentForm,
        setDepartmentForm,
    ] = useState<DepartmentForm>(
        EMPTY_DEPARTMENT_FORM
    );

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);

        try {
            const [
                usersData,
                departmentsData,
            ] = await Promise.all([
                getUsers(),
                getDepartments(),
            ]);

            setUsers(usersData ?? []);
            setDepartments(
                departmentsData ?? []
            );
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers =
        useMemo(() => {
            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return users;
            }

            return users.filter((user) => {
                return (
                    user.name
                        ?.toLowerCase()
                        .includes(term) ||
                    user.email
                        ?.toLowerCase()
                        .includes(term)
                );
            });
        }, [users, search]);

    const filteredDepartments =
        useMemo(() => {
            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return departments;
            }

            return departments.filter(
                (department) =>
                    department.name
                        ?.toLowerCase()
                        .includes(term)
            );
        }, [
            departments,
            search,
        ]);

    function openCreateUser() {
        setUserForm(
            EMPTY_USER_FORM
        );

        setUserModalOpen(true);
    }

    function openEditUser(
        user: User
    ) {
        setUserForm({
            id: user.id,
            name: user.name ?? "",
            email: user.email ?? "",

            /*
             * Ajuste estes campos caso
             * seu type User tenha outros nomes.
             */
            role:
                user.role ?? "",

            departmentIds:
                user.departmentIds ?? [],
        });

        setUserModalOpen(true);
    }

    function toggleDepartment(
        departmentId: string
    ) {
        setUserForm((current) => {
            const exists =
                current.departmentIds.includes(
                    departmentId
                );

            return {
                ...current,

                departmentIds:
                    exists
                        ? current.departmentIds.filter(
                              (id) =>
                                  id !==
                                  departmentId
                          )
                        : [
                              ...current.departmentIds,
                              departmentId,
                          ],
            };
        });
    }

    async function handleSaveUser() {
        /*
         * Aqui entraremos com:
         *
         * createUser(...)
         * updateUser(...)
         *
         * quando conectarmos
         * com sua API.
         */

        if (userForm.id) {
            setUsers((current) =>
                current.map(
                    (user) =>
                        user.id ===
                        userForm.id
                            ? {
                                  ...user,
                                  name:
                                      userForm.name,
                                  email:
                                      userForm.email,
                                  role:
                                      userForm.role,
                                  departmentIds:
                                      userForm.departmentIds,
                              }
                            : user
                )
            );
        }

        setUserModalOpen(false);
    }

    async function handleDeleteUser(
        user: User
    ) {
        const confirmed =
            window.confirm(
                `Deseja excluir o usuário "${user.name}"?`
            );

        if (!confirmed) {
            return;
        }

        /*
         * Depois:
         *
         * await deleteUser(user.id)
         */

        setUsers((current) =>
            current.filter(
                (item) =>
                    item.id !== user.id
            )
        );
    }

    function openCreateDepartment() {
        setDepartmentForm(
            EMPTY_DEPARTMENT_FORM
        );

        setDepartmentModalOpen(
            true
        );
    }

    function openEditDepartment(
        department: Department
    ) {
        setDepartmentForm({
            id: department.id,
            name:
                department.name,
        });

        setDepartmentModalOpen(
            true
        );
    }

    async function handleSaveDepartment() {
        if (
            !departmentForm.name.trim()
        ) {
            return;
        }

        if (departmentForm.id) {
            setDepartments(
                (current) =>
                    current.map(
                        (department) =>
                            department.id ===
                            departmentForm.id
                                ? {
                                      ...department,
                                      name:
                                          departmentForm.name,
                                  }
                                : department
                    )
            );
        }

        setDepartmentModalOpen(
            false
        );
    }

    async function handleDeleteDepartment(
        department: Department
    ) {
        const confirmed =
            window.confirm(
                `Deseja excluir o departamento "${department.name}"?`
            );

        if (!confirmed) {
            return;
        }

        /*
         * Depois:
         *
         * await deleteDepartment(
         *     department.id
         * )
         */

        setDepartments(
            (current) =>
                current.filter(
                    (item) =>
                        item.id !==
                        department.id
                )
        );
    }

    if (loading) {
        return (
            <div className={styles.page}>
                Carregando administração...
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>
                        Administração
                    </h1>

                    <p>
                        Gerencie usuários,
                        cargos e departamentos
                        do RapidWiki.
                    </p>
                </div>
            </header>

            <div className={styles.tabs}>
                <button
                    type="button"
                    data-active={
                        activeTab === "users"
                    }
                    onClick={() => {
                        setActiveTab("users");
                        setSearch("");
                    }}
                >
                    <Users size={16} />

                    Usuários
                </button>

                <button
                    type="button"
                    data-active={
                        activeTab ===
                        "departments"
                    }
                    onClick={() => {
                        setActiveTab(
                            "departments"
                        );
                        setSearch("");
                    }}
                >
                    <Building2
                        size={16}
                    />

                    Departamentos
                </button>
            </div>

            <div className={styles.toolbar}>
                <div
                    className={
                        styles.search
                    }
                >
                    <Search size={15} />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target
                                    .value
                            )
                        }
                        placeholder={
                            activeTab ===
                            "users"
                                ? "Buscar usuário..."
                                : "Buscar departamento..."
                        }
                    />
                </div>

                {activeTab ===
                "users" ? (
                    <button
                        className={
                            styles.primaryButton
                        }
                        type="button"
                        onClick={
                            openCreateUser
                        }
                    >
                        <UserPlus
                            size={15}
                        />

                        Novo usuário
                    </button>
                ) : (
                    <button
                        className={
                            styles.primaryButton
                        }
                        type="button"
                        onClick={
                            openCreateDepartment
                        }
                    >
                        <Plus size={15} />

                        Novo departamento
                    </button>
                )}
            </div>

            {activeTab === "users" ? (
                <section
                    className={
                        styles.panel
                    }
                >
                    <div
                        className={
                            styles.tableHeader
                        }
                    >
                        <span>
                            Usuário
                        </span>

                        <span>
                            Cargo
                        </span>

                        <span>
                            Departamentos
                        </span>

                        <span />
                    </div>

                    {filteredUsers.map(
                        (user) => (
                            <div
                                key={user.id}
                                className={
                                    styles.tableRow
                                }
                            >
                                <div
                                    className={
                                        styles.userInfo
                                    }
                                >
                                    <div
                                        className={
                                            styles.avatar
                                        }
                                    >
                                        {user.name
                                            ?.charAt(
                                                0
                                            )
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <strong>
                                            {
                                                user.name
                                            }
                                        </strong>

                                        <span>
                                            {
                                                user.email
                                            }
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={
                                        styles.role
                                    }
                                >
                                    {user.role ||
                                        "Sem cargo"}
                                </span>

                                <div
                                    className={
                                        styles.departments
                                    }
                                >
                                    {(
                                        user.departmentIds ??
                                        []
                                    ).length >
                                    0 ? (
                                        (
                                            user.departmentIds ??
                                            []
                                        ).map(
                                            (
                                                departmentId
                                            ) => {
                                                const department =
                                                    departments.find(
                                                        (
                                                            item
                                                        ) =>
                                                            item.id ===
                                                            departmentId
                                                    );

                                                if (
                                                    !department
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <span
                                                        key={
                                                            department.id
                                                        }
                                                    >
                                                        {
                                                            department.name
                                                        }
                                                    </span>
                                                );
                                            }
                                        )
                                    ) : (
                                        <span
                                            className={
                                                styles.empty
                                            }
                                        >
                                            Nenhum
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={
                                        styles.actions
                                    }
                                >
                                    <button
                                        type="button"
                                        title="Editar usuário"
                                        onClick={() =>
                                            openEditUser(
                                                user
                                            )
                                        }
                                    >
                                        <Pencil
                                            size={
                                                14
                                            }
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        title="Excluir usuário"
                                        onClick={() =>
                                            handleDeleteUser(
                                                user
                                            )
                                        }
                                    >
                                        <Trash2
                                            size={
                                                14
                                            }
                                        />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </section>
            ) : (
                <section
                    className={
                        styles.departmentGrid
                    }
                >
                    {filteredDepartments.map(
                        (
                            department
                        ) => (
                            <article
                                key={
                                    department.id
                                }
                                className={
                                    styles.departmentCard
                                }
                            >
                                <div
                                    className={
                                        styles.departmentIcon
                                    }
                                >
                                    <Building2
                                        size={
                                            18
                                        }
                                    />
                                </div>

                                <div
                                    className={
                                        styles.departmentContent
                                    }
                                >
                                    <strong>
                                        {
                                            department.name
                                        }
                                    </strong>

                                    <span>
                                        Departamento
                                    </span>
                                </div>

                                <div
                                    className={
                                        styles.actions
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openEditDepartment(
                                                department
                                            )
                                        }
                                    >
                                        <Pencil
                                            size={
                                                14
                                            }
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteDepartment(
                                                department
                                            )
                                        }
                                    >
                                        <Trash2
                                            size={
                                                14
                                            }
                                        />
                                    </button>
                                </div>
                            </article>
                        )
                    )}
                </section>
            )}

            {userModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    onMouseDown={() =>
                        setUserModalOpen(
                            false
                        )
                    }
                >
                    <div
                        className={
                            styles.modal
                        }
                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <div
                            className={
                                styles.modalHeader
                            }
                        >
                            <div>
                                <h2>
                                    {userForm.id
                                        ? "Editar usuário"
                                        : "Novo usuário"}
                                </h2>

                                <p>
                                    Configure os
                                    dados e acessos
                                    do usuário.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setUserModalOpen(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={
                                        18
                                    }
                                />
                            </button>
                        </div>

                        <div
                            className={
                                styles.form
                            }
                        >
                            <label>
                                Nome

                                <input
                                    value={
                                        userForm.name
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setUserForm(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                name:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    placeholder="Nome do usuário"
                                />
                            </label>

                            <label>
                                E-mail

                                <input
                                    type="email"
                                    value={
                                        userForm.email
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setUserForm(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                email:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    placeholder="usuario@empresa.com"
                                />
                            </label>

                            <label>
                                Cargo

                                <input
                                    value={
                                        userForm.role
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setUserForm(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                role:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    placeholder="Ex: Suporte N2"
                                />
                            </label>

                            <div
                                className={
                                    styles.departmentSelector
                                }
                            >
                                <span
                                    className={
                                        styles.label
                                    }
                                >
                                    Departamentos
                                </span>

                                <div
                                    className={
                                        styles.checkboxGrid
                                    }
                                >
                                    {departments.map(
                                        (
                                            department
                                        ) => (
                                            <label
                                                key={
                                                    department.id
                                                }
                                                className={
                                                    styles.checkbox
                                                }
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={userForm.departmentIds.includes(
                                                        department.id
                                                    )}
                                                    onChange={() =>
                                                        toggleDepartment(
                                                            department.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        department.name
                                                    }
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                styles.modalFooter
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.secondaryButton
                                }
                                onClick={() =>
                                    setUserModalOpen(
                                        false
                                    )
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className={
                                    styles.primaryButton
                                }
                                onClick={
                                    handleSaveUser
                                }
                            >
                                Salvar usuário
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {departmentModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    onMouseDown={() =>
                        setDepartmentModalOpen(
                            false
                        )
                    }
                >
                    <div
                        className={
                            styles.modalSmall
                        }
                        onMouseDown={(
                            event
                        ) =>
                            event.stopPropagation()
                        }
                    >
                        <div
                            className={
                                styles.modalHeader
                            }
                        >
                            <div>
                                <h2>
                                    {departmentForm.id
                                        ? "Editar departamento"
                                        : "Novo departamento"}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setDepartmentModalOpen(
                                        false
                                    )
                                }
                            >
                                <X
                                    size={
                                        18
                                    }
                                />
                            </button>
                        </div>

                        <div
                            className={
                                styles.form
                            }
                        >
                            <label>
                                Nome

                                <input
                                    value={
                                        departmentForm.name
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDepartmentForm(
                                            (
                                                current
                                            ) => ({
                                                ...current,
                                                name:
                                                    event
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    placeholder="Ex: Suporte"
                                />
                            </label>
                        </div>

                        <div
                            className={
                                styles.modalFooter
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.secondaryButton
                                }
                                onClick={() =>
                                    setDepartmentModalOpen(
                                        false
                                    )
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className={
                                    styles.primaryButton
                                }
                                onClick={
                                    handleSaveDepartment
                                }
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}