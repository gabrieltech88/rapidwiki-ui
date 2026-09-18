import {
    useState,
    type FormEvent,
} from "react";

import {
    Eye,
    EyeOff,
    KeyRound,
} from "lucide-react";

import {
    Navigate,
} from "react-router";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

import { useAuth } from "@/hooks/useAuth";

import {
    changePassword,
} from "@/services/authService";

import styles from "./ChangePassword.module.css";

export function ChangePassword() {
    const {
        user,
        isAuthenticated,
        isLoading,
    } = useAuth();

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (!user?.mustChangePassword) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            setError(
                "Preencha todos os campos."
            );

            return;
        }

        if (
            newPassword !==
            confirmPassword
        ) {
            setError(
                "As novas senhas não coincidem."
            );

            return;
        }

        if (
            currentPassword ===
            newPassword
        ) {
            setError(
                "A nova senha deve ser diferente da senha atual."
            );

            return;
        }

        setSaving(true);
        setError("");

        try {
            await changePassword({
                currentPassword,
                newPassword,
            });

            window.location.replace("/");
        } catch (error) {
            console.error(
                "Erro ao alterar senha:",
                error
            );

            setError(
                "Não foi possível alterar a senha. Verifique a senha atual e os requisitos da nova senha."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <div className={styles.icon}>
                    <KeyRound size={22} />
                </div>

                <div className={styles.header}>
                    <h1>
                        Altere sua senha
                    </h1>

                    <p>
                        Por segurança, você precisa criar uma nova senha antes de continuar no RapidWiki.
                    </p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <label>
                        Senha atual

                        <div className={styles.passwordField}>
                            <input
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(event) =>
                                    setCurrentPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="current-password"
                                placeholder="Digite sua senha provisória"
                                disabled={saving}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        (current) =>
                                            !current
                                    )
                                }
                                tabIndex={-1}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </label>

                    <label>
                        Nova senha

                        <div className={styles.passwordField}>
                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                                placeholder="Digite sua nova senha"
                                disabled={saving}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (current) =>
                                            !current
                                    )
                                }
                                tabIndex={-1}
                            >
                                {showNewPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </label>

                    <label>
                        Confirmar nova senha

                        <div className={styles.passwordField}>
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(
                                        event.target.value
                                    )
                                }
                                autoComplete="new-password"
                                placeholder="Digite novamente a nova senha"
                                disabled={saving}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (current) =>
                                            !current
                                    )
                                }
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </label>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={saving}
                    >
                        {saving
                            ? "Alterando..."
                            : "Alterar senha"}
                    </button>
                </form>
            </section>
        </main>
    );
}