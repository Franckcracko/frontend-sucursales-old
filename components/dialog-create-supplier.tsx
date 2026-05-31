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
import { Supplier } from "@/types/inventory"
import axios from "@/lib/axios-inventory"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"

export function DialogCreateSupplier({
    onAddSupplier
}: {
    onAddSupplier: ({ supplier }: {
        supplier: Supplier;
    }) => void
}) {
    const [name, setName] = useState("")
    const [shortName, setShortName] = useState("")

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async () => {
        if (name.trim() === "" || shortName.trim() === "") {
            alert("No se pueden ingresar valores nulos!")
            return
        }

        setIsLoading(true)

        try {
            const res = await axios.post("/suppliers", { name, shortCode: shortName })

            onAddSupplier({ supplier: res.data })

            toast("Proveedor agregado correctamente!")
            setName("")
            setShortName("")
        } catch (error) {
            toast.error("Error al agregar un proveedor.")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    Agregar Proveedor
                    <PlusIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nuevo Proveedor</AlertDialogTitle>
                    <AlertDialogDescription>
                        Asegurate de no repetir el Nombre ni el Nombre corto de proveedor!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mb-2">
                    <Label htmlFor="name" className="mb-1">Nombre</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="shortName" className="mb-1">Nombre Corto</Label>
                    <Input id="shortName" value={shortName} onChange={(e) => setShortName(e.target.value)} />
                </div>
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
