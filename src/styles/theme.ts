export const breakpoints = {
  mobile: 766,
  tablet: 900,
};

export const base = {
  oceanDeep: "rgba(66, 86, 122, 0.8)",
  white: "#ffffff",
  black: "#000000",
  almostWhite: "rgba(255, 255, 255, 0.87)",
  heavyWhite: "rgba(220, 220, 220, 0.87)",
  almostBlack: "rgba(0, 0, 0, 0.87)",
  darkGray: "#242424",
  lightGray: "#888888",
  promoBlue: "#3877ee",
  promoPink: "#ef5da8",
};

export const light = {
  ...base,
  buttonColor: base.oceanDeep,
  hoveredButtonColor: base.almostBlack,
  mainHeaderColor: base.almostBlack,
};

export const dark = {
  ...base,
  buttonColor: base.white,
  hoveredButtonColor: base.almostWhite,
  mainHeaderColor: base.almostWhite,
};

export const baseTheme = {
  border: base.oceanDeep,
  promoBlue: base.promoBlue,
  promoPink: base.promoPink,
  breakpoints: {
    mobile: `${breakpoints.mobile}px`,
    tablet: `${breakpoints.tablet}px`,
  },
};

export const lightTheme = {
  ...baseTheme,
  background: base.white,
  text: base.almostBlack,
  textAlt: base.oceanDeep,
  adaptiveInfoSegments: base.heavyWhite,
  button: {
    color: light.buttonColor,
    hover: base.lightGray,
  },
};

export const darkTheme = {
  ...baseTheme,
  background: base.darkGray,
  text: dark.almostWhite,
  textAlt: base.almostWhite,
  adaptiveInfoSegments: base.almostWhite,
  button: {
    color: dark.buttonColor,
    hover: base.lightGray,
  },
};
