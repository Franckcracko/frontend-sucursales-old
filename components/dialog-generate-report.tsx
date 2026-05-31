import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Paperclip } from "lucide-react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useState } from "react"
import axios from "@/lib/axios-inventory"
import { format } from 'date-fns-tz';

export function DialogGenerateReport({ history }: { history: string }) {
    const timeZone = 'America/Monterrey';

    const getTodayForTamaulipas = () => {
        const now = new Date();
        return format(now, 'yyyy-MM-dd', { timeZone });
    };

    const [date, setDate] = useState(getTodayForTamaulipas)

    const onSubmit = async () => {
        try {
            // 1. Realiza la petición GET al endpoint
            const response = await axios.get(`/reports?date=${date}&history=${format(new Date(history), 'yyyy-MM-dd', { timeZone })}`, {
                responseType: 'blob', // ¡Esta es la clave! Le dice a Axios que espere un blob
            });

            // 2. Crea una URL temporal para el blob (el archivo en memoria)
            const url = window.URL.createObjectURL(new Blob([response.data]));

            // 3. Crea un enlace <a> temporal en el documento
            const link = document.createElement('a');
            link.href = url;

            // 4. Establece el atributo 'download' con el nombre del archivo
            // Puedes poner un nombre por defecto o intentar obtenerlo de los headers
            const fileName = 'reporte-generado.xlsx';
            link.setAttribute('download', fileName);

            // 5. Agrega el enlace al DOM, haz clic en él y luego remuévelo
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url); // Limpia la URL del objeto

        } catch (err) {
            console.error("Error al descargar el archivo", err);
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size={'icon'}>
                    <Paperclip />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Generar reporte</AlertDialogTitle>
                    <AlertDialogDescription>
                        Necesitas indicar la fecha en la que quieras tomar como referencia para entradas y salidas.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Label htmlFor="date">Fecha de entradas/salidas</Label>
                <Input type="date" id="date" placeholder="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit}>Enviar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
