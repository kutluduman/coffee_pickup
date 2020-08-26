// This is the config file for tailwindcss https://tailwindcss.com/docs/configuration

module.exports = {
  purge: [],
  theme: {
    fontFamily: {
      display: ["Playfair\\ Display"],
      body: ["Nunito"],
    },

    extend: {
      maxHeight: {
        "menu-card": "180",
        "shopping-cart": "18rem",
      },
      minHeight: {
        "shopping-cart": "18rem",
      },

      height: {
        "sm-feature": "13.75rem",
        "md-feature": "27.25rem",
        "lg-feature": "35rem",
      },
      colors: {
        "regal-blue": "#243c5a",
        "coffee-brown": "#D59D66",
        ash: "#2B2F33",
        "light-grey": "#A8A8A8",
      },
      backgroundImage: (theme) => ({
        "feature-img": "url('/images/feature-img.png')",
      }),
    },
  },
  variants: {},
  plugins: [],
};
