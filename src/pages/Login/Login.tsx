import {
    useEffect,
    useState,
    type FormEvent,
} from "react";

import {
    BookOpen,
    Eye,
    EyeOff,
} from "lucide-react";

import { useNavigate } from "react-router";

import { useAuth } from "@/hooks/useAuth";

import styles from "./Login.module.css";


export function Login() {
    const navigate = useNavigate();

    const {
        login,
        isAuthenticated,
        isLoading,
    } = useAuth();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {
        if (
            !isLoading &&
            isAuthenticated
        ) {
            navigate("/", {
                replace: true,
            });
        }
    }, [
        isAuthenticated,
        isLoading,
        navigate,
    ]);


    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        const normalizedEmail =
            email.trim();

        if (
            !normalizedEmail ||
            !password
        ) {
            setError(
                "Preencha o e-mail e a senha."
            );

            return;
        }

        setLoading(true);

        try {
            await login(
                normalizedEmail,
                password
            );

            navigate("/", {
                replace: true,
            });
        } catch {
            setError(
                "E-mail ou senha inválidos."
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.brand}>
                        <BookOpen size={20} />

                        <span>
                            RapidWiki
                        </span>
                    </div>

                    <div
                        className={
                            styles.introduction
                        }
                    >
                        <h1>
                            Acesse sua conta
                        </h1>

                        <p>
                            Entre para acessar a base
                            de conhecimento.
                        </p>
                    </div>
                </header>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <div className={styles.field}>
                        <label htmlFor="email">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="nome@empresa.com"
                            autoComplete="email"
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">
                            Senha
                        </label>

                        <div
                            className={
                                styles.passwordInput
                            }
                        >
                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Sua senha"
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className={
                                    styles.passwordButton
                                }
                                onClick={() =>
                                    setShowPassword(
                                        (current) =>
                                            !current
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Ocultar senha"
                                        : "Mostrar senha"
                                }
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className={
                            styles.submitButton
                        }
                        disabled={
                            loading ||
                            isLoading
                        }
                    >
                        {loading
                            ? "Entrando..."
                            : "Entrar"}
                    </button>
                </form>
            </div>
        </main>
    );
}