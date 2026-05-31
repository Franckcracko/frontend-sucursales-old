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
import { useState } from "react"
import { Driver } from "@/types/inventory"
import axios from "@/lib/axios-inventory"
import { toast } from "sonner"
import { PlusIcon } from "lucide-react"

export function DialogCreateDriver({
    onAddDriver
}: {
    onAddDriver: ({ driver }: {
        driver: Driver;
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
            const res = await axios.post("/drivers", { name })

            onAddDriver({ driver: res.data })

            toast("Conductor agregado correctamente!")
            setName("")
        } catch (error) {
            toast.error("Error al agregar un conductor.")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    Agregar Conductor
                    <PlusIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Nuevo Chofer</AlertDialogTitle>
                </AlertDialogHeader>

                <Label htmlFor="name">Nombre</Label>
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
