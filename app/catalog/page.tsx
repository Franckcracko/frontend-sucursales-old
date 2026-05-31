'use client';

import { useBranchSelected } from '@/store/use-branch-store';
import { DownloadButton } from '@/components/download-catalog-button';
import { DownloadButton as DownloadMayoreoButton } from '@/components/download-catalog-mayoreo-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageIcon } from 'lucide-react';

export default function Page() {
    const branch = useBranchSelected(state => state.branch);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Catalogo de Productos</h1>
                <p className="text-muted-foreground mt-1">
                    Sucursal <span className="font-medium text-foreground">{branch}</span>
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <PackageIcon className="size-5" />
                            Catalogo Regular
                        </CardTitle>
                        <CardDescription>
                            Descarga el catalogo de productos con precios de venta al menudeo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                                Archivo Excel con la lista completa de productos y precios.
                            </p>
                        </div>
                        <DownloadButton branch={branch} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <PackageIcon className="size-5" />
                            Catalogo Mayoreo
                        </CardTitle>
                        <CardDescription>
                            Descarga el catalogo de productos con precios de venta al mayoreo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex-1">
                            <p className="text-sm text-muted-foreground">
                                Archivo Excel con precios especiales para compras al mayoreo.
                            </p>
                        </div>
                        <DownloadMayoreoButton />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}