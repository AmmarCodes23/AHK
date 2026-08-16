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

type BalanceRow = {
  name?: string;
  mobileNumber?: number;
  email?: string;
  received?: number;
};

export default function BalanceData() {
  const [allData, setAllData] = useState<BalanceRow[]>();
  const [loading, setloading] = useState(false);

  function calSum(data: BalanceRow[]) {
    if (data) {
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        sum += data[i].received || 0;
      }
      return sum;
    }
    return 0;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);
        const dataposter = await api.get<BalanceRow[]>("/getAllmrnumber");
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
    <div className="container mx-auto space-y-6 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Total earned</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            Rs {allData ? calSum(allData) : 0}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Balance sheet</CardTitle>
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
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allData.map((val) => (
                  <TableRow key={String(val.email) + String(val.mobileNumber)}>
                    <TableCell>{val.name}</TableCell>
                    <TableCell>{val.mobileNumber}</TableCell>
                    <TableCell>{val.email}</TableCell>
                    <TableCell>{val.received}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-8 text-center text-muted-foreground">No Data to Show</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
