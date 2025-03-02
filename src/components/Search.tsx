import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { IStudio } from "@/data/mockData";

interface Props {
  setFilteredStudios: React.Dispatch<React.SetStateAction<IStudio[]>>;
  allStudios: IStudio[];
}

const SearchBar = ({ setFilteredStudios, allStudios }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchByLocation = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allStudios.filter(
        (studio) =>
          studio.Location.Area.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          studio.Location.City.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudios(filtered);

      const areas = Array.from(
        new Set(allStudios.map((studio) => studio.Location.Area))
      );
      const cities = Array.from(
        new Set(allStudios.map((studio) => studio.Location.City))
      );
      const allLocations = [...areas, ...cities];

      const locationSuggestions = allLocations.filter((location) =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSuggestions(locationSuggestions);
      setShowSuggestions(locationSuggestions.length > 0);
    } else {
      setFilteredStudios(allStudios);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allStudios, setFilteredStudios]);

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by city or area..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-background cursor-pointer"
              onClick={() => handleSearchByLocation(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
