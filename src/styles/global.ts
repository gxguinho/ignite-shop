import { globalCss } from ".";

export const globalStyle = globalCss({
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  body: {
    "-webkit-font-smoothing": "antialiased",
    backgroundColor: "$gray900",
    color: "$gray100",
  },

  "body, input, textarea, button": {
    fontFamily: "--font-roboto",
    fontWeight: 400,
  },
});
