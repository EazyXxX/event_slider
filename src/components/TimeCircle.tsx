import styled from "styled-components";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useState } from "react";

const mockDate = "06/06";

export const TimeCircle: React.FC = () => {
  const [date] = useState(mockDate);

  return (
    <MainWrapper>
      <HeaderWrapper>
        <h1>Исторические даты</h1>
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
  z-index: 1;
  margin-top: 40px;
`;

const CircleWrapper = styled.div`
  width: 530px;
  height: 530px;
  position: fixed;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border: 1px solid rgba(66, 86, 122, 0.8);
  border-radius: 50%;
`;

const HeaderWrapper = styled.div`
  display: flex;
  max-width: 430px;
  padding-left: 78px;
  border-image: linear-gradient(to bottom, #3877ee 0%, #ef5da8 100%) 1;
  border-width: 0 0 0 4px;
  border-style: solid;
`;

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
