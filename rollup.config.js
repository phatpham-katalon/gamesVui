import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/game.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    resolve({
      extensions: ['.ts', '.js']
    }),
    commonjs(),
    typescript(),
    !production && serve({
      open: true,
      contentBase: ['dist', 'src/assets'],
      host: 'localhost',
      port: 3000
    }),
    !production && livereload('dist')
  ]
};
