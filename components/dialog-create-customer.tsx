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
import { Customer } from "@/types/inventory"
import axios from "@/lib/axios-inventory"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"

export function DialogCreateCustomer({
    onAddCustomer
}: {
    onAddCustomer: ({ customer }: {
        customer: Customer;
    }) => void
}) {
    const [name, setName] = useState("")

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit = async () => {
        if (name.trim() === "") {
            alert("No se pueden ingresar pecios negativos o nulos!")
            return
        }

        setIsLoading(true)

        try {
            const res = await axios.post("/customers", { name })

            onAddCustomer({ customer: res.data })

            toast("Cliente agregado correctamente!")
            setName("")
        } catch (error) {
            toast("Error al agregar cliente.")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    Agregar Cliente
                    <PlusIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nuevo Precio</AlertDialogTitle>
                    <AlertDialogDescription>
                        Sube el nuevo precio de un producto.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <Label htmlFor="name">Nombre cliente</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
