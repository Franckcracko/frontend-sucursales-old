'use client';

import axios from '@/lib/axios-inventory';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { Movement } from '@/types/movement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeftRightIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
    const [data, setData] = useState<Movement[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const url = `/movements`;
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.error("Error al obtener datos de movimientos:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData()
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Movimientos</h1>
                <p className="text-muted-foreground mt-1">
                    Historial de movimientos del inventario.
                </p>
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <ArrowLeftRightIcon className="size-5" />
                        Registro de Movimientos
                    </CardTitle>
                    <CardDescription>
                        {data.length} movimiento{data.length !== 1 ? "s" : ""} encontrado{data.length !== 1 ? "s" : ""}.
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
                            <ArrowLeftRightIcon className="size-12 mx-auto mb-3 opacity-30" />
                            <p>No hay movimientos registrados.</p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}