'use client';

import axios from '@/lib/axios';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useBranchSelected } from '@/store/use-branch-store';
import { useEffect, useState, useCallback } from 'react';
import { DownloadButton } from '@/components/download-sales-button';
import { Input } from '@/components/ui/input';
import { formatDateToISO, getInitialDateRange } from '@/utils/date';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, DownloadIcon, BarChart3Icon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const branch = useBranchSelected(state => state.branch);
    const [initDate, setInitDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const fetchData = useCallback(async (currentBranch: string, range: { initDate: string; endDate: string }) => {
        const { endDate, initDate } = range

        if (!currentBranch || !initDate || !endDate) {
            console.log("Faltan parametros (sucursal o rango de fechas).");
            return;
        }

        setIsLoading(true);

        try {
            const url = `/sales/${currentBranch}?start=${initDate}&end=${endDate}`;
            const res = await axios.get(url);
            setData(res.data.data);
        } catch (error) {
            console.error("Error al obtener datos de ventas:", error);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const { from, to } = getInitialDateRange()
        setInitDate(formatDateToISO(from))
        setEndDate(formatDateToISO(to))
    }, [])

    useEffect(() => {
        fetchData(branch, { endDate, initDate });
    }, [branch, fetchData, endDate, initDate]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Reporte de Ventas</h1>
                <p className="text-muted-foreground mt-1">
                    Sucursal <span className="font-medium text-foreground">{branch}</span>
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CalendarIcon className="size-5" />
                            Rango de Fechas
                        </CardTitle>
                        <CardDescription>
                            Selecciona el periodo para filtrar las ventas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                        <div className="grid gap-4 sm:grid-cols-2 flex-1">
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
                    </CardContent>
                </Card>

                <Card className="lg:col-start-2 lg:row-start-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <DownloadIcon className="size-5" />
                            Descargar
                        </CardTitle>
                        <CardDescription>
                            Exporta los datos a Excel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <DownloadButton type='sales' branch={branch} endDate={endDate} initDate={initDate} />
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <BarChart3Icon className="size-5" />
                        Detalle de Ventas
                    </CardTitle>
                    <CardDescription>
                        {data.length} venta{data.length !== 1 ? "s" : ""} encontrada{data.length !== 1 ? "s" : ""} en el periodo seleccionado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {isLoading ? (
                        <div className="space-y-4 px-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <BarChart3Icon className="size-12 mx-auto mb-3 opacity-30" />
                            <p>No hay ventas registradas en este periodo.</p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}