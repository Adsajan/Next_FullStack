"use client";

import * as React from "react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/loading-state";
import { UserForm } from "@/components/users/user-form";
import { UserTable } from "@/components/users/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";
import { useUsers } from "@/hooks/use-users";

export default function UsersPage() {
  const { users, isLoading, isSubmitting, error, refresh, addUser, editUser, removeUser } = useUsers();
  const [editingUser, setEditingUser] = React.useState<User | null>(null);

  const handleSubmit = async (payload: { name: string; email: string; role: string; status: "active" | "inactive" }) => {
    if (editingUser) {
      await editUser(editingUser._id, payload);
      setEditingUser(null);
    } else {
      await addUser(payload);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this user? This action cannot be undone.");
    if (!confirmed) return;
    await removeUser(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Users"
        subtitle="Manage your team members and roles."
        actions={
          <Button variant="outline" onClick={refresh} disabled={isLoading}>
            Refresh
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <LoadingState label="Loading users..." />
              ) : (
                <UserTable
                  users={users}
                  isSubmitting={isSubmitting}
                  onEdit={setEditingUser}
                  onDelete={handleDelete}
                />
              )}
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <UserForm
            initialData={editingUser}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      </div>
    </div>
  );
}
