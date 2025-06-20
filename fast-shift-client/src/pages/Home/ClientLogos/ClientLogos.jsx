import Marquee from "react-fast-marquee";

// Import local logo assets
import logo1 from "../../../assets/assets/brands/amazon.png";
import logo2 from "../../../assets/assets/brands/amazon_vector.png";
import logo3 from "../../../assets/assets/brands/casio.png";
import logo4 from "../../../assets/assets/brands/moonstar.png";
import logo5 from "../../../assets/assets/brands/randstad.png";
import logo6 from "../../../assets/assets/brands/start-people 1.png";
import logo7 from "../../../assets/assets/brands/start.png";

const ClientLogos = () => {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

  return (
    <div className="my-12 px-4">
      <h2 className="text-2xl  mb-12 font-semibold text-center ">
        We've helped thousands of sales teams
      </h2>
      <Marquee pauseOnHover={true} speed={50} gradient={false} direction="right">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Client logo ${index + 1}`}
            className="mx-24 h-6 object-contain"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default ClientLogos;
