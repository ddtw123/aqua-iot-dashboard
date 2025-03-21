import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { iotData } from "@/data/iotData";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

export default function Dashboard (){
    return(
        <div>
            <DashboardHeader />
            <DashboardContent />
        </div>
    );
};

const DashboardHeader = () => {
    const { t } = useTranslation();
    return (
        <motion.div className="font-poppins font-medium text-h2SM md:text-h2MD lg:text-h2LG">
            {t("homepage.dashboard")}
        </motion.div>
    );
};

const DashboardContent = () => {
    return(
        <motion.div className="w-full flex flex-row overflow-hidden">
            <div className="w-2/3">

            </div>
            <div className="w-1/3 flex flex-col gap-4">
                <DashboardTemperature />
                <DashboardDissolvedOxygen />
            </div>
        </motion.div>
    );
};

const chartConfig = {
desktop: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
},
} satisfies ChartConfig

const DashboardTemperature = () => {
    const { t } = useTranslation();
    return(
        <motion.div className="font-inter font-medium text-h5SM md:text-h5MD">
            <Card>
                <CardHeader>
                    <CardTitle className="font-roboto font-medium text-h5SM md:text-h5MD lg:text-h5LG">
                        {t("homepage.temperature")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={iotData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="temperature"
                                type="linear"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const DashboardDissolvedOxygen = () => {
    const { t } = useTranslation();
    return(
        <motion.div className="font-inter font-medium text-h5SM md:text-h5MD">
            <Card>
                <CardHeader>
                    <CardTitle className="font-roboto font-medium text-h5SM md:text-h5MD lg:text-h5LG">
                        {t("homepage.dissolved_oxygen")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={iotData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="dissolved_oxygen"
                                type="linear"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
};
