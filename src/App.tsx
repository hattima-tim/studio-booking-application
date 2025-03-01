import StudioList from "./components/StudioList";
import { Button } from "./components/ui/button";
import mockData, { IStudio } from "./data/mockData";
import SearchBar from "./components/Search";
import { useState } from "react";
import RadiusSearch from "./components/RadiusSearch";

function App() {
  const [filteredStudios, setFilteredStudios] = useState<IStudio[]>(
    mockData.studios
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Studio Booking</h1>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/bookings")}
        >
          View My Bookings
        </Button>
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

      {filteredStudios.length === 0 ? (
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
