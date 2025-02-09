import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { mockedData } from "../utils/mocks";
import { useBaseStore } from "../stores/baseStore";

export const SegmentSlider: React.FC = () => {
  const swiperInstance = useRef<SwiperType | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(
    mockedData[0]?.events || []
  );

  const { segmentCounter } = useBaseStore();

  // Загружаем новые данные только после завершения анимации
  useEffect(() => {
    setIsFading(true);
    const timeout = setTimeout(() => {
      setCurrentSegment(mockedData[segmentCounter - 1]?.events || []);
      setIsFading(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, [segmentCounter]);

  // Запоминаем данные, чтобы уменьшить лишние ререндеры
  const eventsData = useMemo(() => currentSegment, [currentSegment]);
  const canSwipe = useMemo(() => eventsData.length > 3, [eventsData.length]);
  const slidesToShow = canSwipe ? 3 : eventsData.length;

  if (eventsData.length === 0) {
    return <EmptyStub $isFading={isFading}>Никаких событий, сэр 🧐</EmptyStub>;
  }

  return (
    <MainWrapper>
      <ChevronButton
        onClick={() => swiperInstance.current?.slidePrev()}
        $visible={canScrollLeft}
      >
        <CircleChevronLeft size={50} strokeWidth={1.6} />
      </ChevronButton>
      <StyledSwiper
        spaceBetween={50}
        slidesPerView={slidesToShow}
        $isGrabbing={isGrabbing}
        $canSwipe={canSwipe}
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
        {eventsData.map((el) => (
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
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
`;

const StyledSwiper = styled(Swiper)<{
  $isGrabbing: boolean;
  $canSwipe: boolean;
  $isFading: boolean;
}>`
  width: 100%;
  height: 135px;
  opacity: ${(props) => (props.$isFading ? 0 : 1)};
  transition: opacity 0.7s ease-in-out;
  cursor: ${(props) =>
    props.$canSwipe ? (props.$isGrabbing ? "grabbing" : "grab") : "inherit"};
  user-select: ${(props) => (props.$canSwipe ? "none" : "text")};
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
  color: #3877ee;
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
  transition: 0.2s;
  cursor: ${(props) => (props.$visible ? "pointer" : "default")};
  color: ${(props) => props.theme.button.color};

  &:hover {
    opacity: ${(props) => (props.$visible ? 0.5 : 0)};
  }
`;

const EmptyStub = styled.h4<{ $isFading: boolean }>`
  margin: 0 auto;
  height: 135px;
  display: flex;
  align-items: center;
  opacity: ${(props) => (props.$isFading ? 0 : 1)};
  transition: opacity 0.7s ease-in-out;
  color: ${(props) => props.theme.gray};
`;
