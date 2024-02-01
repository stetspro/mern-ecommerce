import winston from 'winston';
import config from '../config/config.js';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue'
    }
}

let transports = [];

if (config.environment === 'dev') {
    transports = [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
} else if (config.environment === 'prod') {
    transports = [
        new winston.transports.File({ filename: './errors.log', level: 'info'})
    ]
}

winston.addColors(customLevelOptions.colors)

export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}