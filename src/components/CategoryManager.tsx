"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Category = {
  id: string;
  name: string;
  _count?: { files: number };
};

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<Category[]>("/categories");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditing(null);
    setName("");
    setOpen(true);
  }

  function startEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await api.patch<{ success?: string; failure?: string }>(
          `/categories/${editing.id}`,
          { name }
        );
        if (res.data.failure) toast.error(res.data.failure);
        else toast.success(res.data.success || "Category updated");
      } else {
        const res = await api.post<{ success?: string; failure?: string }>("/categories", {
          name,
        });
        if (res.data.failure) toast.error(res.data.failure);
        else toast.success(res.data.success || "Category created");
      }
      setOpen(false);
      await load();
    } catch {
      toast.error("Could not save category");
    } finally {
      setSaving(false);
    }
  }

  async function remove(category: Category) {
    try {
      const res = await api.delete<{ success?: string; failure?: string }>(
        `/categories/${category.id}`
      );
      if (res.data.failure) toast.error(res.data.failure);
      else toast.success(res.data.success || "Category deleted");
      await load();
    } catch {
      toast.error("Could not delete category");
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>File categories</CardTitle>
          <Button onClick={startCreate}>
            <Plus />
            Add category
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No categories yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category._count?.files ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => startEdit(category)}>
                        <Pencil />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => remove(category)}>
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Rename category" : "New category"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={save}>
            <div className="space-y-2">
              <Label htmlFor="categoryName">Name</Label>
              <Input
                id="categoryName"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving || !name.trim()}>
                {saving ? <Loader2 className="animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
