export default {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        port: 3000,
        open: true,
        hot: true,
    },
};
