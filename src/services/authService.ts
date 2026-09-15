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
    const response =
        await api.get<CurrentUserResponse>(
            "/auth/me"
        );

    return {
        id: response.data.id,
        name: response.data.nome,
        role: response.data.role,
    };
}


export async function signOut(): Promise<void> {
    await api.post(
        "/auth/sign_out"
    );
}