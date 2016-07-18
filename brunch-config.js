exports.config = {

  files: {
    javascripts: { joinTo: 'app.js' },
    stylesheets: { joinTo: 'app.css' }
  },

  plugins: {
    babel: { presets: ['es2015', 'react', 'stage-0'] },
    postcss: {
      processors: [
        require('autoprefixer')(['last 4 versions'])
      ]
    }
  }
};
