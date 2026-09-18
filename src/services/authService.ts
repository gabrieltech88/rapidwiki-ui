import { api } from "@/api/api";

import type { User } from "@/types/User";

interface SignInResponse {
    id: string;
    role: string;
}

interface CurrentUserResponse {
    id: string;
    nome: string;
    role: string;
    deveAlterarSenha: boolean;
}

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

export async function signIn(
    email: string,
    password: string
): Promise<User> {
    await api.post<SignInResponse>(
        "/auth/sign_in",
        {
            email,
            password,
        }
    );

    return await getCurrentUser();
}

export async function getCurrentUser(): Promise<User> {
    const response = await api.get<CurrentUserResponse>(
        "/auth/me"
    );

    return {
        id: response.data.id,
        name: response.data.nome,
        role: response.data.role,
        mustChangePassword: response.data.deveAlterarSenha,
    };
}

export async function changePassword(
    input: ChangePasswordInput
): Promise<void> {
    await api.put(
        "/auth/change_password",
        {
            senhaAtual: input.currentPassword,
            novaSenha: input.newPassword,
        }
    );
}

export async function signOut(): Promise<void> {
    await api.post(
        "/auth/sign_out"
    );
}