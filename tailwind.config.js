/** @type {import('tailwindcss').Config} */


export const content = ["./src/**/*.{html,js}"];
export const theme = {
  extend: {},
};
export const daisyui = {
  themes: [
    {
      mytheme: {
        "primary": "#a991f7",
        "secondary": "#f6d860",
        "accent": "#37cdbe",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
      },
    },
    "dark",
    "cupcake",
  ],
};
export const plugins = [require("daisyui")];
export const resolve = {
  extensions: ['.js', '.jsx']
};

