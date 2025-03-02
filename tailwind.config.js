/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'neco-black': ['Neco-Black'],
        'neco-blackitalic': ['Neco-BlackItalic'],
        'neco-bold': ['Neco-Bold'],
        'neco-bolditalic': ['Neco-BoldItalic'],
        'neco-italic': ['Neco-Italic'],
        'neco-medium': ['Neco-Medium'],
        'neco-mediumitalic': ['Neco-MediumItalic'],
        'neco': ['Neco-Regular'],
        'poppins-extralight': ['Poppins-ExtraLight'],
        'poppins-thin': ['Poppins-Thin'],
        'poppins-thinitalic': ['Poppins-ThinItalic'],
        'poppins-black': ['Poppins-Black'],
        'poppins-blackitalic': ['Poppins-BlackItalic'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-bolditalic': ['Poppins-BoldItalic'],
        'poppins-extrabold': ['Poppins-ExtraBold'],
        'poppins-extrabolditalic': ['Poppins-ExtraBoldItalic'],
        'poppins-extralightitalic': ['Poppins-ExtraLightItalic'],
        'poppins-italic': ['Poppins-Italic'],
        'poppins-light': ['Poppins-Light'],
        'poppins-lightitalic': ['Poppins-LightItalic'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-mediumitalic': ['Poppins-MediumItalic'],
        'poppins': ['Poppins-Regular'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-semibolditalic': ['Poppins-SemiBoldItalic'],
      },
    },
  },
  plugins: [],
}