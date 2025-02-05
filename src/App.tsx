import styled from "styled-components";
import { EventsSlider } from "./components/EventsSlider";
import { TimeCircle } from "./components/TimeCircle";
import { GridOverlay } from "./components/GridOverlay";

function App() {
  return (
    <MainWrapper>
      <GridOverlay />
      <TimeCircle />
      <EventsSlider />
    </MainWrapper>
  );
}

export default App;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 100vh;
  width: auto;
  border-left: 1px solid rgba(66, 86, 122, 0.8);
  border-right: 1px solid rgba(66, 86, 122, 0.8);
  margin: 0 240px;
  position: relative;
`;
