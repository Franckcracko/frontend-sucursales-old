'use client';

import { useState } from 'react';
import { DownloadButton } from '@/components/download-report-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

export default function Page() {
    const [date, setDate] = useState('')

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Reporte de Inventario</h1>
                <p className="text-muted-foreground mt-1">
                    Genera reportes de inventario general.
                </p>
            </div>

            <Card className="max-w-md">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarIcon className="size-5" />
                        Seleccionar Fecha
                    </CardTitle>
                    <CardDescription>
                        Ingresa la fecha para generar el reporte.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="reportDate" className="text-sm font-medium leading-none">
                            Fecha del Reporte
                        </label>
                        <Input
                            id="reportDate"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            aria-label="Fecha del reporte"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                {date ? `Reporte de inventario al ${new Date(date).toLocaleDateString('es-MX')}` : "Selecciona una fecha para generar el reporte."}
                            </p>
                        </div>
                        <DownloadButton date={date} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}