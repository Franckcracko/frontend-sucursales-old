'use client';

import React, { useState } from 'react';
import axios from '@/lib/axios'; // Asumo que es tu instancia configurada de Axios
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react'; // Iconos de Lucide
import { useBranchSelected } from '@/store/use-branch-store';

interface DownloadSalesButtonProps {
  initDate: string; // Formato YYYY-MM-DD
  endDate: string; // Formato YYYY-MM-DD
}

export function DownloadButton({ initDate, endDate }: DownloadSalesButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const branch = useBranchSelected(state => state.branch)
  const handleDownload = async () => {
    if (!initDate || !endDate) {
      setError("Faltan parámetros de sucursal o fechas.");
      return;
    }

    setIsDownloading(true);
    setError(null);

    // 1. Construir la URL completa para el endpoint de descarga
    const downloadUrl = `/products/${branch}/inventory?start=${initDate}&end=${endDate}`;

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
      const filename = `Cobranza_${initDate}-${endDate}.xlsx`; // Nombre por defecto
      console.log(response.data)
      if (contentDisposition) {
        // Extrae el nombre del archivo del header 'Content-Disposition'
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        console.log(filenameMatch)
        // if (filenameMatch && filenameMatch[1]) {
        //   filename = filenameMatch[1];
        // }
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
            Descargar Excel
          </>
        )}
      </Button>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </>
  );
}