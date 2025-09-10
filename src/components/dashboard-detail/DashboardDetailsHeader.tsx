import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardDetailsHeader({ title }: { title: string | undefined }) {
  const router = useRouter();
  return (
    <div className="container mx-auto pb-2 pt-6 md:pb-10 md:pt-16">
      <div className="flex flex-row items-center justify-between">
        <Button
          onClick={router.back}
          className="h-[40px] w-[40px] p-2 bg-black dark:bg-white duration-300"
        >
          <ChevronLeft className="w-[30px] md:h-[40px] md:w-[40px] text-white dark:text-black duration-300" />
        </Button>

        <div className="pr-2 text-h2SM font-bold md:text-h2MD text-black dark:text-white duration-300">{title}</div>
        <div className="w-[10px]"></div>
      </div>
    </div>
  );
}
