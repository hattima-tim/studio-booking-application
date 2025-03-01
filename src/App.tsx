import StudioList from "./components/StudioList";
import mockData from "./data/mockData";

function App() {
  return <StudioList studios={mockData.studios} />;
}

export default App;
