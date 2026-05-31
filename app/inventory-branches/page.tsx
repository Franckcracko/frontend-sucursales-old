'use client';

import { DownloadButton } from '@/components/download-report-branch-button';
import { Input } from '@/components/ui/input';
import { useBranchSelected } from '@/store/use-branch-store';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

export default function Page() {
    const branch = useBranchSelected(state => state.branch)
    const [initDate, setInitDate] = useState('')
    const [endDate, setEndDate] = useState('')

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Reporte de Inventario de Sucursal</h1>
                <p className="text-muted-foreground mt-1">
                    Sucursal <span className="font-medium text-foreground">{branch}</span>
                </p>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarIcon className="size-5" />
                        Rango de Fechas
                    </CardTitle>
                    <CardDescription>
                        Selecciona el periodo para generar el reporte de inventario.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 max-w-md">
                        <div className="space-y-2">
                            <label htmlFor="initDate" className="text-sm font-medium leading-none">
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
                            <label htmlFor="endDate" className="text-sm font-medium leading-none">
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

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                                {initDate && endDate ? (
                                    <>Reporte del {new Date(initDate).toLocaleDateString('es-MX')} al {new Date(endDate).toLocaleDateString('es-MX')}</>
                                ) : (
                                    "Selecciona un rango de fechas para generar el reporte."
                                )}
                            </p>
                        </div>
                        <DownloadButton endDate={endDate} initDate={initDate} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}