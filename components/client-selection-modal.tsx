"use client";

import * as React from "react";
import { Check, Search, Users, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Client {
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
}

interface ClientSelectionModalProps {
  clients: Client[];
  selectedClients: string[];
  onSelectedClientsChange: (clients: string[]) => void;
  trigger?: React.ReactNode;
}

export function ClientSelectionModal({
  clients,
  selectedClients,
  onSelectedClientsChange,
  trigger,
}: ClientSelectionModalProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [localSelected, setLocalSelected] = React.useState<string[]>(selectedClients);

  React.useEffect(() => {
    setLocalSelected(selectedClients);
  }, [selectedClients]);

  const filteredClients = React.useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter((client) =>
      client.sales[0]?.name.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const toggleClient = React.useCallback((clientName: string) => {
    setLocalSelected((prev) => {
      if (prev.includes(clientName)) {
        return prev.filter((c) => c !== clientName);
      }
      return [...prev, clientName];
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    if (localSelected.length === filteredClients.length) {
      setLocalSelected([]);
    } else {
      setLocalSelected(filteredClients.map((c) => c.sales[0]?.name).filter(Boolean) as string[]);
    }
  }, [filteredClients, localSelected.length]);

  const handleConfirm = () => {
    onSelectedClientsChange(localSelected);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalSelected(selectedClients);
      setSearchQuery("");
    }
    setOpen(newOpen);
  };

  const selectedCount = localSelected.length;
  const totalCount = clients.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Users className="size-4" />
            {selectedCount > 0 ? (
              <span className="flex items-center gap-2">
                {selectedCount} cliente{selectedCount !== 1 ? "s" : ""} seleccionado{selectedCount !== 1 ? "s" : ""}
              </span>
            ) : (
              "Seleccionar clientes"
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Seleccionar Clientes
          </DialogTitle>
          <DialogDescription>
            Marca los clientes para los que deseas generar el reporte de cobranza.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Buscar cliente"
          />
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
<span>
                {selectedCount} de {totalCount} seleccionado{totalCount !== 1 ? "s" : ""}
              </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAll}
            className="text-xs h-7 px-2"
          >
            {selectedCount === totalCount ? "Deseleccionar todo" : "Seleccionar todo"}
          </Button>
        </div>

        <Separator />

        <ScrollArea className="flex-1 -mx-2 px-2">
          {filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="size-10 text-muted-foreground mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No se encontraron clientes" : "No hay clientes disponibles"}
              </p>
            </div>
          ) : (
            <div className="space-y-1" role="listbox" aria-label="Lista de clientes">
              {filteredClients.map((client) => {
                const clientName = client.sales[0]?.name || `Cliente ${client.clientID}`;
                const isSelected = localSelected.includes(clientName);

                return (
                  <button
                    key={client.clientID}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => toggleClient(clientName)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isSelected && "bg-primary/10 text-primary"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-sm border transition-all duration-150",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && <Check className="size-3.5" />}
                    </div>
                    <span className="flex-1 truncate">{clientName}</span>
                    {client.sales[0]?.pending !== undefined && client.sales[0].pending > 0 && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        ${client.sales[0].pending}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {localSelected.slice(0, 3).map((name) => (
              <Badge key={name} variant="secondary" className="gap-1 pr-1">
                {name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleClient(name);
                  }}
                  className="ml-1 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-1"
                  aria-label={`Quitar ${name}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            {selectedCount > 3 && (
              <Badge variant="secondary" className="gap-1">
                +{selectedCount - 3} más
              </Badge>
            )}
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Aplicar ({selectedCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}