"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TestSearch from "@/components/test-search";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RegisterResponse = {
  failure?: string;
  success?: string;
  mrnumber?: string | number;
};

export default function RegisterPatient() {
  const [found, setFound] = useState<string[]>([]);
  const [priceSelect, setPriceSelect] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const targetref = useRef<HTMLDivElement>(null);
  const [resTwo, setResTwo] = useState<RegisterResponse>();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    cnic: "",
    gender: "male",
    dob: "",
    mobileNumber: "",
    searchResult: "",
    priceofsearch: 0,
    discount: "",
    received: "",
    labnumber: "",
    reference: "",
  });
  const formFields = [
    { label: "Name", value: formData.name },
    { label: "Age", value: formData.age },
    { label: "Email", value: formData.email },
    { label: "Mobile Number", value: formData.mobileNumber },
    { label: "CNIC", value: formData.cnic },
    { label: "Date Of Birth", value: formData.dob },
    { label: "Gender", value: formData.gender },
    { label: "Reference", value: formData.reference },
    { label: "Lab Number", value: formData.labnumber },
  ];

  const handleSearchSelect = (selectedTest: { key: string; price: number }) => {
    setFormData({
      ...formData,
      searchResult: selectedTest.key,
      priceofsearch: selectedTest.price,
    });
  };

  function calSum(data: number[]) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    return sum;
  }

  const options = {
    method: "open" as const,
    resolution: Resolution.MEDIUM,
    page: {
      margin: Margin.SMALL,
      format: "letter" as const,
      orientation: "landscape" as const,
    },
    canvas: {
      mimeType: "image/png" as const,
      qualityRatio: 1,
    },
    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };

  function formTwoSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const fetchData = async () => {
      const priceobj = [];
      const testobj = [];
      for (let i = 0; i < priceSelect.length; i++) {
        priceobj.push({ price: priceSelect[i] });
        testobj.push({ name: found[i] });
      }
      try {
        const dataposter = await api.post<RegisterResponse>("/logUser", {
          ...formData,
          tests: testobj,
          testPrices: priceobj,
        });
        const response = dataposter.data;
        setResTwo(response);
        if (response.failure) {
          toast.error(response.failure);
        } else if (response.success) {
          toast.success(response.success);
        }
      } catch (error) {
        console.log(error);
        toast.error("An Error Ocurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setFound([]);
    setPriceSelect([]);
  }

  function checkEmail() {
    if (
      formData.email.includes("@") &&
      formData.email.includes(".com") &&
      formData.email.length > 5
    ) {
      return { success: "Valid" };
    }
    return { failure: "*Invalid Email" };
  }

  const canSubmit =
    Boolean(checkEmail().success) &&
    formData.mobileNumber.length === 11 &&
    formData.name.length >= 3 &&
    formData.cnic.length === 13;

  const getTargetElement = () => document.getElementById("content-id");

  const total = calSum(priceSelect) * ((100 - Number(formData.discount || 0)) / 100);
  const balance = total - Number(formData.received || 0);

  return (
    <div className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Patient information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={formTwoSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                />
                {checkEmail().failure ? (
                  <p className="text-sm text-destructive">{checkEmail().failure}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
                {formData.name.length >= 3 ? null : (
                  <p className="text-sm text-destructive">Name must be at least 3 letters</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile number</Label>
                <Input
                  id="mobileNumber"
                  type="number"
                  required
                  value={formData.mobileNumber}
                  onChange={(event) =>
                    setFormData({ ...formData, mobileNumber: event.target.value })
                  }
                />
                {formData.mobileNumber.length === 11 ? null : (
                  <p className="text-sm text-destructive">Invalid Phone Number</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnic">CNIC</Label>
                <Input
                  id="cnic"
                  type="number"
                  required
                  value={formData.cnic}
                  onChange={(event) => setFormData({ ...formData, cnic: event.target.value })}
                />
                {formData.cnic.length === 13 ? null : (
                  <p className="text-sm text-destructive">Invalid CNIC</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={formData.age}
                  onChange={(event) => setFormData({ ...formData, age: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(event) => setFormData({ ...formData, dob: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      setFormData({ ...formData, gender: value });
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount %</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discount}
                  onChange={(event) => setFormData({ ...formData, discount: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(event) => setFormData({ ...formData, reference: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="labnumber">Lab number</Label>
                <Input
                  id="labnumber"
                  type="number"
                  required
                  value={formData.labnumber}
                  onChange={(event) => setFormData({ ...formData, labnumber: event.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="received">Amount received</Label>
                <Input
                  id="received"
                  type="number"
                  value={formData.received}
                  onChange={(event) => setFormData({ ...formData, received: event.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!canSubmit || loading}>
                {loading ? <Loader2 className="animate-spin" /> : null}
                Submit
              </Button>
              <Button variant="link" nativeButton={false} render={<Link href="/seeAll" />}>
                See All Data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Search for scans</Label>
            <TestSearch onSelectRecord={handleSearchSelect} />
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                if (!formData.searchResult) return;
                setFound((prevVal) => [...prevVal, formData.searchResult]);
                setPriceSelect((prevVal) => [...prevVal, formData.priceofsearch]);
              }}
            >
              Add to Invoice
            </Button>
          </div>
          <div className="space-y-2">
            {found.map((oneFound, index) => (
              <div key={oneFound + index} className="flex justify-between text-sm">
                <span>
                  {index + 1}. {oneFound}
                </span>
                <span>Rs {priceSelect[index]}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{formData.discount ? formData.discount : 0}%</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
            <div className="flex justify-between">
              <span>Received</span>
              <span>Rs {formData.received ? formData.received : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Balance</span>
              <span>Rs {balance}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setFound([])}>
              Delete All
            </Button>
            <Button type="button" onClick={() => generatePDF(getTargetElement, options)}>
              Generate PDF
            </Button>
          </div>

          <div
            id="content-id"
            ref={targetref}
            className="rounded-lg border bg-white p-6 text-black"
          >
            <div className="mb-4 flex items-center justify-between">
              <p>MR Number: {resTwo?.mrnumber ?? ""}</p>
              <img alt="logo" className="h-12" src="/esalab/ahk-removebg-preview.png" />
              <p>
                Date: {new Date().getDate() + "/ " + new Date().getMonth() + "/ " + new Date().getFullYear()}
              </p>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              {formFields.map((field) => (
                <p key={field.label}>
                  <strong>{field.label}:</strong> {field.value}
                </p>
              ))}
            </div>
            <p className="mb-2 font-bold">Examination:</p>
            {found.map((oneFound, index) => (
              <div key={oneFound + index} className="flex justify-between text-sm">
                <span>
                  {index + 1}. {oneFound}
                </span>
                <span>RS {priceSelect[index]}</span>
              </div>
            ))}
            <div className="mt-4 text-sm">
              <p>Discount: {formData.discount ? formData.discount : 0}%</p>
              <p>Total: Rs {total}</p>
              <p>Received: Rs {formData.received ? formData.received : 0}</p>
              <p>Balance: Rs {balance}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
