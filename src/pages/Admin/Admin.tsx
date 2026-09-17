import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import {
    createDepartment,
    deleteDepartment,
    getDepartments,
    updateDepartment,
} from "@/services/departmentService";

import {
    createUser,
    getUsers,
    updateUser,
} from "@/services/userService";

import type {
    Department,
} from "@/types/Department";

import type {
    AdminUser,
    UserRole,
} from "@/types/AdminUser";

import styles from "./Admin.module.css";


type AdminTab =
    | "users"
    | "departments";


interface UserForm {
    id?: string;

    name: string;
    email: string;
    password: string;

    role: UserRole;

    departmentIds: string[];
}


interface DepartmentForm {
    id?: string;
    name: string;
}


const EMPTY_USER_FORM: UserForm = {
    name: "",
    email: "",
    password: "",
    role: "User",
    departmentIds: [],
};


const EMPTY_DEPARTMENT_FORM: DepartmentForm = {
    name: "",
};


export function Admin() {
    const [
        activeTab,
        setActiveTab,
    ] = useState<AdminTab>(
        "users"
    );


    const [users, setUsers] =
        useState<AdminUser[]>([]);


    const [
        departments,
        setDepartments,
    ] = useState<Department[]>([]);


    const [
        loadingUsers,
        setLoadingUsers,
    ] = useState(true);


    const [
        loadingDepartments,
        setLoadingDepartments,
    ] = useState(true);


    const [
        savingUser,
        setSavingUser,
    ] = useState(false);


    const [
        savingDepartment,
        setSavingDepartment,
    ] = useState(false);


    const [search, setSearch] =
        useState("");


    const [page, setPage] =
        useState(1);


    const [
        totalPages,
        setTotalPages,
    ] = useState(1);


    const [
        totalItems,
        setTotalItems,
    ] = useState(0);


    const [
        userError,
        setUserError,
    ] = useState("");


    const [
        departmentError,
        setDepartmentError,
    ] = useState("");


    const [
        userModalOpen,
        setUserModalOpen,
    ] = useState(false);


    const [
        departmentModalOpen,
        setDepartmentModalOpen,
    ] = useState(false);


    const [
        userForm,
        setUserForm,
    ] = useState<UserForm>(
        EMPTY_USER_FORM
    );


    const [
        departmentForm,
        setDepartmentForm,
    ] = useState<DepartmentForm>(
        EMPTY_DEPARTMENT_FORM
    );


    useEffect(() => {
        async function loadDepartments() {
            setLoadingDepartments(true);

            try {
                const data =
                    await getDepartments();

                setDepartments(
                    data ?? []
                );
            } finally {
                setLoadingDepartments(
                    false
                );
            }
        }

        loadDepartments();
    }, []);


    useEffect(() => {
        if (
            activeTab !==
            "users"
        ) {
            return;
        }

        const timeout =
            window.setTimeout(
                () => {
                    loadUsers(
                        page,
                        search
                    );
                },
                300
            );

        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        activeTab,
        page,
        search,
    ]);


    async function loadUsers(
        targetPage = page,
        targetSearch = search
    ) {
        setLoadingUsers(true);

        try {
            const result =
                await getUsers(
                    targetPage,
                    targetSearch
                );

            setUsers(
                result.items
            );

            setTotalPages(
                result.totalPages
            );

            setTotalItems(
                result.totalItems
            );

            setUserError("");
        } catch (error) {
            console.error(
                "Erro ao carregar usuários:",
                error
            );

            setUsers([]);

            setUserError(
                "Não foi possível carregar os usuários."
            );
        } finally {
            setLoadingUsers(false);
        }
    }


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
                        .toLowerCase()
                        .includes(term)
            );
        }, [
            departments,
            search,
        ]);


    function handleSearchChange(
        value: string
    ) {
        setSearch(value);

        if (
            activeTab ===
            "users"
        ) {
            setPage(1);
        }
    }


    function openCreateUser() {
        setUserForm({
            ...EMPTY_USER_FORM,
            departmentIds: [],
        });

        setUserError("");

        setUserModalOpen(true);
    }


    function openEditUser(
        user: AdminUser
    ) {
        setUserForm({
            id:
                user.id,

            name:
                user.name,

            email:
                user.email,

            password:
                "",

            role:
                user.role,

            departmentIds:
                user.departments.map(
                    (department) =>
                        department.id
                ),
        });

        setUserError("");

        setUserModalOpen(true);
    }


    function toggleDepartment(
        departmentId: string
    ) {
        setUserForm(
            (current) => {
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
            }
        );
    }


    async function handleSaveUser() {
        if (
            !userForm.name.trim() ||
            !userForm.email.trim()
        ) {
            setUserError(
                "Preencha nome e e-mail."
            );

            return;
        }


        if (
            userForm.departmentIds
                .length === 0
        ) {
            setUserError(
                "Selecione pelo menos um departamento."
            );

            return;
        }


        if (
            !userForm.id &&
            !userForm.password
        ) {
            setUserError(
                "Informe uma senha para o novo usuário."
            );

            return;
        }


        setSavingUser(true);
        setUserError("");


        try {
            if (userForm.id) {
                await updateUser({
                    id:
                        userForm.id,

                    name:
                        userForm.name.trim(),

                    email:
                        userForm.email.trim(),

                    role:
                        userForm.role,

                    departmentIds:
                        userForm.departmentIds,
                });


                await loadUsers(
                    page,
                    search
                );
            } else {
                await createUser({
                    name:
                        userForm.name.trim(),

                    email:
                        userForm.email.trim(),

                    password:
                        userForm.password,

                    role:
                        userForm.role,

                    departmentIds:
                        userForm.departmentIds,
                });


                setPage(1);

                await loadUsers(
                    1,
                    search
                );
            }


            setUserModalOpen(
                false
            );
        } catch (error) {
            console.error(
                "Erro ao salvar usuário:",
                error
            );

            setUserError(
                "Não foi possível salvar o usuário."
            );
        } finally {
            setSavingUser(false);
        }
    }


    function handleDeleteUser(
        user: AdminUser
    ) {
        window.alert(
            `A exclusão de "${user.name}" ainda não foi implementada no backend.`
        );
    }


    function openCreateDepartment() {
        setDepartmentForm(
            EMPTY_DEPARTMENT_FORM
        );

        setDepartmentError("");

        setDepartmentModalOpen(
            true
        );
    }


    function openEditDepartment(
        department: Department
    ) {
        setDepartmentForm({
            id:
                department.id,

            name:
                department.name,
        });

        setDepartmentError("");

        setDepartmentModalOpen(
            true
        );
    }


    async function handleSaveDepartment() {
        const name =
            departmentForm.name.trim();


        if (!name) {
            setDepartmentError(
                "Informe o nome do departamento."
            );

            return;
        }


        setSavingDepartment(true);

        setDepartmentError("");


        try {
            if (departmentForm.id) {
                await updateDepartment(
                    departmentForm.id,
                    name
                );
            } else {
                await createDepartment(
                    name
                );
            }


            const data =
                await getDepartments();


            setDepartments(
                data ?? []
            );


            setDepartmentModalOpen(
                false
            );
        } catch (error) {
            console.error(
                "Erro ao salvar departamento:",
                error
            );

            setDepartmentError(
                departmentForm.id
                    ? "Não foi possível atualizar o departamento."
                    : "Não foi possível criar o departamento."
            );
        } finally {
            setSavingDepartment(
                false
            );
        }
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


        try {
            await deleteDepartment(
                department.id
            );


            const data =
                await getDepartments();


            setDepartments(
                data ?? []
            );
        } catch (error) {
            console.error(
                "Erro ao excluir departamento:",
                error
            );

            window.alert(
                "Não foi possível excluir o departamento."
            );
        }
    }


    return (
        <div className={styles.page}>
            <header
                className={
                    styles.header
                }
            >
                <div>
                    <h1>
                        Administração
                    </h1>

                    <p>
                        Gerencie usuários,
                        permissões e departamentos
                        do RapidWiki.
                    </p>
                </div>
            </header>


            <div
                className={
                    styles.tabs
                }
            >
                <button
                    type="button"
                    data-active={
                        activeTab ===
                        "users"
                    }
                    onClick={() => {
                        setActiveTab(
                            "users"
                        );

                        setSearch("");

                        setPage(1);
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


            <div
                className={
                    styles.toolbar
                }
            >
                <div
                    className={
                        styles.search
                    }
                >
                    <Search size={15} />

                    <input
                        value={search}
                        onChange={(
                            event
                        ) =>
                            handleSearchChange(
                                event.target.value
                            )
                        }
                        placeholder={
                            activeTab ===
                            "users"
                                ? "Buscar usuário por nome..."
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


            {activeTab ===
            "users" ? (
                <>
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
                                Permissão
                            </span>

                            <span>
                                Departamentos
                            </span>

                            <span />
                        </div>


                        {loadingUsers ? (
                            <div
                                className={
                                    styles.panelMessage
                                }
                            >
                                Carregando usuários...
                            </div>
                        ) : users.length >
                          0 ? (
                            users.map(
                                (user) => (
                                    <div
                                        key={
                                            user.id
                                        }
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
                                                    .charAt(
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
                                            {
                                                user.role
                                            }
                                        </span>


                                        <div
                                            className={
                                                styles.departments
                                            }
                                        >
                                            {user
                                                .departments
                                                .length >
                                            0 ? (
                                                user.departments.map(
                                                    (
                                                        department
                                                    ) => (
                                                        <span
                                                            key={
                                                                department.id
                                                            }
                                                        >
                                                            {
                                                                department.name
                                                            }
                                                        </span>
                                                    )
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
                            )
                        ) : (
                            <div
                                className={
                                    styles.panelMessage
                                }
                            >
                                Nenhum usuário encontrado.
                            </div>
                        )}
                    </section>


                    {!loadingUsers &&
                        totalItems >
                            0 && (
                            <div
                                className={
                                    styles.pagination
                                }
                            >
                                <button
                                    type="button"
                                    disabled={
                                        page <=
                                        1
                                    }
                                    onClick={() =>
                                        setPage(
                                            (
                                                current
                                            ) =>
                                                current -
                                                1
                                        )
                                    }
                                >
                                    <ChevronLeft
                                        size={
                                            15
                                        }
                                    />

                                    Anterior
                                </button>

                                <span>
                                    Página{" "}
                                    {page} de{" "}
                                    {Math.max(
                                        totalPages,
                                        1
                                    )}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        page >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        setPage(
                                            (
                                                current
                                            ) =>
                                                current +
                                                1
                                        )
                                    }
                                >
                                    Próxima

                                    <ChevronRight
                                        size={
                                            15
                                        }
                                    />
                                </button>
                            </div>
                        )}
                </>
            ) : (
                <section
                    className={
                        styles.departmentGrid
                    }
                >
                    {loadingDepartments ? (
                        <div>
                            Carregando departamentos...
                        </div>
                    ) : (
                        filteredDepartments.map(
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
                        )
                    )}
                </section>
            )}


            {userModalOpen && (
                <div
                    className={
                        styles.modalBackdrop
                    }
                    onMouseDown={() => {
                        if (
                            !savingUser
                        ) {
                            setUserModalOpen(
                                false
                            );
                        }
                    }}
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
                                    dados, permissão
                                    e departamentos
                                    do usuário.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={
                                    savingUser
                                }
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


                            {!userForm.id && (
                                <label>
                                    Senha

                                    <input
                                        type="password"
                                        value={
                                            userForm.password
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setUserForm(
                                                (
                                                    current
                                                ) => ({
                                                    ...current,

                                                    password:
                                                        event
                                                            .target
                                                            .value,
                                                })
                                            )
                                        }
                                        placeholder="Senha inicial"
                                    />
                                </label>
                            )}


                            <label>
                                Permissão

                                <select
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
                                                        .value as UserRole,
                                            })
                                        )
                                    }
                                >
                                    <option value="User">
                                        User
                                    </option>

                                    <option value="Editor">
                                        Editor
                                    </option>

                                    <option value="Admin">
                                        Admin
                                    </option>
                                </select>
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


                            {userError && (
                                <div
                                    className={
                                        styles.error
                                    }
                                >
                                    {
                                        userError
                                    }
                                </div>
                            )}
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
                                disabled={
                                    savingUser
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
                                disabled={
                                    savingUser
                                }
                                onClick={
                                    handleSaveUser
                                }
                            >
                                {savingUser
                                    ? "Salvando..."
                                    : userForm.id
                                      ? "Salvar alterações"
                                      : "Criar usuário"}
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
                    onMouseDown={() => {
                        if (
                            !savingDepartment
                        ) {
                            setDepartmentModalOpen(
                                false
                            );
                        }
                    }}
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
                                disabled={
                                    savingDepartment
                                }
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
                                    disabled={
                                        savingDepartment
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


                            {departmentError && (
                                <div
                                    className={
                                        styles.error
                                    }
                                >
                                    {
                                        departmentError
                                    }
                                </div>
                            )}
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
                                disabled={
                                    savingDepartment
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
                                disabled={
                                    savingDepartment
                                }
                                onClick={
                                    handleSaveDepartment
                                }
                            >
                                {savingDepartment
                                    ? "Salvando..."
                                    : departmentForm.id
                                      ? "Salvar alterações"
                                      : "Criar departamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}