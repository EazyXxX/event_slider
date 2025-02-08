export const base = {
  oceanDeep: "rgba(66, 86, 122, 0.8)",
  lightOceanDeep: "rgba(66, 86, 122, 0.8)",
  white: "#ffffff",
  black: "#000000",
  almostWhite: "rgba(255, 255, 255, 0.87)",
  almostBlack: "rgba(0, 0, 0, 0.87)",
  gray: "#242424",
  lightGray: "#888888",
  darkGray: "#535bf2",
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
};

export const lightTheme = {
  ...baseTheme,
  background: base.white,
  text: base.almostBlack,
  button: {
    color: light.buttonColor,
    hover: base.darkGray,
  },
};

export const darkTheme = {
  ...baseTheme,
  background: base.gray,
  text: dark.almostWhite,
  button: {
    color: dark.buttonColor,
    hover: base.lightGray,
  },
};
