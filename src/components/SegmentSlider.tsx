import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { mockedData } from "../utils/mocks";
import { useBaseStore } from "../stores/baseStore";
import { breakpoints } from "../styles/theme";

const FADE_DURATION = 700;

export const SegmentSlider: React.FC = () => {
  const swiperInstance = useRef<SwiperType | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isFading, setIsFading] = useState(true);
  const [segmentEvents, setSegmentEvents] = useState([
    { year: 0, description: "" },
  ]);

  const { segmentCounter } = useBaseStore();

  const isAdaptive = useBaseStore((state) => state.isAdaptive);

  useEffect(() => {
    setIsFading(true);
    const timeoutId = setTimeout(() => {
      setSegmentEvents(mockedData[segmentCounter - 1]?.events || []);
      setIsFading(false);
    }, FADE_DURATION);

    return () => clearTimeout(timeoutId);
  }, [segmentCounter]);

  if (segmentEvents.length === 0) {
    return <EmptyStub $isFading={isFading}>Никаких событий, сэр 🧐</EmptyStub>;
  }

  // if (isMobile) {
  //   return (
  //     <DotNavigation>
  //       {segmentEvents.slice(0, 6).map((_, index) => (
  //         <Dot key={index} $isActive={index === segmentCounter - 1} />
  //       ))}
  //     </DotNavigation>
  //   );
  // }

  return (
    <MainWrapper>
      <ChevronButton
        onClick={() => swiperInstance.current?.slidePrev()}
        $visible={canScrollLeft}
      >
        <CircleChevronLeft size={50} strokeWidth={1.6} />
      </ChevronButton>
      <StyledSwiper
        spaceBetween={window.innerWidth < breakpoints.tablet ? 30 : 50}
        slidesPerView={
          isAdaptive ? 1.5 : segmentEvents.length > 3 ? 3 : segmentEvents.length
        }
        $isGrabbing={isGrabbing}
        $canSwipe={segmentEvents.length > 3}
        $isFading={isFading}
        onSwiper={(swiper) => {
          swiperInstance.current = swiper;
          setCanScrollLeft(!swiper.isBeginning);
          setCanScrollRight(!swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setCanScrollLeft(!swiper.isBeginning);
          setCanScrollRight(!swiper.isEnd);
        }}
        onTouchStart={() => setIsGrabbing(true)}
        onTouchEnd={() => setIsGrabbing(false)}
      >
        {segmentEvents.map((el) => (
          <Event key={el.year}>
            <EventYear>{el.year}</EventYear>
            <EventDescription>{el.description}</EventDescription>
          </Event>
        ))}
      </StyledSwiper>
      <ChevronButton
        onClick={() => swiperInstance.current?.slideNext()}
        $visible={canScrollRight}
      >
        <CircleChevronRight size={50} strokeWidth={1.6} />
      </ChevronButton>
      {isAdaptive && (
        <DotNavigation>
          {segmentEvents.slice(0, 6).map((_, index) => (
            <Dot key={index} $isActive={index === segmentCounter - 1} />
          ))}
        </DotNavigation>
      )}
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 100px 20px 0 20px;
    padding-top: 10px;
    border-top: ${(props) => `1px solid ${props.theme.border}`};
    flex-direction: column;
  }
`;

const StyledSwiper = styled(Swiper)<{
  $isGrabbing: boolean;
  $canSwipe: boolean;
  $isFading: boolean;
}>`
  width: 100%;
  height: 135px;
  opacity: ${(props) => (props.$isFading ? 0 : 1)};
  transition: opacity ${FADE_DURATION}ms ease-in-out;
  cursor: ${(props) =>
    props.$canSwipe ? (props.$isGrabbing ? "grabbing" : "grab") : "inherit"};
  user-select: ${(props) => (props.$canSwipe ? "none" : "text")};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    max-height: 200px;
  }
`;

const Event = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  width: 320px;
  max-width: 100%;
  max-height: calc(100% - 2px);
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EventYear = styled.p`
  margin: 0 0 15px 0;
  color: ${(props) => props.theme.promoBlue};
`;

const EventDescription = styled.p`
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.text};
`;

const ChevronButton = styled.button<{ $visible: boolean }>`
  margin: 0 40px;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.2s;
  cursor: ${(props) => (props.$visible ? "pointer" : "default")};
  color: ${(props) => props.theme.button.color};

  &:hover {
    opacity: ${(props) => (props.$visible ? 0.5 : 0)};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const EmptyStub = styled.h4<{ $isFading: boolean }>`
  margin: 0 auto;
  height: 135px;
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.$isFading ? 0 : 1)};
  transition: opacity ${FADE_DURATION}ms ease-in-out;
  color: ${(props) => props.theme.gray};
`;

const DotNavigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Dot = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$isActive ? props.theme.promoBlue : props.theme.adaptiveInfoSegments};
  transition: background-color 0.3s;
`;

export default SegmentSlider;
