import React from "react";
import Marquee from "react-fast-marquee";

export default function Carousel() {
  const supportedLanguage = [
    {
      regionalName: "অসমীয়া",
      englishName: "Assamese",
    },
    {
      regionalName: "বাংলা",
      englishName: "Bengali",
    },

    {
      regionalName: "ગુજરાતી",
      englishName: "Gujarati",
    },
    {
      regionalName: "اردو",
      englishName: "Urdu",
    },
    {
      regionalName: "हिंदी",
      englishName: "Hindi",
    },
    {
      regionalName: "ಕನ್ನಡ",
      englishName: "Kannada",
    },
    {
      regionalName: "മലയാളം",
      englishName: "Malayalam",
    },
    {
      regionalName: "मराठी",
      englishName: "Marathi",
    },
    {
      regionalName: "ଓଡିଆ",
      englishName: "Odia",
    },
    {
      regionalName: "ਪੰਜਾਬੀ",
      englishName: "Punjabi",
    },
    {
      regionalName: "தமிழ்",
      englishName: "Tamil",
    },
    {
      regionalName: "తెలుగు",
      englishName: "Telugu",
    },
    {
      regionalName: "English",
      englishName: "English",
    },
    {
      regionalName: "Deutsch",
      englishName: "German",
    },
    {
      regionalName: "Français",
      englishName: "French",
    },
    {
      regionalName: "Italiano",
      englishName: "Italian",
    },
    {
      regionalName: "Español",
      englishName: "Spanish",
    },
    {
      regionalName: "Português",
      englishName: "Portuguese",
    },
    {
      regionalName: "Nederlands",
      englishName: "Dutch",
    },
    {
      regionalName: "Dansk",
      englishName: "Danish",
    },
  ];

  return (
    <div className="carousel carousel-center max-w-full p-4 space-x-4 bg-gray-100 rounded-box mt-12">
      <Marquee speed={80}>
        {supportedLanguage.map((element, index) => {
          return (
            <div
              className="carousel-item  md:w-72 md:h-72 h-52 w-52 rounded-lg bg-white flex flex-col items-center justify-center gap-4  mx-4"
              key={index}
            >
              <h2 className="text-4xl font-semibold font text-primary-900">
                {element.regionalName}
              </h2>
              {element.englishName ? (
                <p className="text-gray-500 text-lg">{element.englishName}</p>
              ) : null}
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
