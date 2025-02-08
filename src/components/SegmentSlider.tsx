import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import { useMemo, useState } from "react";
import { mockedData } from "../utils/mocks";
import { useBaseStore } from "../stores/baseStore";

export const SegmentSlider: React.FC = () => {
  const { segmentCounter } = useBaseStore();
  const infoData = useMemo(
    () => mockedData[segmentCounter - 1].events,
    [segmentCounter]
  );

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const canSwipe = useMemo(() => infoData.length > 3, [infoData.length]);
  // Dynamic slides value
  const slidesToShow = canSwipe ? 3 : infoData.length;

  if (!infoData || infoData.length === 0) {
    return <EmptyStub>Никаких событий, сэр 🧐</EmptyStub>;
  }

  return (
    <MainWrapper>
      <ChevronButton
        onClick={() => swiperInstance?.slidePrev()}
        $visible={canScrollLeft}
      >
        <CircleChevronLeft size={50} strokeWidth={1.6} />
      </ChevronButton>
      <StyledSwiper
        spaceBetween={50}
        slidesPerView={slidesToShow}
        $isGrabbing={isGrabbing}
        $canSwipe={canSwipe}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
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
        {infoData.map((el) => (
          <Event key={el.year}>
            <EventYear>{el.year}</EventYear>
            <EventDescription>{el.description}</EventDescription>
          </Event>
        ))}
      </StyledSwiper>
      <ChevronButton
        onClick={() => swiperInstance?.slideNext()}
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
}>`
  width: 100%;
  height: 135px;
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
`;

const ChevronButton = styled.button<{ $visible: boolean }>`
  margin: 0 40px;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: 0.2s;
  cursor: ${(props) => (props.$visible ? "pointer" : "default")};

  &:hover {
    opacity: ${(props) => (props.$visible ? 0.5 : 0)};
  }
`;

const EmptyStub = styled.h4`
  margin: 0 auto;
  color: gray;
`;
