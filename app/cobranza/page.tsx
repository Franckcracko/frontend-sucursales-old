'use client';

import { useState, useMemo } from 'react';
import { DownloadButton } from '@/components/download-cobranza-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, DownloadIcon, Loader2, SearchIcon, UsersIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ClientSelectionModal } from '@/components/client-selection-modal';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 10;

export default function Page() {
    const [initDate, setInitDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [clients, setClients] = useState<{
        clientID: number,
        sales: {
            note: number,
            name: string,
            date: Date,
            expiration: Date,
            amount: number,
            payed: number,
            pending: number
        }[]
    }[]>([])

    const [hasSearched, setHasSearched] = useState(false)

    const onSubmit = async () => {
        if (!initDate || !endDate) return

        setIsSearching(true);
        setHasSearched(true);
        setCurrentPage(1);
        setSearchQuery('');

        try {
            const { data } = await axios.get(`/wholesale/debits?start=${initDate}&end=${endDate}`)
            setClients(data.clients || [])
        } catch (error) {
            console.log(error)
            setClients([])
        } finally {
            setIsSearching(false);
        }
    }

    const filteredClients = useMemo(() => {
        if (!searchQuery.trim()) return clients;
        const query = searchQuery.toLowerCase();
        return clients.filter((client) =>
            client.sales[0]?.name.toLowerCase().includes(query)
        );
    }, [clients, searchQuery]);

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredClients.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredClients, currentPage]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Reporte de Cobranza</h1>
                <p className="text-muted-foreground mt-1">
                    Filtra por fechas y selecciona clientes para generar el reporte.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                <Card className="md:col-start-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CalendarIcon className="size-5" />
                            Rango de Fechas
                        </CardTitle>
                        <CardDescription>
                            Selecciona el periodo para buscar clientes con ventas pendientes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="initDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Fecha Inicio
                                </label>
                                <Input
                                    id="initDate"
                                    type="date"
                                    value={initDate}
                                    onChange={(e) => setInitDate(e.target.value)}
                                    aria-label="Fecha de inicio"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="endDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Fecha Final
                                </label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    aria-label="Fecha final"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={onSubmit}
                            disabled={!initDate || !endDate || isSearching}
                            className="w-full sm:w-auto gap-2"
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <SearchIcon className="size-4" />
                                    Buscar Clientes
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="md:col-start-2 md:row-start-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <UsersIcon className="size-5" />
                            Clientes
                        </CardTitle>
                        <CardDescription>
                            Selecciona los clientes para el reporte.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ClientSelectionModal
                            clients={clients}
                            selectedClients={selectedClients}
                            onSelectedClientsChange={setSelectedClients}
                        />
                        {selectedClients.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground font-medium">
                                    {selectedClients.length} cliente{selectedClients.length !== 1 ? "s" : ""} seleccionado{selectedClients.length !== 1 ? "s" : ""}
                                </p>
                                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                    {selectedClients.slice(0, 5).map((name) => (
                                        <Badge key={name} variant="secondary" className="text-xs">
                                            {name}
                                        </Badge>
                                    ))}
                                    {selectedClients.length > 5 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{selectedClients.length - 5}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 md:col-start-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <DownloadIcon className="size-5" />
                            Descargar Reporte
                        </CardTitle>
                        <CardDescription>
                            Genera el archivo Excel con los datos de cobranza de los clientes seleccionados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                                {initDate && endDate ? (
                                    <>Reporte del {new Date(initDate).toLocaleDateString('es-MX')} al {new Date(endDate).toLocaleDateString('es-MX')}</>
                                ) : (
                                    "Selecciona un rango de fechas para continuar."
                                )}
                            </p>
                        </div>
                        <DownloadButton
                            endDate={endDate}
                            initDate={initDate}
                            clientIds={selectedClients}
                        />
                    </CardContent>
                </Card>

                {hasSearched && (
                    <Card className="md:col-span-2 animate-in fade-in-0 duration-300">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Resultados de la Busqueda</CardTitle>
                                    <CardDescription>
                                        {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} encontrado{filteredClients.length !== 1 ? "s" : ""}
                                        {searchQuery && ` para "${searchQuery}"`}
                                    </CardDescription>
                                </div>
                                {clients.length > 0 && (
                                    <div className="relative">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar cliente..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="pl-9 w-full sm:w-64"
                                            aria-label="Buscar cliente"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isSearching ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-12 w-full" />
                                    ))}
                                </div>
                            ) : clients.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <UsersIcon className="size-12 mx-auto mb-3 opacity-30" />
                                    <p>No se encontraron clientes con ventas pendientes en este periodo.</p>
                                </div>
                            ) : filteredClients.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <SearchIcon className="size-12 mx-auto mb-3 opacity-30" />
                                    <p>No hay clientes que coincidan con &quot;{searchQuery}&quot;</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        {paginatedClients.map((client) => {
                                            const sale = client.sales[0];
                                            if (!sale) return null;
                                            return (
                                                <div
                                                    key={client.clientID}
                                                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{sale.name}</span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {sale.note} ticket{sale.note !== 1 ? "s" : ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <Badge
                                                            variant={sale.pending > 0 ? "destructive" : "secondary"}
                                                            className="font-mono"
                                                        >
                                                            ${sale.pending.toFixed(2)}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            Pendiente
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between pt-4 mt-4 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredClients.length)} de {filteredClients.length}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="gap-1"
                                                >
                                                    <ChevronLeftIcon className="size-4" />
                                                    Anterior
                                                </Button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                        if (
                                                            page === 1 ||
                                                            page === totalPages ||
                                                            (page >= currentPage - 1 && page <= currentPage + 1)
                                                        ) {
                                                            return (
                                                                <Button
                                                                    key={page}
                                                                    variant={currentPage === page ? "default" : "ghost"}
                                                                    size="sm"
                                                                    onClick={() => setCurrentPage(page)}
                                                                    className="size-8"
                                                                >
                                                                    {page}
                                                                </Button>
                                                            );
                                                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                            return (
                                                                <span key={page} className="px-1 text-muted-foreground">
                                                                    ...
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="gap-1"
                                                >
                                                    Siguiente
                                                    <ChevronRightIcon className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}