import { Button } from "@/components/ui/button";
import LandingCard from "@/components/ui/main/landing-card";
import LandingPageNavbar from "@/components/ui/main/landing-page-navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative py-[40px] px-6 text-color overflow-hidden">
      <Image
        src={"/image/blur1.svg"}
        alt="blur"
        width={"300"}
        height={"300"}
        className="absolute top-48 left-80 -z-10 blur-[400px] max-[1147px]:left-0 max-sm:top-56 max-sm:-left-40"
      />
      <LandingPageNavbar />
      <div className="flex flex-col items-center sm:mt-16 mt-10  gap-4">
        <h1 className="text-color font-bold sm:text-5xl text-3xl  text-center">
          Discover Sawai: Your Creative and <br className="max-sm:hidden" />
          Intelligent Generator
        </h1>
        <p className="sm:font-normal text-sm sm:text-lg text-[#878788] text-center">
          Sawai is a revolutionary tool that simplifies and enhances your
          <br className="max-sm:hidden" />
          professional and creative life, offering text, image, and audio
          generation <br className="max-sm:hidden" /> for seamless innovation.
        </p>
      </div>
      <div className="w-full flex justify-center text-center mt-7">
        <Link href={""}>
          <Button className="flex items-center gap-3 py-5 px-12 text-color bg-[#27282a] border border-[#616264] border-opacity-90 ">
            Continue
            <i className="fa-solid fa-arrow-right text-color"></i>
          </Button>
        </Link>
      </div>

      {/*  */}
      <div className="sm:max-w-4xl w-full m-auto gap-x-16 gap-y-10 mt-14 mb-20 flex items-center justify-center flex-wrap">
        <LandingCard
          titre="Text"
          bgColor="bg-[#374333]"
          icon={<i className="fa-solid fa-message text-[#91DB66] text-3xl"></i>}
        />
        <LandingCard
          titre="Audio"
          bgColor="bg-[#43282A]"
          icon={
            <i className="fa-sharp fa-solid fa-circle-play text-[#BE2727] text-3xl"></i>
          }
        />
        <LandingCard
          titre="Code"
          bgColor="bg-[#412E26]"
          icon={<i className="fa-solid fa-code text-[#AA4716] text-3xl"></i>}
        />
        <LandingCard
          titre="Image"
          bgColor="bg-[#213E49]"
          icon={<i className="fa-solid fa-image text-[#02B8F5] text-3xl"></i>}
        />
      </div>
      <div className="w-full flex flex-col gap-2 items-center text-center justify-center">
        <div className="border-t-4 border-dashed border-[#4e4e4f] w-56"></div>
        <Link
          href={"https://github.com/Appolinaire-SAWADOGO"}
          className="group"
        >
          <span className="text-color opacity-70 font-normal text-center max-sm:text-base flex items-center gap-2">
            <i className="fa-brands fa-github text-base"></i>
            <span className="group-hover:underline text-sm font-light">
              @Create by appolinaire sdg
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
