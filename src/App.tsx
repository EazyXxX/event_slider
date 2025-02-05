import styled from "styled-components";
import { EventsSlider } from "./components/EventsSlider";
import { TimeCircle } from "./components/TimeCircle";

function App() {
  return (
    <MainWrapper>
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
  border-left: 1px solid #42567a;
  border-right: 1px solid #42567a;
  margin: 0 240px;
`;
