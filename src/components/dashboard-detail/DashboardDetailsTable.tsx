import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PondData, SensorKey, sensorKeyMap, sensorUnits } from "@/data/pondData";
import { useTranslation } from 'react-i18next';

export default function DashboardDetailsTable({ 
    data, 
    dataKey 
}: {
    data: PondData[],
    dataKey: SensorKey
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const { t } = useTranslation();
    const itemsPerPage = 10;

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination handlers
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="w-full">
            <div className="mt-10 rounded-md border space-y-4">
                <Table>
                    <TableHeader className='bg-black'>
                        <TableRow className='hover:bg-black h-12'>
                            <TableHead className='font-inter text-white'>
                                {t("dashboard_detail.pond_id")}
                            </TableHead>
                            <TableHead className='font-inter text-white'>
                                {t("dashboard_detail.timestamp")}
                            </TableHead>
                            <TableHead className='font-inter text-white'>
                                {t(sensorKeyMap[dataKey])} ({sensorUnits[dataKey]})
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((item, index) => (
                            <TableRow key={index} className='h-12'>
                                <TableCell>{item.pond_id}</TableCell>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell>{item[dataKey]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="w-full flex justify-center items-center my-10 space-x-4">
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={goToFirstPage} 
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronsLeft className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <button 
                        onClick={goToLastPage} 
                        disabled={currentPage === totalPages}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ChevronsRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}