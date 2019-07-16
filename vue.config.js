const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const resolve = file => path.resolve(__dirname, file);

const TARGET_NODE = process.env.BUILD_TARGET === 'node';
const isDev = process.env.NODE_ENV && process.env.NODE_ENV.indexOf('dev') > -1;

/**
 * 服务器端 webpack 配置。
 */
const serverConfig = {
    // 将 entry 指向应用程序的 server entry 文件
    entry: './src/entry-server.js',

    // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
    // 并且还会在编译 Vue 组件时，
    // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
    target: 'node',

    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map',

    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    output: {
        libraryTarget: 'commonjs2'
    },

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块。
        // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
        // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
        whitelist: /\.css$/
    }),

    optimization: {
        splitChunks: false
    },

    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    plugins: [
        new VueSSRServerPlugin(),
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': '"server"' // 配置 vue 的环境变量，告诉 vue 是服务端渲染，就不会做耗性能的 dom-diff 操作了
        })
    ]
};

/**
 * 客户端 webpack 配置。
 */
const clientConfig = {
    entry: './src/entry-client.js',
    plugins: [
        // 此插件在输出目录中
        // 生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin()
    ].concat(isDev ? [] : [
        new CopyWebpackPlugin([
            {
                from: resolve('./server'),
                to: resolve('./dist/server'),
                toType: 'dir'
            },
            {
                from: resolve('./package.json'),
                to: resolve('./dist')
            },
            /* {
                from: resolve('./package-lock.json'),
                to: resolve('./dist')
            }, */
            {
                from: resolve('./yarn.lock'),
                to: resolve('./dist')
            }
        ])
    ])
};

module.exports = {
    assetsDir: 'static',
    devServer: {
        historyApiFallback: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
    },

    css: {
        extract: !TARGET_NODE,
        sourceMap: !isDev && !TARGET_NODE // if enable sourceMap:  fix ssr load Critical CSS throw replace of undefind
    },

    configureWebpack: () => {
        return TARGET_NODE ? serverConfig : clientConfig;
    },

    chainWebpack: config => {
        if (TARGET_NODE) {
            // fix ssr bug: document not found -- https://github.com/Akryum/vue-cli-plugin-ssr/blob/master/lib/webpack.js
            /* 改由 css.extract 配置实现
            const isExtracting = config.plugins.has('extract-css');
            if (isExtracting) {
                // Remove extract
                const langs = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
                const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
                for (const lang of langs) {
                    for (const type of types) {
                        const rule = config.module.rule(lang).oneOf(type);
                        rule.uses.delete('extract-css-loader');
                        // Critical CSS
                        rule
                            .use('vue-style')
                            .loader('vue-style-loader')
                            .before('css-loader');
                    }
                }
                config.plugins.delete('extract-css');
            } */

            config.module
                .rule('vue')
                .use('cache-loader')
                .tap(options => {
                    // Change cache directory for server-side
                    options.cacheIdentifier += '-server';
                    options.cacheDirectory += '-server';
                    return options;
                });
        }

        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                if (TARGET_NODE) {
                    options.cacheIdentifier += '-server';
                    options.cacheDirectory += '-server';
                }
                options.optimizeSSR = TARGET_NODE;
                return options;
            });

        // fix ssr hot update bug
        if (TARGET_NODE) {
            config.plugins.delete('hmr');
        }
    }
};
