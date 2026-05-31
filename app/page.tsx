'use client';

import { ChartStats } from '@/components/chart-stats';
import { SectionStats } from '@/components/section-stats';
import axios from '@/lib/axios';
import { useBranchSelected } from '@/store/use-branch-store';
import { Branch } from '@/types/sales';
import { useEffect, useState } from 'react';

export default function Page() {
    const [stats, setStats] = useState<Branch[]>([]);
    const [date, setDate] = useState<Date>()
    const branch = useBranchSelected(state => state.branch)

    useEffect(() => {
        const getStats = async () => {
            const { data: systemData } = await axios.get("/system")
            console.log(systemData)
            const { data } = await axios.get("/sales/report")
            const newDate = new Date(data.date)
            setDate(newDate)
            setStats(data.stats)
        }
        getStats()
    }, [])

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">

                    <h1 className="mb-2 text-3xl font-bold leading-none tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                    <h2>En mantenimiento</h2>
                    {
                        stats.length > 0 && date &&
                        (
                            <>
                                {/* <SectionStats stats={stats.find(s => s.branch === branch)!} />
                                <ChartStats date={date} stats={stats.find(s => s.branch === branch)!} /> */}
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}