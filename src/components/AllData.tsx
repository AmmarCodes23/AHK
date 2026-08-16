"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  name?: string;
  mobileNumber?: number;
  email?: string;
  mrnumber?: string;
};

export default function AllData() {
  const [allData, setAllData] = useState<PatientRow[]>();
  const [loading, setloading] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>All patients</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : allData && allData.length > 0 ? (
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
                {allData.map((val) => (
                  <TableRow key={String(val.mrnumber) + val.email}>
                    <TableCell>{val.name}</TableCell>
                    <TableCell>{val.mobileNumber}</TableCell>
                    <TableCell>{val.email}</TableCell>
                    <TableCell>{val.mrnumber}</TableCell>
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
