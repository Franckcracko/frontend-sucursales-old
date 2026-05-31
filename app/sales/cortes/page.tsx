'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from '@/lib/axios';
import { useBranchSelected } from '@/store/use-branch-store';
import { ResponseCut } from '@/types/sales';
import { Download, CalendarIcon, Loader2, ScissorsIcon, BanknoteIcon, CreditCardIcon, ReceiptIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    const [date, setDate] = useState('')
    const [cut, setCut] = useState<ResponseCut>({ movements: [], operations: [] })
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const branch = useBranchSelected(state => state.branch)

    const downloadCut = async () => {
        if (!date) return
        setIsDownloading(true);
        try {
            const url = `/sales/${branch}/cut/download?date=%27${date}%27`
            const response = await axios.get(url, {
                responseType: 'blob',
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement('a');
            link.href = downloadUrl;

            const contentDisposition = response.headers['content-disposition'];
            let filename = `Corte-${date}-${branch}.xlsx`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);

            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            toast.error("Error al descargar el corte");
            console.error("Error al obtener datos de ventas:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const fetchCut = async () => {
        if (!date) return
        setIsLoading(true);
        try {
            const url = `/sales/${branch}/cut?date=%27${date}%27`
            const { data } = await axios.get(url);
            setCut(data)
        } catch (error) {
            toast.error("Error al obtener datos de ventas");
            console.error("Error al obtener datos de ventas:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Corte de Ventas</h1>
                <p className="text-muted-foreground mt-1">
                    Sucursal <span className="font-medium text-foreground">{branch}</span>
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarIcon className="size-5" />
                        Seleccionar Fecha
                    </CardTitle>
                    <CardDescription>
                        Ingresa la fecha para obtener el corte de ventas del dia.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-64 space-y-2">
                            <label htmlFor="cutDate" className="text-sm font-medium leading-none">
                                Fecha del Corte
                            </label>
                            <Input
                                id="cutDate"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                aria-label="Fecha del corte"
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                onClick={fetchCut}
                                disabled={!date || isLoading}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Obteniendo...
                                    </>
                                ) : (
                                    <>
                                        <ScissorsIcon className="size-4" />
                                        Obtener Corte
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={downloadCut}
                                disabled={!date || isDownloading}
                                className="gap-2"
                            >
                                {isDownloading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Download className="size-4" />
                                )}
                                Descargar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {cut.operations.length > 0 && (
                <div className="grid gap-6">
                    {cut.operations.map((operation) => (
                        <Card key={operation.cashRegisterId}>
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">
                                            Resumen del Dia {new Date(operation.day).toLocaleDateString('es-MX', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Caja #{operation.cashRegisterId}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {operation.numberOfSales} venta{operation.numberOfSales !== 1 ? 's' : ''}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <Card className="border-muted">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <ReceiptIcon className="size-4" />
                                            Ventas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                                            <span className="font-semibold text-lg">Ventas Totales</span>
                                            <span className="font-bold text-lg text-primary">
                                                {formatCurrency(operation.cumulativeSales)}
                                            </span>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <BanknoteIcon className="size-4 text-muted-foreground" />
                                                    En Efectivo
                                                </span>
                                                <span>{formatCurrency(operation.cashSales)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <CreditCardIcon className="size-4 text-muted-foreground" />
                                                    Tarjeta de Credito
                                                </span>
                                                <span>{formatCurrency(operation.cardSales)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <ReceiptIcon className="size-4 text-muted-foreground" />
                                                    A Credito
                                                </span>
                                                <span>{formatCurrency(operation.creditSales)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="flex items-center gap-2">
                                                    <ReceiptIcon className="size-4 text-muted-foreground" />
                                                    Vales de Despensa
                                                </span>
                                                <span>{formatCurrency(operation.voucherSales)}</span>
                                            </div>
                                            {operation.transferSales !== undefined && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <ReceiptIcon className="size-4 text-muted-foreground" />
                                                        Transferencia
                                                    </span>
                                                    <span>{formatCurrency(operation.transferSales)}</span>
                                                </div>
                                            )}
                                            {operation.checkSales !== undefined && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="flex items-center gap-2">
                                                        <ReceiptIcon className="size-4 text-muted-foreground" />
                                                        Cheque
                                                    </span>
                                                    <span>{formatCurrency(operation.checkSales)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-sm text-destructive">
                                            <span>Devoluciones</span>
                                            <span>-{formatCurrency(operation.returnCardSales + (operation.returnsTransSales || 0) + (operation.returnsCheckSales || 0))}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-muted">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <BanknoteIcon className="size-4" />
                                            Resumen Financiero
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                                            <span className="font-semibold">Ganancia</span>
                                            <span className="font-bold text-xl text-green-600 dark:text-green-400">
                                                {formatCurrency(operation.cumulativeProfit)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-3 rounded-lg border">
                                            <span className="font-semibold">Numero de Ventas</span>
                                            <Badge variant="secondary">{operation.numberOfSales}</Badge>
                                        </div>

                                        <div className="flex justify-between items-center p-3 rounded-lg border border-destructive/50 bg-destructive/5">
                                            <span className="font-semibold text-destructive">Comisiones por Tarjeta</span>
                                            <span className="font-semibold text-destructive">
                                                -{formatCurrency(operation.cardCommissions)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    ))}

                    {cut.movements.length > 0 && (
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">Movimientos del Corte</CardTitle>
                                <CardDescription>
                                    {cut.movements.length} movimiento{cut.movements.length !== 1 ? 's' : ''} registrado{cut.movements.length !== 1 ? 's' : ''}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {cut.movements.map((movement) => (
                                        <div
                                            key={movement.id}
                                            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-sm">
                                                        {movement.description}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {movement.id}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={
                                                        movement.type === 'ADD_STOCK' ? 'default' :
                                                        movement.type === 'DELETE_STOCK' ? 'destructive' :
                                                        'secondary'
                                                    }
                                                    className="shrink-0"
                                                >
                                                    {movement.type === 'ADD_STOCK' ? '+' :
                                                     movement.type === 'DELETE_STOCK' ? '-' :
                                                     movement.type}
                                                </Badge>
                                            </div>
                                            <p className="mt-2 text-lg font-semibold">
                                                {formatCurrency(movement.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {!isLoading && cut.operations.length === 0 && date && (
                <Card className="py-12">
                    <CardContent className="text-center text-muted-foreground">
                        <ScissorsIcon className="size-12 mx-auto mb-4 opacity-30" />
                        <p>No hay datos de corte para la fecha seleccionada.</p>
                        <p className="text-sm mt-1">Intenta con otra fecha o genera un nuevo corte.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}