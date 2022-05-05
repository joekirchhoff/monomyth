import { createGlobalStyle } from "styled-components";
import '../fonts/Montserrat/Montserrat-VariableFont_wght.ttf';
import '../fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf';
import backgroundImg from '../images/binding_dark.webp';

// Global styling and CSS reset
const GlobalStyle = createGlobalStyle`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  *, *::before, *::after {
    box-sizing: border-box;
    font-family: 'Montserrat';
  }
  body {
    background-color: ${props => props.theme.bgMainColor};
    color: ${props => props.theme.textMainColor};
    background-image: url(${backgroundImg});
  }
  #root { // Keeps the footer to bottom of page; all page containers require "flex: 1"
    min-height: 100vh;
    display: flex;
    flex-flow: column nowrap;
  }
  @font-face {
    font-family: 'MontserratItalic';
    src: local("MontserratItalic"),
      url('./fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf') format('truetype');
    font-style: italic;
  }
  @font-face {
    font-family: 'Montserrat';
    src: local("Montserrat"),
      url('./fonts/Montserrat/Montserrat-VariableFont_wght.ttf') format('truetype');
      font-style: normal;
  }
  a {
    text-decoration: none;
  }
`

export default GlobalStyle