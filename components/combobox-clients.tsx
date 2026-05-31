"use client";

import * as React from "react";
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

export function ComboboxClients({
    clients,
    value,
    onChangeValue
}: {
    clients: {
        clientID: number;
        sales: {
            note: number;
            name: string;
            date: Date;
            expiration: Date;
            amount: number;
            payed: number;
            pending: number;
        }[];
    }[];
    value: string[];
    onChangeValue: (value: string) => void
}) {
    const [open, setOpen] = React.useState(false);

    // Encuentra el cliente actualmente seleccionado
    const selectedClients = value
        .filter(v => {
            const foundClient = clients.findIndex(
                (client) => client.sales[0].name === v
            )
            return foundClient !== -1
        })
        .map(v => clients.find(client => client.sales[0].name === v)!.sales[0].name);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between mb-6 truncate"
                >
                    {selectedClients.length > 0
                        ? selectedClients.length > 1 ? `${selectedClients[0]}...`: selectedClients[0]
                            : "Selecciona un cliente..."}
                    <ChevronsUpDown className="opacity-50 h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar cliente..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => {
                                const label = client.sales[0].name; // 👈 Nombre del primer sale
                                const id = String(client.clientID); // 👈 ID del cliente

                                return (
                                    <CommandItem
                                        key={id}
                                        value={label}
                                        onSelect={(currentValue) => {
                                            console.log(currentValue)
                                            onChangeValue(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value.findIndex(v => v === label) !== -1 ? "opacity-100" : "opacity-0"
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
