import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import bannerImg1 from "../../../assets/assets/banner/banner1.png";
import bannerImg2 from "../../../assets/assets/banner/banner2.png";
import bannerImg3 from "../../../assets/assets/banner/banner3.png";
const Banner = () => {
  return (
    <Carousel
      showThumbs={false}
      autoPlay={true}
      infiniteLoop={true}
      className="py-8"
    >
      <div>
        <img src={bannerImg1} />
      </div>
      <div>
        <img src={bannerImg2} />
      </div>
      <div>
        <img src={bannerImg3} />
      </div>
    </Carousel>
  );
};

export default Banner;
