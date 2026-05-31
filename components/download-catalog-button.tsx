import React, { useState } from 'react';
import axios from '@/lib/axios'; // Asumo que es tu instancia configurada de Axios
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react'; // Iconos de Lucide

export function DownloadButton({ branch }: {branch:string}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {

    setIsDownloading(true);
    setError(null);

    const downloadUrl = `/products/catalog/${branch}`;

    try {
      // 2. Hacer la petición con la configuración CLAVE para manejar archivos binarios
      const response = await axios.get(downloadUrl, {
        responseType: 'blob', // <--- ¡Esto es lo que le dice a Axios que espere datos binarios!
      });

      // 3. Crear un objeto URL temporal a partir del blob
      // El blob contiene los datos binarios del archivo Excel
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // 4. Crear un enlace (anchor) invisible para simular el click de descarga
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener el nombre del archivo de los headers de Express (Content-Disposition)
      // Este paso es opcional, pero mejor si el servidor lo proporciona
      const contentDisposition = response.headers['content-disposition'];
      let filename = `Catalogo-${branch}.xlsx`; // Nombre por defecto

      if (contentDisposition) {
        // Extrae el nombre del archivo del header 'Content-Disposition'
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      
      // 5. Iniciar la descarga y limpiar
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Libera la memoria del objeto URL
      
    } catch (err) {
      console.error("Error durante la descarga:", err);
      setError("No se pudo descargar el archivo. Verifica la conexión.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleDownload} 
        disabled={isDownloading} 
        className="flex items-center gap-2"
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Descargando...
          </>
        ) : (
          <>
            <DownloadIcon className="h-4 w-4" />
            Descargar Catalogo Sucursal
          </>
        )}
      </Button>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </>
  );
}