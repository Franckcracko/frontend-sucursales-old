'use client';

import axios from '@/lib/axios-inventory';
import { useEffect, useState } from 'react';
import { DialogUpdatePrice } from '@/components/dialog-update-price';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ChevronsUpDown, SearchIcon, DollarSignIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Price, Product } from '@/types/inventory';
import { DataTable } from './data-table';
import { columns } from './columns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function Page() {
    const [data, setData] = useState<(Price & { product: Product })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([])
    const [productId, setProductId] = useState("")

    const onAddPrice = ({ newPrice }: { newPrice: (Price & { product: Product }) }) => {
        setData(prevState => [newPrice, ...prevState])
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `/products`;
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (error) {
                console.error("Error al obtener datos de productos:", error);
                setProducts([]);
            }
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = `/prices`;
                const res = await axios.get(url);
                setData(res.data);
            } catch (error) {
                console.error("Error al obtener datos de precios:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData()
        fetchProducts()
    }, [])

    const handleFilter = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axios.get(productId ? `/prices?productId=${productId}` : `/prices`);
            setData(res.data);
        } catch (error) {
            toast.error("No se pudieron cargar los precios del producto seleccionado.")
            console.error("Error al obtener datos de productos:", error);
            setData([]);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Historico de Precios</h1>
                    <p className="text-muted-foreground mt-1">
                        Consulta y gestiona el historial de precios de productos.
                    </p>
                </div>
                <DialogUpdatePrice onAddPrice={onAddPrice} products={products} />
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <SearchIcon className="size-5" />
                        Filtrar por Producto
                    </CardTitle>
                    <CardDescription>
                        Busca un producto especifico para ver su historial de precios.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4">
                        <SelectProduct
                            products={products}
                            productId={productId}
                            onChangeProduct={setProductId}
                        />
                        <Button type="submit" variant="outline" disabled={isLoading}>
                            Filtrar
                        </Button>
                        {productId && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setProductId("")
                                    handleFilter({ preventDefault: () => {} } as React.FormEvent)
                                }}
                            >
                                Limpiar
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <DollarSignIcon className="size-5" />
                        Historial de Precios
                    </CardTitle>
                    <CardDescription>
                        {data.length} registro{data.length !== 1 ? "s" : ""} de precio{data.length !== 1 ? "s" : ""}.
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
                            <DollarSignIcon className="size-12 mx-auto mb-3 opacity-30" />
                            <p>No hay precios registrados.</p>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function SelectProduct({ products, productId, onChangeProduct }: {
    products: Product[]
    productId: string
    onChangeProduct: (value: string) => void
}) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Seleccionar producto"
                    className="w-full sm:w-[280px] justify-between"
                >
                    {productId
                        ? products.find((p) => p.id === productId)?.name
                        : "Selecciona un producto..."}
                    <ChevronsUpDown className="opacity-50 h-4 w-4 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar producto..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Producto no encontrado.</CommandEmpty>
                        <CommandGroup>
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.id}
                                    onSelect={(currentValue) => {
                                        onChangeProduct(currentValue === productId ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {product.name}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            productId === product.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}