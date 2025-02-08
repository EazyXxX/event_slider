import styled from "styled-components";
import { SegmentSlider } from "./components/SegmentSlider";
import { TimeCircle } from "./components/TimeCircle";
import { GridOverlay } from "./components/GridOverlay";
import { Moon, Sun } from "lucide-react";
import { useBaseStore } from "./stores/baseStore";

function App() {
  const toggleDarkMode = useBaseStore((state) => state.toggleDarkMode);
  const isDarkMode = useBaseStore((state) => state.isDarkMode);

  return (
    <MainWrapper>
      <GridOverlay />
      <TimeCircle />
      <SegmentSlider />
      <ThemeToggler onClick={toggleDarkMode}>
        {isDarkMode ? <Moon size={30} /> : <Sun size={30} />}
      </ThemeToggler>
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

const ThemeToggler = styled.button`
  position: absolute;
  top: 34px;
  right: 30px;
`;
