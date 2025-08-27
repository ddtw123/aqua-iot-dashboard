"use client";
import { loadFullPondData, PondData } from "@/data/pondData";
import { fadeInYEnd, fadeInYInitial, fadeTransition } from "@/util/constant";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MiniSparkline from "../ui/MiniSparkline";

export default function HomePage(){
    const { t } = useTranslation();
    const router = useRouter();
    const [data, setData] = useState<PondData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const all = await loadFullPondData();
                setData(all);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const ponds = useMemo(() => {
        const map: Record<string, PondData[]> = {};
        data.forEach(d => {
            if (!map[d.pond_id]) map[d.pond_id] = [];
            map[d.pond_id].push(d);
        });
        return Object.entries(map).map(([pondId, arr]) => ({ pondId: String(pondId), arr }));
    }, [data]);

    const average = (arr: PondData[], key: keyof PondData) => {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((acc, x) => acc + (Number(x[key]) || 0), 0);
        return Math.round((sum / arr.length) * 100) / 100;
    };

    if (loading) {
        return <div className="container mx-auto p-8 text-black dark:text-white">Loading...</div>;
    }

    return(
        <motion.div 
            initial={fadeInYInitial}
            whileInView={fadeInYEnd}
            transition={fadeTransition}
            viewport={{once: true}}
            className="container mx-auto px-4 py-10"
        >
            <h1 className="font-roboto text-h3SM md:text-h2MD text-black dark:text-white mb-6">{t("homepage.dashboard")}</h1>
            <div className="flex flex-col gap-6 overflow-x-auto snap-x snap-mandatory pb-2">
                {ponds.map(({ pondId, arr }) => {
                    const recent = arr.slice(0, 20).reverse();
                    const temps = recent.map(d => Number(d.temp));
                    const phs = recent.map(d => Number(d.ph));
                    const dos = recent.map(d => Number(d.do));
                    const trendUptemps = temps.length > 1 ? temps[temps.length - 1] >= temps[0] : true;
                    const trendUpph = phs.length > 1 ? phs[phs.length - 1] >= phs[0] : true;
                    const trendUpdo = dos.length > 1 ? dos[dos.length - 1] >= dos[0] : true;

                    return (
                        <div 
                            key={pondId} 
                            className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-dark_blue/60 text-black dark:text-white min-w-full"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-h4SM md:text-h3MD font-semibold">{t("homepage.pond")} {pondId}</div>
                                <div className="text-h4SM md:text-h4MD opacity-70">{arr.length} {t("homepage.records")}</div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-5 items-center">
                                <div className="w-full lg:w-2/5 flex flex-col gap-1 text-h5SM md:text-h4MD">
                                    <div>{t("homepage.avgTemp")}: {average(arr, 'temp')} °C</div>
                                    <div>{t("homepage.avgPh")}: {average(arr, 'ph')}</div>
                                    <div>{t("homepage.avgDo")}: {average(arr, 'do')} mg/L</div>
                                    <button 
                                        onClick={() => router.push(`/${pondId}/dashboard`)} 
                                        className="mt-3 w-full lg:w-fit px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-75 duration-300">
                                        {t("common.detail")}
                                    </button>
                                </div>

                                <div className="w-full lg:w-3/5 flex flex-col gap-2 text-h5SM md:text-h5MD">
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className=" opacity-70">{t("homepage.trendtemp")}</span>
                                            <span className={`${trendUptemps ? 'text-emerald-600' : 'text-red'}`}>{trendUptemps ? t("homepage.trendUp") : t("homepage.trendDown")}</span>
                                        </div>
                                        <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2 bg-white/60 dark:bg-dark_blue/40 space-y-2">
                                            <MiniSparkline values={temps} height={60} color={trendUptemps ? '#10b981' : '#ef4444'} />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="opacity-70">{t("homepage.trendph")}</span>
                                            <span className={`${trendUpph ? 'text-emerald-600' : 'text-red'}`}>{trendUpph ? t("homepage.trendUp") : t("homepage.trendDown")}</span>
                                        </div>
                                        <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2 bg-white/60 dark:bg-dark_blue/40 space-y-2">
                                            <MiniSparkline values={phs} height={60} color={trendUpph ? '#10b981' : '#ef4444'} />
                                        </div>      
                                    </div>
                                    <div className="lg:col-span-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="opacity-70">{t("homepage.trenddo")}</span>
                                            <span className={`${trendUpdo ? 'text-emerald-600' : 'text-red-500'}`}>{trendUpdo ? t("homepage.trendUp") : t("homepage.trendDown")}</span>
                                        </div>
                                        <div className="rounded-md border border-slate-200 dark:border-slate-700 p-2 bg-white/60 dark:bg-dark_blue/40 space-y-2">
                                            <MiniSparkline values={dos} height={60} color={trendUpdo ? '#10b981' : '#ef4444'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};