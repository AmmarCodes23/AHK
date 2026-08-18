"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PatientRow = {
  id?: string;
  name?: string;
  mobileNumber?: string | number;
  email?: string;
  mrnumber?: string;
};

export default function AllData() {
  const [allData, setAllData] = useState<PatientRow[]>();
  const [loading, setloading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const dataposter = await api.get<PatientRow[]>("/getAllmrnumber");
        const response = dataposter.data;
        setAllData(Array.isArray(response) ? response : []);
      } catch (error) {
        console.log(error);
        setAllData([]);
      } finally {
        setloading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const rows = allData ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => {
      const haystack = [row.name, row.email, row.mobileNumber, row.mrnumber]
        .map((value) => String(value ?? "").toLowerCase())
        .join(" ");
      return haystack.includes(needle);
    });
  }, [allData, query]);

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader className="gap-4">
          <CardTitle>All patients</CardTitle>
          <div className="relative max-w-md">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by name, mobile, email, or MR number"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>MR Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((val) => (
                  <TableRow key={String(val.id ?? val.mrnumber) + val.email} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/seeAll/${val.id}`} className="font-medium text-primary hover:underline">
                        {val.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/seeAll/${val.id}`} className="block">
                        {val.mobileNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/seeAll/${val.id}`} className="block">
                        {val.email}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/seeAll/${val.id}`} className="block font-mono">
                        {val.mrnumber}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No Data To Show</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
