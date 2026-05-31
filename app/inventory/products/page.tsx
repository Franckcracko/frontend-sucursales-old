'use client';

import axios from '@/lib/axios-inventory';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { Product } from '@/types/inventory';
import { DialogCreateProduct } from '@/components/dialog-create-product';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
    const [data, setData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onAddProduct = ({ product }: { product: Product }) => {
        setData(prevState => [product, ...prevState])
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const url = `/products`;
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.error("Error al obtener datos de productos:", error);
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Productos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona el inventario de productos.
                    </p>
                </div>
                <DialogCreateProduct onAddProduct={onAddProduct} />
            </div>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <PackageIcon className="size-5" />
                        Lista de Productos
                    </CardTitle>
                    <CardDescription>
                        {data.length} producto{data.length !== 1 ? "s" : ""} en el inventario.
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
                            <PackageIcon className="size-12 mx-auto mb-3 opacity-30" />
                            <p>No hay productos registrados.</p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}