"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, type UserSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";

interface UserFormProps {
  initialData?: User | null;
  isSubmitting?: boolean;
  onSubmit: (payload: UserSchema) => Promise<void>;
  onCancel?: () => void;
}

export function UserForm({ initialData, isSubmitting, onSubmit, onCancel }: UserFormProps) {
  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      role: initialData?.role ?? "",
      status: initialData?.status ?? "active"
    }
  });

  React.useEffect(() => {
    form.reset({
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      role: initialData?.role ?? "",
      status: initialData?.status ?? "active"
    });
  }, [form, initialData]);

  const { formState } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit User" : "Create User"}</CardTitle>
      </CardHeader>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
          if (!initialData) {
            form.reset({ name: "", email: "", role: "", status: "active" });
          }
        })}
      >
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Full name
            </label>
            <Input id="name" placeholder="Jane Doe" {...form.register("name")} />
            {formState.errors.name && (
              <p className="text-xs text-destructive">{formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email address
            </label>
            <Input id="email" type="email" placeholder="jane@company.com" {...form.register("email")} />
            {formState.errors.email && (
              <p className="text-xs text-destructive">{formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="role">
              Role
            </label>
            <Input id="role" placeholder="Product Manager" {...form.register("role")} />
            {formState.errors.role && (
              <p className="text-xs text-destructive">{formState.errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("status")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {formState.errors.status && (
              <p className="text-xs text-destructive">{formState.errors.status.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update User" : "Create User"}
          </Button>
          {initialData && onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
