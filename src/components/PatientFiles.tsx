"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SearchPatient = {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  mrnumber: string;
};

export default function PatientFiles() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPatient[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get<SearchPatient[]>("/patients/search", {
          params: { q: query.trim() },
        });
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Patient files</h1>
        <p className="text-sm text-muted-foreground">
          Search a patient, then open their page to view files and create a portal login.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search patients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, mobile, email, or MR number"
              className="pl-9"
            />
          </div>
          {searching ? (
            <p className="text-sm text-muted-foreground">Searching...</p>
          ) : null}
          {results.length > 0 ? (
            <ul className="divide-y rounded-lg border">
              {results.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/seeAll/${row.id}`}
                    className="flex flex-col gap-1 px-3 py-3 hover:bg-muted/50"
                  >
                    <span className="font-medium text-primary">{row.name}</span>
                    <span className="text-sm text-muted-foreground">
                      MR {row.mrnumber} · {row.mobileNumber} · {row.email}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.trim() && !searching ? (
            <p className="text-sm text-muted-foreground">No patients found.</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Search and select a patient to open their information page.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
