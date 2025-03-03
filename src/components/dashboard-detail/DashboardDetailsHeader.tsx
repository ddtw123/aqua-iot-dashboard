import { Button } from "@/components/ui/button";
import { ChevronLeft, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardDetailsHeaderProps {
  title: string | undefined;
}

export default function DashboardDetailsHeader({
  title,
}: DashboardDetailsHeaderProps) {
  const router = useRouter();
  return (
    <div className="container mx-auto pb-2 pt-6 md:pb-10 md:pt-16">
      <div className="flex flex-row items-center justify-between">
        <Button
          onClick={router.back}
          className="h-[20px] p-1 leading-[0px] md:h-[40px] md:p-2"
        >
          <ChevronLeft className="h-[20px] w-[20px] md:h-[30px] md:w-[30px]" />
        </Button>

        <div className="pr-2 text-2xl font-bold md:text-5xl">{title}</div>
        <div className="w-[10px]"></div>
      </div>
    </div>
  );
}
