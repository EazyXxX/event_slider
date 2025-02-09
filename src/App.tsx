import styled, { ThemeProvider } from "styled-components";
import { SegmentSlider } from "./components/SegmentSlider";
import { TimeCircle } from "./components/TimeCircle";
import { GridOverlay } from "./components/GridOverlay";
import { Moon, Sun } from "lucide-react";
import { useBaseStore } from "./stores/baseStore";
import { base, darkTheme, lightTheme } from "./styles/theme";

function App() {
  const toggleDarkMode = useBaseStore((state) => state.toggleDarkMode);
  const isDarkMode = useBaseStore((state) => state.isDarkMode);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <BackgroundWrapper>
        <MainWrapper>
          <GridOverlay />
          <TimeCircle />
          <SegmentSlider />
          <ThemeToggler onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Moon color={base.white} size={30} />
            ) : (
              <Sun color={base.black} size={30} />
            )}
          </ThemeToggler>
        </MainWrapper>
      </BackgroundWrapper>
    </ThemeProvider>
  );
}

export default App;

const BackgroundWrapper = styled.main`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.background};
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 100vh;
  width: auto;
  border-left: 1px solid ${(props) => props.theme.border};
  border-right: 1px solid ${(props) => props.theme.border};
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  margin: 0 240px;
  position: relative;

  @media (max-width: 1500px) {
    margin: 0 100px;
  }

  @media (max-width: 1200px) {
    margin: 0;
  }
`;

const ThemeToggler = styled.button`
  position: absolute;
  top: 34px;
  right: 30px;
`;
