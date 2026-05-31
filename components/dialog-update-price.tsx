import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"
import { IconCash } from "@tabler/icons-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { cn } from "@/lib/utils"
import { Price, Product } from "@/types/inventory"
import axios from "@/lib/axios-inventory"
import { toast } from "sonner"

export function DialogUpdatePrice({
    products,
    onAddPrice
}: {
    products: Product[];
    onAddPrice: ({ newPrice }: {
        newPrice: (Price & {
            product: Product;
        });
    }) => void
}) {
    const [open, setOpen] = useState(false)

    const [productId, setProductId] = useState("")
    const [newPrice, setNewPrice] = useState("")

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async () => {
        if (!newPrice.trim() || parseFloat(newPrice) <= 0) {
            alert("No se pueden ingresar pecios negativos o nulos!")
            return
        }

        setIsLoading(true)

        try {
            const res = await axios.post("/prices", { productId, pricePerKg: parseFloat(newPrice) })

            onAddPrice({ newPrice: res.data })

            toast("Precio actualizado correctamente!")
            setProductId("")
            setNewPrice("")
        } catch (error) {
            toast("Error al actualizar el precio.")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    Actualizar Precios
                    <IconCash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nuevo Precio</AlertDialogTitle>
                    <AlertDialogDescription>
                        Sube el nuevo precio de un producto.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {productId
                                ? products.find((p) => p.id === productId)?.name
                                : "Selecciona un producto..."}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search framework..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>Producto no encontrado.</CommandEmpty>
                                <CommandGroup>
                                    {products.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.id}
                                            onSelect={(currentValue) => {
                                                setProductId(currentValue === productId ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {product.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
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
                <Label htmlFor="price">Nuevo precio</Label>
                <Input type="number" id="price" placeholder="$0.00" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                    <Button onClick={onSubmit}>
                        {isLoading ? "Cargando..." : "Enviar"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
