import React, { useState } from 'react';
import axios from '@/lib/axios'; // Asumo que es tu instancia configurada de Axios
import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2 } from 'lucide-react'; // Iconos de Lucide

interface DownloadSalesButtonProps {
  branch: string;
  initDate: string; // Formato YYYY-MM-DD
  endDate: string; // Formato YYYY-MM-DD
  type: string
}

export function DownloadButton({ branch, initDate, endDate, type }: DownloadSalesButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!branch || !initDate || !endDate) {
      setError("Faltan parámetros de sucursal o fechas.");
      return;
    }

    setIsDownloading(true);
    setError(null);

    const downloadUrl = `/${type}/${branch}/download?start=${initDate}&end=${endDate}`;

    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'blob', // <--- ¡Esto es lo que le dice a Axios que espere datos binarios!
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `Reporte_Ventas_${initDate}-${endDate}.xlsx`; // Nombre por defecto

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);

      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
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