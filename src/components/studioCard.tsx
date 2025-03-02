import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { IStudio } from "@/data/mockData";
import BookingModal from "./BookingModal";
import { useState, useRef } from "react";
import StudioPlaceholder from "./StudioImgPlaceholder";
import { motion, useInView } from "framer-motion";

const StudioCard = ({ studio }: { studio: IStudio }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<IStudio | null>(null);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: "some" });

  const openBookingModal = (studio: IStudio) => {
    setSelectedStudio(studio);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedStudio(null);
  };

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
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        ease: "easeIn",
        type: "keyframes",
        stiffness: 300,
        damping: 24,
      }}
      layout
    >
      <Card key={studio.Id} className="overflow-hidden shadow-muted">
        <div className="aspect-video relative bg-muted">
          <StudioPlaceholder name={studio.Name} />
          <Badge className="absolute top-2 right-2">{studio.Type}</Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold line-clamp-1">
              {studio.Name}
            </h2>
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
              {studio.Amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">
              {studio.PricePerHour} {studio.Currency}/hr
            </div>
            <Button onClick={() => openBookingModal(studio)}>Book Now</Button>
          </div>
        </CardContent>
        {selectedStudio && (
          <BookingModal
            studio={selectedStudio}
            isOpen={isModalOpen}
            onClose={closeBookingModal}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default StudioCard;
