import StudioList from "./components/StudioList";
import { Button } from "./components/ui/button";
import mockData, { IStudio } from "./data/mockData";
import SearchBar from "./components/Search";
import { useEffect, useState } from "react";
import RadiusSearch from "./components/RadiusSearch";
import { useNavigate } from "react-router";
import { ThemeToggle } from "./components/theme-toggle";

function App() {
  const navigate = useNavigate();
  const [filteredStudios, setFilteredStudios] = useState<IStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilteredStudios(mockData.studios);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="sticky top-0 z-10 bg-background p-1">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-2.5">
          <h1 className="text-3xl font-bold">StudioConnect</h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate("/bookings")}>
              View My Bookings
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <SearchBar
              setFilteredStudios={setFilteredStudios}
              allStudios={mockData.studios}
            />

            <RadiusSearch
              studios={mockData.studios}
              setFilteredStudios={setFilteredStudios}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredStudios.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No studios found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <StudioList studios={filteredStudios} />
      )}
    </main>
  );
}

export default App;
