import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface HistoryFilterProps {
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  selectedYear: number;
}

export function HistoryFilter({
  setSelectedYear,
  selectedYear,
}: HistoryFilterProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="year-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Filtrar por ano:
      </label>
      <DatePicker
        id="year-filter"
        selected={null}
        onChange={(date) => {
          if (date) {
            setSelectedYear(date.getFullYear());
          }

          return date;
        }}
        showYearPicker
        dateFormat="yyyy"
        value={selectedYear.toString()}
        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}
