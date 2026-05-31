"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Supplier } from "@/types/inventory";

export function ComboboxSuppliers({
    suppliers,
    value,
    onChangeValue,
}: {
    suppliers: Supplier[];
    value: string;
    onChangeValue: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const selectedSupplier = suppliers.find(
        (client) => client.id === value
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild >
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between mb-6"
                >
                    {selectedSupplier
                        ? selectedSupplier.name
                        : "Selecciona un proveedor..."}
                    <ChevronsUpDown className="opacity-50 h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar proveedor..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No se encontraron proveedores.</CommandEmpty>
                        <CommandGroup>
                            {suppliers.map((supplier) => {
                                const label = supplier.name; // 👈 Nombre del primer sale
                                const id = supplier.id; // 👈 ID del cliente

                                return (
                                    <CommandItem
                                        key={id}
                                        value={id}
                                        onSelect={(currentValue) => {
                                            onChangeValue(currentValue === value ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
