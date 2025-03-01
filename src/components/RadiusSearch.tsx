import { Navigation } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { IStudio } from "@/data/mockData";

interface Props {
  studios: IStudio[];
  setFilteredStudios: React.Dispatch<React.SetStateAction<IStudio[]>>;
}

const RadiusSearch = ({ studios, setFilteredStudios }: Props) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchRadius, setSearchRadius] = useState<number | null>(null);

  const resetFilters = () => {
    setUserLocation(null);
    setSearchRadius(null);
    setFilteredStudios(studios);
  };

  useEffect(() => {
    const calculateDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    if (userLocation && searchRadius) {
      const filteredByRadius = studios.filter((studio) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          studio.Location.Coordinates.Latitude,
          studio.Location.Coordinates.Longitude
        );
        return distance <= searchRadius;
      });
      setFilteredStudios(filteredByRadius);
    }
  }, [userLocation, searchRadius, studios, setFilteredStudios]);

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const handleSearchByRadius = (radius: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setSearchRadius(radius);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to access your location. Please check your browser settings and try again."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleSearchByRadius(10)}>
        <Navigation className="mr-2 h-4 w-4" />
        Within 10km
      </Button>
      <Button onClick={() => handleSearchByRadius(20)}>
        <Navigation className="mr-2 h-4 w-4" />
        Within 20km
      </Button>
      {userLocation && (
        <Button onClick={resetFilters} variant="ghost">
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default RadiusSearch;
