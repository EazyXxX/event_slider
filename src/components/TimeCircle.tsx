import styled from "styled-components";
import {
  ChevronLeftCircle as CircleChevronLeft,
  ChevronRightCircle as CircleChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { mockedTopics, mockedData } from "../utils/mocks";

const SEGMENTS = mockedTopics.length;
const SEGMENT_ANGLE = 360 / SEGMENTS; // 60°

const getDesiredRotation = (targetSegment: number) => {
  return 60 - SEGMENT_ANGLE * (targetSegment - 1);
};

interface TimeCircleProps {
  storageKey?: string;
}

export const TimeCircle: React.FC<TimeCircleProps> = ({
  storageKey = "segmentCounter",
}) => {
  const [segmentCounter, setSegmentCounter] = useState<number>(
    parseInt(localStorage.getItem(storageKey) || "1")
  );
  // Состояние для контроля анимации (вращения)
  const [isRotating, setIsRotating] = useState(false);

  const circleRef = useRef<HTMLDivElement>(null);
  // Храним накопленный угол поворота всего колеса
  const currentRotation = useRef<number>(0);

  // При монтировании сразу устанавливаем положение колеса без анимации
  useEffect(() => {
    if (circleRef.current) {
      currentRotation.current = getDesiredRotation(segmentCounter);
      gsap.set(circleRef.current, {
        rotation: currentRotation.current - 30,
        transformOrigin: "center",
      });
      // Обновляем только числа внутри этого блока
      const numbers = circleRef.current.querySelectorAll(".option-number");
      numbers.forEach((num) => {
        gsap.set(num, {
          rotation: -currentRotation.current + 30,
          transformOrigin: "center center",
        });
      });
    }
  }, []); // выполняется один раз при монтировании

  // Вычисляем минимальную разницу между текущим углом и желаемым, нормализуя её в диапазоне [-180, 180]
  const calculateShortestRotation = (targetSegment: number) => {
    const desiredRotation = getDesiredRotation(targetSegment);
    let delta = desiredRotation - currentRotation.current;
    delta = ((((delta + 180) % 360) + 360) % 360) - 180;
    return delta;
  };

  // При переключении сегмента запускаем анимацию вращения
  const rotateToSegment = useCallback(
    (targetSegment: number) => {
      if (!circleRef.current) return;
      setIsRotating(true);
      const delta = calculateShortestRotation(targetSegment);
      currentRotation.current += delta - 30;
      gsap.to(circleRef.current, {
        rotation: currentRotation.current,
        transformOrigin: "center",
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          if (circleRef.current) {
            const numbers =
              circleRef.current.querySelectorAll(".option-number");
            numbers.forEach((num) => {
              gsap.set(num, {
                rotation: -currentRotation.current,
                transformOrigin: "center center",
              });
            });
          }
        },
        onComplete: () => {
          setIsRotating(false);
        },
      });
      localStorage.setItem(storageKey, targetSegment.toString());
      setSegmentCounter(targetSegment);
    },
    [storageKey]
  );

  useEffect(() => {
    console.log(mockedData[segmentCounter - 1]);
  }, [segmentCounter]);

  return (
    <TimeCircleContainer>
      <HeaderWrapper>
        <h1>Исторические даты</h1>
      </HeaderWrapper>
      <CircleWrapper ref={circleRef}>
        {Array.from({ length: SEGMENTS }, (_, index) => {
          const angle = SEGMENT_ANGLE * index;
          const radius = 250;
          const x = radius * Math.cos((angle - 90) * (Math.PI / 180));
          const y = radius * Math.sin((angle - 90) * (Math.PI / 180));
          return (
            <OptionContainer
              key={index + 1}
              style={{
                left: "50%",
                top: "50%",
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
        })}
      </CircleWrapper>
      <SegmentSelectorWrapper>
        0{segmentCounter}/06
        <ButtonsWrapper>
          <ChevronWrapper>
            <CircleChevronLeft
              onClick={() =>
                rotateToSegment(segmentCounter === 1 ? 6 : segmentCounter - 1)
              }
              size={50}
              strokeWidth={1}
            />
          </ChevronWrapper>
          <ChevronWrapper>
            <CircleChevronRight
              onClick={() =>
                rotateToSegment(segmentCounter === 6 ? 1 : segmentCounter + 1)
              }
              size={50}
              strokeWidth={1}
            />
          </ChevronWrapper>
        </ButtonsWrapper>
      </SegmentSelectorWrapper>
      <ActiveLabel $isVisible={!isRotating}>
        {mockedData[segmentCounter - 1].topic}
      </ActiveLabel>
      <YearGap>
        <FirstYear>{mockedData[segmentCounter - 1].yearGap.first}</FirstYear>
        <LastYear>{mockedData[segmentCounter - 1].yearGap.last}</LastYear>
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
`;

const HeaderWrapper = styled.div`
  display: flex;
  max-width: 430px;
  margin: 0;
  padding-left: 78px;
  border-image: linear-gradient(to bottom, #3877ee 0%, #ef5da8 100%) 1;
  border-width: 0 0 0 4px;
  border-style: solid;
`;

const SegmentSelectorWrapper = styled.div`
  max-width: 120px;
  margin: 0 0 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #42567a;
  font-weight: 400;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChevronWrapper = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: 0.1s;
  color: #42567a;
  background: none;
  border: none;
  padding: 0;
  &:hover {
    color: #303f5c;
    transition: 0.1s;
  }
`;

const OptionContainer = styled.div`
  position: absolute;
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
  font-size: 160px;
  line-height: 160px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
`;

const FirstYear = styled.p`
  color: #3877ee;
`;

const LastYear = styled(FirstYear)`
  color: #ef5da8;
`;

const ActiveLabel = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  left: calc(50% + 176px);
  top: calc(50% - 238px);
  font-size: 24px;
  font-weight: 700;
  color: #42567a;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 2;
`;
