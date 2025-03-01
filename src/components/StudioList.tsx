import { IStudio } from "@/types/studio";
import StudioCard from "./studioCard";

const StudioList = ({ studios }: { studios: IStudio[] }) => {
  if (!studios || studios.length === 0) {
    return (
      <div className="text-center py-10">
        No studios found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <StudioCard key={studio.Id} studio={studio} />
      ))}
    </div>
  );
};

export default StudioList;
