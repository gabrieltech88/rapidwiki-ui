import { usersMock } from "@/mocks/users";
import type { User } from "@/types/User";

export async function getUsers(): Promise<User[]> {
    return usersMock;
}