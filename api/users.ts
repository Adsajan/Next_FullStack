import type { User, UserPayload } from "@/types/user";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message = (error?.message as string) || "Request failed.";
    throw new Error(message);
  }
  const data = await response.json();
  return data.data as T;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users", { cache: "no-store" });
  return handleResponse<User[]>(response);
}

export async function createUser(payload: UserPayload): Promise<User> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse<User>(response);
}

export async function updateUser(id: string, payload: UserPayload): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handleResponse<User>(response);
}

export async function deleteUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE"
  });
  return handleResponse<User>(response);
}
