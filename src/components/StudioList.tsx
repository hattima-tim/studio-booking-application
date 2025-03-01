import { IStudio } from "@/data/mockData";
import StudioCard from "./studioCard";

const StudioList = ({ studios }: { studios: IStudio[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {studios.map((studio) => (
        <StudioCard key={studio.Id} studio={studio} />
      ))}
    </div>
  );
};

export default StudioList;
