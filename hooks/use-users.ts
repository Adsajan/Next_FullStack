"use client";

import * as React from "react";
import { toast } from "sonner";

import type { User, UserPayload } from "@/types/user";
import { createUser, deleteUser, fetchUsers, updateUser } from "@/api/users";

export function useUsers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadUsers = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load users.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = React.useCallback(async (payload: UserPayload) => {
    setIsSubmitting(true);
    try {
      const created = await createUser(payload);
      setUsers((prev) => [created, ...prev]);
      toast.success("User created.");
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user.";
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const editUser = React.useCallback(async (id: string, payload: UserPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await updateUser(id, payload);
      setUsers((prev) => prev.map((user) => (user._id === id ? updated : user)));
      toast.success("User updated.");
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update user.";
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeUser = React.useCallback(async (id: string) => {
    setIsSubmitting(true);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User deleted.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete user.";
      toast.error(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    users,
    isLoading,
    isSubmitting,
    error,
    refresh: loadUsers,
    addUser,
    editUser,
    removeUser
  };
}
