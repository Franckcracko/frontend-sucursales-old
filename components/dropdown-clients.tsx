import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { MoreHorizontal, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Customer } from "@/types/inventory"
import axios from "@/lib/axios-inventory"
import { toast } from "sonner"

export const DropdownClients = ({ customer }: {
    customer: Customer
}) => {
    const [showDelete, setShowDelete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmitDelete = async () => {
        setIsLoading(true)
        try {
            await axios.delete(`/customers/${customer.id}`)
            toast.success("Proveedor eliminado correctamente. Recarga para ver los cambios",)
        } catch (error) {
            console.error("Error al eliminar el proveedor:", error);
            toast.error("No se pudo eliminar el proveedor.")
        } finally {
            setIsLoading(false)
            setShowDelete(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    {/* <DropdownMenuItem onSelect={() => setShowDelete(true)}>Borrar</DropdownMenuItem> */}
                    <DropdownMenuItem variant="destructive" onSelect={() => setShowDelete(true)}>
                        <TrashIcon />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Eliminar Cliente</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar al cliente &quot;{customer.name}&quot;? Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                        <Button onClick={onSubmitDelete} variant="destructive">
                            {isLoading ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}