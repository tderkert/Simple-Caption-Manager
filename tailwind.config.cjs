const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      gridTemplateColumns: {
        'app': '1fr 340px'
      },
      gridTemplateRows: {
        'app': 'auto 1fr'
      }
    },
  },

  plugins: [],
};

module.exports = config;
