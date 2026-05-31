import Decimal from "decimal.js";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableCobranza = ({
  sales,
}: {
  sales: {
    note: number;
    name: string;
    date: Date;
    expiration: Date;
    amount: number;
    payed: number;
    pending: number;
  }[];
}) => {
  // ✅ Calcular totales usando Decimal
  const totalAmount = sales.reduce(
    (acc, sale) => acc.plus(new Decimal(sale.amount)),
    new Decimal(0)
  );

  const totalPayed = sales.reduce(
    (acc, sale) => acc.plus(new Decimal(sale.payed)),
    new Decimal(0)
  );

  const totalPending = sales.reduce(
    (acc, sale) => acc.plus(new Decimal(sale.pending)),
    new Decimal(0)
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Nota</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead className="text-right">Importe</TableHead>
          <TableHead className="text-right">Pagado</TableHead>
          <TableHead className="text-right">Pendiente</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.note}>
            <TableCell className="font-medium">{sale.note}</TableCell>
            <TableCell>{sale.name}</TableCell>
            <TableCell>{sale.date.toString()}</TableCell>
            <TableCell>{sale.expiration.toString()}</TableCell>
            <TableCell className="text-right">
              ${new Decimal(sale.amount).toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              ${new Decimal(sale.payed).toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              ${new Decimal(sale.pending).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Totales</TableCell>
          <TableCell className="text-right font-semibold">
            ${totalAmount.toFixed(2)}
          </TableCell>
          <TableCell className="text-right font-semibold">
            ${totalPayed.toFixed(2)}
          </TableCell>
          <TableCell className="text-right font-semibold">
            ${totalPending.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
