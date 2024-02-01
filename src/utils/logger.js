import winston from 'winston'

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'orange',
        info: 'green',
        debug: 'blue'
    }
}

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: './errors.log', level: 'warning'})
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}