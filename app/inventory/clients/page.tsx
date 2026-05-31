'use client';

import axios from '@/lib/axios-inventory';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { Customer } from '@/types/inventory';
import { DialogCreateCustomer } from '@/components/dialog-create-customer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
    const [data, setData] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onAddCustomer = ({ customer }: { customer: Customer }) => {
        setData(prevState => [customer, ...prevState])
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const url = `/customers`;
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.error("Error al obtener datos de clientes:", error);
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los clientes del inventario.
                    </p>
                </div>
                <DialogCreateCustomer onAddCustomer={onAddCustomer} />
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <UsersIcon className="size-5" />
                        Lista de Clientes
                    </CardTitle>
                    <CardDescription>
                        {data.length} cliente{data.length !== 1 ? "s" : ""} registrado{data.length !== 1 ? "s" : ""}.
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
                            <UsersIcon className="size-12 mx-auto mb-3 opacity-30" />
                            <p>No hay clientes registrados.</p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}