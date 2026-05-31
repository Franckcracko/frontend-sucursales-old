import { Bar, BarChart } from "recharts"
import { ChartConfig, ChartContainer } from "./ui/chart"
import { Branch } from "@/types/sales"
import Decimal from "decimal.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"


const chartConfig = {
    amount: {
        label: "Cantidad",
        color: "#2563eb",
    },
    method: {
        label: "Tipo Venta",
        color: "#60a5fa",
    },
    quantity: {
        label: "Cantidad de Ventas",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export const ChartStats = ({ stats, date }: { stats: Branch, date: Date }) => {
    const totalCard = stats.card.reduce(
        (acc, sale) => acc.plus(new Decimal(sale.subtotal)),
        new Decimal(0)
    );
    const totalCash = stats.cash.reduce(
        (acc, sale) => acc.plus(new Decimal(sale.subtotal)),
        new Decimal(0)
    );
    const totalMix = stats.mix.reduce(
        (acc, sale) => acc.plus(new Decimal(sale.subtotal)),
        new Decimal(0)
    );
    const totalCancel = stats.cancel.reduce(
        (acc, sale) => acc.plus(new Decimal(sale.subtotal)),
        new Decimal(0)
    );
    const data = [
        {
            method: "Tarjeta",
            amount: totalCard.toNumber(),
            quantity: stats.card.length
        },
        {
            method: "Efectivo",
            amount: totalCash.toNumber(),
            quantity: stats.cash.length
        },
        {
            method: "Mixto",
            amount: totalMix.toNumber(),
            quantity: stats.mix.length
        },
        {
            method: "Canceladas",
            amount: totalCancel.toNumber(),
            quantity: stats.cancel.length
        },
    ]

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Resumen de Ventas del día</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">
                        Datos actualizados a la fecha de: {date.toLocaleString()}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <Bar dataKey="method" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="amount" fill="var(--color-mobile)" radius={4} />
                        <Bar dataKey="quantity" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}