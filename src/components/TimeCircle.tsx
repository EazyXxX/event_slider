import styled from "styled-components";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useState } from "react";

const mockDate = "06/06";

export const TimeCircle: React.FC = () => {
  const [date] = useState(mockDate);

  return (
    <MainWrapper>
      <HeaderWrapper>
        <Header>Исторические даты</Header>
        <CircleWrapper />
      </HeaderWrapper>
      <SegmentSelectorWrapper>
        {date}
        <ButtonsWrapper>
          <ChevronWrapper>
            <CircleChevronLeft size={50} strokeWidth={1} />
          </ChevronWrapper>
          <ChevronWrapper>
            <CircleChevronRight size={50} strokeWidth={1} />
          </ChevronWrapper>
        </ButtonsWrapper>
      </SegmentSelectorWrapper>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  margin-top: 40px;
`;

const CircleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  max-width: 430px;
  padding-left: 78px;
  border-image: linear-gradient(to bottom, #3877ee 0%, #ef5da8 100%) 1;
  border-width: 0 0 0 4px;
  border-style: solid;
`;

const Header = styled.h1``;

const SegmentSelectorWrapper = styled.div`
  max-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: start;
  z-index: 1;
  margin-left: 80px;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ChevronWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.1s;
  color: #42567a;

  &:hover {
    color: #303f5c;
    transition: 0.1s;
  }
`;
