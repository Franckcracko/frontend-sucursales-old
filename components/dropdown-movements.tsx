import { Movement } from "@/types/movement"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"


export const DropdownMovements = ({ movement }: {
    movement: Movement
}) => {
    const [showDetails, setShowDetails] = useState(false)
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
                    <DropdownMenuItem onSelect={() => setShowDetails(true)}>Ver detalles</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Detalles</DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Nombre producto</TableHead>
                                <TableHead>Total cajas</TableHead>
                                <TableHead>Total de peso</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movement.details.map((detail, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{detail.productName}</TableCell>
                                    <TableCell>{detail.boxCount}</TableCell>
                                    <TableCell>{detail.totalWeight} kg</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}