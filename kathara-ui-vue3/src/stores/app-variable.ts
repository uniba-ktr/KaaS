import { defineStore } from "pinia";

export const useAppVariableStore = defineStore({
  id: "appVariable",
  state: () => {
    return {
      font: {
        family: getComputedStyle(document.body)
          .getPropertyValue("--bs-body-font-family")
          .trim(),
        size: getComputedStyle(document.body)
          .getPropertyValue("--bs-body-font-size")
          .trim(),
        weight: getComputedStyle(document.body)
          .getPropertyValue("--bs-body-font-weight")
          .trim(),
      },
      color: {
        theme: getComputedStyle(document.body)
          .getPropertyValue("--bs-theme")
          .trim(),
        blue: getComputedStyle(document.body)
          .getPropertyValue("--bs-blue")
          .trim(),
        green: getComputedStyle(document.body)
          .getPropertyValue("--bs-green")
          .trim(),
        orange: getComputedStyle(document.body)
          .getPropertyValue("--bs-orange")
          .trim(),
        red: getComputedStyle(document.body)
          .getPropertyValue("--bs-red")
          .trim(),
        cyan: getComputedStyle(document.body)
          .getPropertyValue("--bs-cyan")
          .trim(),
        purple: getComputedStyle(document.body)
          .getPropertyValue("--bs-purple")
          .trim(),
        yellow: getComputedStyle(document.body)
          .getPropertyValue("--bs-yellow")
          .trim(),
        indigo: getComputedStyle(document.body)
          .getPropertyValue("--bs-indigo")
          .trim(),
        pink: getComputedStyle(document.body)
          .getPropertyValue("--bs-pink")
          .trim(),
        black: getComputedStyle(document.body)
          .getPropertyValue("--bs-black")
          .trim(),
        white: getComputedStyle(document.body)
          .getPropertyValue("--bs-white")
          .trim(),
        gray: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray")
          .trim(),
        dark: getComputedStyle(document.body)
          .getPropertyValue("--bs-dark")
          .trim(),
        gray100: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-100")
          .trim(),
        gray200: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-200")
          .trim(),
        gray300: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-300")
          .trim(),
        gray400: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-400")
          .trim(),
        gray500: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-500")
          .trim(),
        gray600: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-600")
          .trim(),
        gray700: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-700")
          .trim(),
        gray800: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-800")
          .trim(),
        gray900: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-900")
          .trim(),

        themeRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-theme-rgb")
          .trim(),
        blueRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-blue-rgb")
          .trim(),
        greenRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-green-rgb")
          .trim(),
        orangeRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-orange-rgb")
          .trim(),
        redRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-red-rgb")
          .trim(),
        cyanRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-cyan-rgb")
          .trim(),
        purpleRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-purple-rgb")
          .trim(),
        yellowRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-yellow-rgb")
          .trim(),
        indigoRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-indigo-rgb")
          .trim(),
        pinkRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-pink-rgb")
          .trim(),
        blackRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-black-rgb")
          .trim(),
        whiteRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-white-rgb")
          .trim(),
        grayRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-rgb")
          .trim(),
        darkRgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-dark-rgb")
          .trim(),
        gray100Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-100-rgb")
          .trim(),
        gray200Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-200-rgb")
          .trim(),
        gray300Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-300-rgb")
          .trim(),
        gray400Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-400-rgb")
          .trim(),
        gray500Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-500-rgb")
          .trim(),
        gray600Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-600-rgb")
          .trim(),
        gray700Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-700-rgb")
          .trim(),
        gray800Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-800-rgb")
          .trim(),
        gray900Rgb: getComputedStyle(document.body)
          .getPropertyValue("--bs-gray-900-rgb")
          .trim(),
      },
    };
  },
});
