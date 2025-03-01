import { Clock, MapPin, Star } from "lucide-react";
import { IStudio } from "../types/studio";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const StudioCard = ({ studio }: { studio: IStudio }) => {
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <Card key={studio.Id} className="overflow-hidden">
      <div className="aspect-video relative bg-muted">
        <img
          src={studio.Images[0] || "/placeholder.svg?height=200&width=400"}
          alt={studio.Name}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2">{studio.Type}</Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold line-clamp-1">{studio.Name}</h2>
          <div className="flex">{renderStars(studio.Rating)}</div>
        </div>
        <div className="flex items-start gap-1 text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="text-sm line-clamp-1">
            {studio.Location.Area}, {studio.Location.City}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span className="text-sm">
            {studio.Availability.Open} - {studio.Availability.Close}
          </span>
        </div>
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {studio.Amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {studio.Amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{studio.Amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">
            {studio.PricePerHour} {studio.Currency}/hr
          </div>
          <Button>Book Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudioCard;
