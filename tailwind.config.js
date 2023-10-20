/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.html", "js/*.js"],
  theme: {
    extend: {
      colors : {
        lime : "#cce63e", // lime green color - secondary
        graphite : "#272f34", // graphite color - primary
        charcoal : "#32393e", // lighter graphite color for contrast
        bogey : "#ffbb1e", // orange color for lower points
        birdies : "#289ff2" // lightblue color for higher scores
      }
    },
  },
  plugins: [],
}

