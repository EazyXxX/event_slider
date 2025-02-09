import styled from "styled-components";
import {
  ChevronLeftCircle as CircleChevronLeft,
  ChevronRightCircle as CircleChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { mockedTopics, mockedData } from "../utils/mocks";
import { useBaseStore } from "../stores/baseStore";
import SegmentSlider from "./SegmentSlider";

const SEGMENTS = mockedTopics.length;
const SEGMENT_ANGLE = 360 / SEGMENTS; // 60°
const RADIUS = 250;
const ROTATION_OFFSET = 30;
const GSAP_ANIMATION_DURATION = 1;

const getDesiredRotation = (targetSegment: number) => {
  return 60 - SEGMENT_ANGLE * (targetSegment - 1);
};

interface TimeCircleProps {
  storageKey?: string;
}

export const TimeCircle: React.FC<TimeCircleProps> = ({
  storageKey = "segmentCounter",
}) => {
  const { segmentCounter, setSegmentCounter } = useBaseStore();
  const [isRotating, setIsRotating] = useState(false);
  const [yearGap, setYearGap] = useState<{ first: number; last: number }>(
    mockedData[segmentCounter - 1]?.yearGap || { first: 0, last: 0 }
  );
  const [activeTopic, setActiveTopic] = useState("");

  const circleRef = useRef<HTMLDivElement>(null);
  const currentRotation = useRef<number>(0);

  const isAdaptive = useBaseStore((state) => state.isAdaptive);

  // Auxiliary function for updating the rotation of numbers inside a circle
  const updateOptionNumbersRotation = (rotation: number) => {
    if (circleRef.current) {
      const numbers = circleRef.current.querySelectorAll(".option-number");
      numbers.forEach((num) => {
        gsap.set(num, {
          rotation: -rotation + ROTATION_OFFSET,
          transformOrigin: "center center",
        });
      });
    }
  };

  // Calculate the minimum difference between the current angle and the desired one, normalizing it in the range [-180, 180]
  const calculateShortestRotation = (targetSegment: number) => {
    const desiredRotation = getDesiredRotation(targetSegment);
    const delta =
      ((desiredRotation - currentRotation.current + 180) % 360) - 180;
    return delta < -180 ? delta + 360 : delta;
  };

  // Start the rotation animation when switching to the segment
  const rotateToSegment = useCallback(
    (targetSegment: number) => {
      if (!circleRef.current || targetSegment === segmentCounter) return;
      setIsRotating(true);
      const delta = calculateShortestRotation(targetSegment);
      currentRotation.current += delta - ROTATION_OFFSET;
      gsap.to(circleRef.current, {
        rotation: currentRotation.current,
        transformOrigin: "center",
        duration: GSAP_ANIMATION_DURATION,
        ease: "power2.out",
        onUpdate: () => {
          updateOptionNumbersRotation(currentRotation.current + 30);
        },
        onComplete: () => {
          setIsRotating(false);
        },
      });
      localStorage.setItem(storageKey, targetSegment.toString());
      setSegmentCounter(targetSegment);
    },
    [segmentCounter, setSegmentCounter, storageKey]
  );

  // Calculate circle options
  const renderOptions = () => {
    return Array.from({ length: SEGMENTS }, (_, index) => {
      const angle = SEGMENT_ANGLE * index;
      // Calculating coordinates
      const x = RADIUS * Math.cos((angle - 90) * (Math.PI / 180));
      const y = RADIUS * Math.sin((angle - 90) * (Math.PI / 180));

      return (
        <OptionContainer
          key={index + 1}
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <OptionDot
            $isActive={segmentCounter === index + 1}
            onClick={() => rotateToSegment(index + 1)}
          >
            <OptionNumber
              className="option-number"
              $isVisible={segmentCounter === index + 1}
            >
              {index + 1}
            </OptionNumber>
          </OptionDot>
        </OptionContainer>
      );
    });
  };

  // Initial rotation setup
  useEffect(() => {
    if (circleRef.current) {
      currentRotation.current = getDesiredRotation(segmentCounter);
      gsap.set(circleRef.current, {
        rotation: currentRotation.current - ROTATION_OFFSET,
        transformOrigin: "center",
      });
      updateOptionNumbersRotation(currentRotation.current);
    }
  }, []);

  // Setting up active topic on rotation's end
  useEffect(() => {
    if (!isRotating) {
      setActiveTopic(mockedData[segmentCounter - 1]?.topic);
    }
  }, [isRotating, segmentCounter]);

  // Setting up year gap
  useEffect(() => {
    const targetGap = mockedData[segmentCounter - 1]?.yearGap;
    if (!targetGap) return;
    const interval = setInterval(() => {
      setYearGap((prev) => {
        if (prev.first === targetGap.first && prev.last === targetGap.last) {
          clearInterval(interval);
          return prev;
        }
        return {
          first:
            prev.first < targetGap.first
              ? prev.first + 1
              : prev.first > targetGap.first
              ? prev.first - 1
              : prev.first,
          last:
            prev.last < targetGap.last
              ? prev.last + 1
              : prev.last > targetGap.last
              ? prev.last - 1
              : prev.last,
        };
      });
    }, 80);
    return () => clearInterval(interval);
  }, [segmentCounter]);

  return (
    <TimeCircleContainer>
      <HeaderWrapper>
        <PrimaryHeader>Исторические даты</PrimaryHeader>
      </HeaderWrapper>
      <CircleWrapper ref={circleRef}>{renderOptions()}</CircleWrapper>
      {isAdaptive && <SegmentSlider />}
      <SegmentSelectorWrapper>
        0{segmentCounter}/06
        <ButtonsWrapper>
          <ChevronWrapper>
            <CircleChevronLeft
              onClick={() =>
                rotateToSegment(segmentCounter === 1 ? 6 : segmentCounter - 1)
              }
              size={isAdaptive ? 30 : 50}
              strokeWidth={1}
            />
          </ChevronWrapper>
          <ChevronWrapper>
            <CircleChevronRight
              onClick={() =>
                rotateToSegment(segmentCounter === 6 ? 1 : segmentCounter + 1)
              }
              size={isAdaptive ? 30 : 50}
              strokeWidth={1}
            />
          </ChevronWrapper>
        </ButtonsWrapper>
      </SegmentSelectorWrapper>
      <ActiveLabel $isVisible={!isRotating}>{activeTopic}</ActiveLabel>
      <YearGap>
        <FirstYear>{yearGap.first || "?"}</FirstYear>
        <LastYear>{yearGap.last || "?"}</LastYear>
      </YearGap>
    </TimeCircleContainer>
  );
};

const TimeCircleContainer = styled.div`
  position: relative;
  margin: 0;
  width: auto;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    height: calc(100vh - 20px);
  }
`;

const CircleWrapper = styled.div`
  width: 530px;
  height: 530px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(66, 86, 122, 0.8);
  border-radius: 50%;
  z-index: 1;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  max-width: 430px;
  margin: 0;
  padding-left: 78px;
  border-width: 0 0 0 4px;
  border-style: solid;
  border-image: ${(props) =>
    `linear-gradient(to bottom, ${props.theme.promoBlue} 0%, ${props.theme.promoPink} 100%) 1`};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    border: 0;
    font-size: 20px;
    padding: 0;
    line-height: 1;
  }
`;

const PrimaryHeader = styled.h1`
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1.4em;
    line-height: 1.2;
    max-width: 123px;
    padding-left: 20px;
    margin-top: 60px;
  }
`;

const SegmentSelectorWrapper = styled.div`
  max-width: 120px;
  margin: 0 0 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: ${(props) => props.theme.textAlt};
  font-weight: 400;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 0 0 0 20px;
    font-size: 1em;
    align-items: flex-start;
    max-width: 70px;
  }
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-top: 4px;
  }
`;

const ChevronWrapper = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.1s;
  background: none;
  border: none;
  padding: 0;
  color: ${(props) => props.theme.button.color};

  &:hover {
    transition: 0.1s;
  }
`;

const OptionContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
`;

const OptionNumber = styled.div<{ $isVisible?: boolean }>`
  color: white;
  font-weight: bold;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s;
  font-size: 1.2rem;
`;

const OptionDot = styled.div<{ $isActive: boolean }>`
  position: absolute;
  width: ${(props) => (props.$isActive ? "56px" : "6px")};
  height: ${(props) => (props.$isActive ? "56px" : "6px")};
  background: #42567a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  transform: translate(-50%, -50%);
  opacity: ${(props) => (props.$isActive ? 1 : 0.3)};
  &:hover {
    opacity: 1;
    width: 56px;
    height: 56px;
    & > ${OptionNumber} {
      opacity: 1;
    }
  }
`;

const YearGap = styled.div`
  position: absolute;
  display: flex;
  gap: 0.5em;
  text-align: center;
  font-weight: 700;
  font-size: 10em;
  line-height: 160px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;

  @media (max-width: 1400px) {
    font-size: 8em;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 3.3em;
    top: 40%;
  }
`;

const FirstYear = styled.p`
  color: ${(props) => props.theme.promoBlue};
`;

const LastYear = styled(FirstYear)`
  color: ${(props) => props.theme.promoPink};
`;

const ActiveLabel = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  left: calc(50% + 176px);
  top: calc(50% - 238px);
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.text};
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 2;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export default TimeCircle;
