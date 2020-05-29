import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
// import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

// const WIDGET_URL = process.env.WIDGET_URL;

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/khalti-checkout.js',
    format: 'iife',
    name: 'KhaltiCheckout'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(),
    // replace({
    //   __WIDGET_URL__: JSON.stringify(WIDGET_URL)
    // }),
    uglify()
  ]
};
