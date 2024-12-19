// @ts-nocheck
import { Component, CSSProperties } from "react";
import { Button, Images, Image } from "./styles";

import { ReactComponent as ArrowL } from "~assets/left_arrow.svg";
import { ReactComponent as ArrowR } from "~assets/right_arrow.svg";

type ImageProps = {
  banner: string;
  thumbs: string;
}

interface ImagesCarouselProps {
  images: ImageProps[];
  toShow?: number;
  initialActiveIndex?: number;
  setImage: Function;
  style?: CSSProperties;
}

export class ImagesCarousel extends Component<ImagesCarouselProps, {}> {
  myArrow({ type, onClick, isEdge }) {
    return (
      <Button onClick={onClick} disabled={isEdge}>
        {type === "PREV" ? <ArrowL /> : <ArrowR />}
      </Button>
    );
  }

  carousel;

  render() {
    const { images, setImage, style = {}, toShow = 6 } = this.props;

    return (
      <Images
        isRTL={false}
        itemsToShow={toShow}
        ref={(ref) => (this.carousel = ref)}
        pagination={false}
        renderArrow={this.myArrow}
        imagesLength={images.length}
        style={style}
      >
        {images.map(({ banner, thumbs }) => (
          <Image
            key={thumbs}
            onClick={() => setImage(banner)}
            url=""
            src={thumbs}
          />
        ))}
      </Images>
    );
  }
}
