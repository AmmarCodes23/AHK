"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { testData } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type SearchRecord = {
  key: string;
  price: number;
};

const tests = Object.entries(testData).flatMap(([category, items]) =>
  Object.entries(items as Record<string, number>).map(([name, price]) => ({
    key: name,
    value: `${name} (${category}) - Rs. ${price}`,
    price,
  }))
);

export default function TestSearch({
  onSelectRecord,
}: {
  onSelectRecord: (record: SearchRecord) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-between font-normal">
            {selected || "Search scans..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 sm:w-80" align="start">
        <Command>
          <CommandInput placeholder="Search tests..." />
          <CommandList>
            <CommandEmpty>No test found.</CommandEmpty>
            <CommandGroup>
              {tests.map((test) => (
                <CommandItem
                  key={test.key}
                  value={test.value}
                  onSelect={() => {
                    setSelected(test.key);
                    onSelectRecord({ key: test.key, price: test.price });
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2", selected === test.key ? "opacity-100" : "opacity-0")} />
                  {test.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
