import styled from "styled-components";

export const GridOverlay: React.FC = () => {
  return (
    <GridWrapper>
      <GridItem />
      <GridItem />
      <GridItem />
      <GridItem />
    </GridWrapper>
  );
};

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -2;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background-color: rgba(66, 86, 122, 0.8);
  }

  /* Horizontal line */
  &::before {
    top: 40%;
    left: 0;
    width: 100%;
    height: 1px; /* Line thickness */
    transform: translateY(-50%);
  }

  /* Vertical line */
  &::after {
    left: 50%;
    top: 0;
    width: 1px; /* Line thickness */
    height: 100%;
    transform: translateX(-50%);
  }
`;

const GridItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-size: 18px;
`;
