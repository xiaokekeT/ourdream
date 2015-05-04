var webpack = require('webpack');
var bower_dir = __dirname + '/public/bower_components';

var config = {
    debug: process.env.NODE_ENV === 'production' ? false : true,
    // 增加第三方
    addVendor: function(name, path) {
        this.resolve.alias[name] = path;
        this.module.noParse.push(new RegExp('^' + name + '$'));
    },
    // 入口文件
    entry: {
        app: ['./public/js/app.js'],
        vendors: ['react']
    },
    // 指定别名
    resolve: {
        alias: {},
        modulesDirectories: ['bower_components',
            'node_modules'
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    // 编译文件
    output: {
        path: process.env.NODE_ENV === 'production' ? './public/dist' : './public/build',
        filename: "bundle.js",
        publicPath: '/public'
    },
    module: {
        noParse: [],
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader' //?optional=runtime
        }]
    }
};


// 不加到bundle来
config.addVendor('react', bower_dir + '/react/react.min.js');
//config.addVendor('bootstrap', bower_dir + '/bootstrap/dist/js/bootstrap.min.js');
//config.addVendor('jquery', bower_dir + '/jquery/dist/jquery.min.js');

module.exports = config;