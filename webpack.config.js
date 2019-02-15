// 自带模块
const path = require('path');

// 第三方模块
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 私有模块
const pkg = require('./package.json');
const buildConfig = require('./buildConfig');
const localeMessages = require('./src/i18n/locale.json');

// 预设变量
const ENV = process.env.NODE_ENV || 'development';
const IS_PROD = ENV === 'production';

const BUILD_DOMAIN = process.env.BUILD_DOMAIN || 'localhost';
const config = buildConfig[BUILD_DOMAIN];

const VERSION = `v${pkg.version}`;
const ASSET_PATH = process.env.ASSET_PATH || '/';
const SOURCE_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'build');
const CLIENT_DIR = path.join(OUTPUT_DIR, VERSION);

module.exports = {
  mode: ENV,
  target: 'web',
  context: SOURCE_DIR,
  entry: {
    app: './index.js',
  },
  output: {
    path: CLIENT_DIR,
    publicPath: ASSET_PATH,
    filename: 'assets/[name].[hash:8].js',
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest', // 开发模式下自动开启
    },
    minimize: true, // 代替 uglifyjs-plugin ，生产模式下自动开启
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [{
      test: /\.(jsx|js)$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
        {
          loader: 'eslint-loader',
          options: {
            fix: true,
          },
        },
      ],
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: IS_PROD ? [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[path][name]__[local]-[hash:8]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({
              browsers: 'last 5 versions',
            })],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [SOURCE_DIR],
          },
        },
      ] : [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true, // 开启 CSS 模块化
            localIdentName: '[path][name]__[local]-[hash:8]',
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({
              browsers: 'last 5 versions',
            })],
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [SOURCE_DIR],
          },
        },
      ],
    },
    {
      test: /\.less$/,
      include: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({
              browsers: 'last 5 versions',
            })],
            sourceMap: true,
          },
        },
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    }, {
      test: /\.css$/,
      include: /node_modules/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer({
              browsers: 'last 5 versions',
            })],
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.(jpe?g|png|gif)(\?.*)?$/i,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/images/',
          limit: 8192, // 小于 8KB 的图片被 base64 编码
        },
      },
    },
    {
      test: /\.(svg|woff2?|ttf|eot)(\?.*)?$/i,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'assets/fonts/',
          limit: 8192, // 大于 8KB 的字体文件会被单独打包
        },
      },
    },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ // 定义全局变量
      'process.env.NODE_ENV': JSON.stringify(ENV),
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      'process.env.BUILD_CONFIG': JSON.stringify(config),
      'process.env.BUILD_LOCALE_MESSAGES': JSON.stringify(localeMessages),
    }),
    new MiniCssExtractPlugin({
      // 代替 extract-text-webpack-plugin
      filename: 'assets/css/style.[hash:8].css',
      chunkFilename: 'assets/css/[id].[hash:8].css',
    }),
    new HtmlWebpackPlugin({
      title: 'A React App for News Recommendation',
      filename: 'index.html',
      template: './index.ejs',
    }),
    new CleanWebpackPlugin(OUTPUT_DIR),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: IS_PROD ? 'source-map' : 'eval-source-map',
  devServer: {
    port: process.env.PORT || 8080,
    host: 'localhost',
    publicPath: '/',
    contentBase: SOURCE_DIR,
    historyApiFallback: true,
    hot: true,
    overlay: true, // 将 ESLint 报错输出到控制台
  },
};