"use client";

import { CustomPagination } from "@/components/CustomPagination";
import { ItemCard } from "@/components/ItemCard";
import { useState } from "react";

const generateMockItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `iPhone ${12 + (i % 4)}`,
    location: "บาร์วิศวะ",
    foundDate: `${12 + (i % 20)}/${12}/2568`,
    foundTime: `${10 + (i % 12)}:00 น.`,
    keeper: "ยามบาร์วิศวะ",
    foundBy: "โอริโอ้",
    status: i % 3 === 0 ? "รับคืนแล้ว" : "ยังไม่ได้รับคืน",
    imageUrl: "",
  }));
};

const ITEMS_PER_PAGE = 20;
const allItems = generateMockItems(85); // Total mock items

const SearchPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = allItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 animate-fade-in">
        ค้นหาของหาย
      </h1>

      {/* Pagination - Top */}
      {totalPages > 1 && (
        <div className="mb-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Items Grid */}
      <div className="flex flex-col items-center w-full">
        <div className="space-y-4 w-full max-w-5xl">
          {paginatedItems.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Pagination - Bottom */}
      {totalPages > 1 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">ไม่พบรายการที่ค้นหา</p>
        </div>
      )} */}
    </div>
  );
};

export default SearchPage;
