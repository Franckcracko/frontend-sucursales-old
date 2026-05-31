'use client';

import axios from '@/lib/axios-inventory';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { Supplier } from '@/types/inventory';
import { DialogCreateSupplier } from '@/components/dialog-create-supplier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
    const [data, setData] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const onAddSupplier = ({ supplier }: { supplier: Supplier }) => {
        setData(prevState => [supplier, ...prevState])
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const url = `/suppliers`;
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.error("Error al obtener datos de proveedores:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData()
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Proveedores</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los proveedores del inventario.
                    </p>
                </div>
                <DialogCreateSupplier onAddSupplier={onAddSupplier} />
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <UserIcon className="size-5" />
                        Lista de Proveedores
                    </CardTitle>
                    <CardDescription>
                        {data.length} proveedor{data.length !== 1 ? "s" : ""} registrado{data.length !== 1 ? "s" : ""}.
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
                            <UserIcon className="size-12 mx-auto mb-3 opacity-30" />
                            <p>No hay proveedores registrados.</p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}