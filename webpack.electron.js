module.exports = [
    {
        mode: 'development',
        entry: './src/main.ts',
        target: 'electron-main',
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        module: {
            rules: [{
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: __dirname + '/dist',
            filename: 'main.js'
        }
    },
    {
        mode: 'development',
        entry: './src/preload.ts',
        target: 'electron-preload',
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        module: {
            rules: [{
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: __dirname + '/dist',
            filename: 'preload.js'
        }
    }
]