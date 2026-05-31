import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { Product, Supplier } from "@/types/inventory"
import axios from "@/lib/axios-inventory"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"
import { ComboboxSuppliers } from "./combobox-suppliers"

export function DialogCreateProduct({
    onAddProduct
}: {
    onAddProduct: ({ product }: {
        product: Product;
    }) => void
}) {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [name, setName] = useState("")
    const [supplierId, setSupplierId] = useState("")
    const [shortCode, setShortCode] = useState("")

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        if (name.trim() === "" || shortCode.trim() === "" || supplierId.trim() === "") {
            toast.error("Por favor complete todos los campos.")
            return
        }

        setIsLoading(true)

        try {
            const res = await axios.post("/products", { name, supplierId, shortCode })
            const newProduct: Product = res.data
            onAddProduct({ product: { ...newProduct, currentPricePerKg: '0.00' } })

            toast("Conductor agregado correctamente!")
            setName("")
            setSupplierId("")
            setShortCode("")
        } catch (error) {
            toast.error("Error al agregar un conductor.")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const url = `/suppliers`;

                const res = await axios.get(url);

                setSuppliers(res.data);
            } catch (error) {
                console.error("Error al obtener proveedores:", error);
                toast.error("Error al obtener proveedores.")
                setSuppliers([]);
            }

        }
        fetchSuppliers()
    }, [])


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    Agregar Producto
                    <PlusIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nuevo Producto</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="mb-2">
                    <Label htmlFor="name" className="mb-1">Nombre</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-2">
                    <Label htmlFor="shortName" className="mb-1">Nombre corto</Label>
                    <Input id="shortName" value={shortCode} onChange={(e) => setShortCode(e.target.value)} />
                </div>
                <ComboboxSuppliers
                    suppliers={suppliers}
                    onChangeValue={(v) => setSupplierId(v)}
                    value={supplierId}
                />
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
