import winston from "winston";
//Winston, a powerful logging library, to log messages in your application. 
// It helps you track errors, warnings, and other important events, making debugging and monitoring easier.

const logger = winston.createLogger({
    level:process.env.NODE_ENV === "production" ? "info" : "debug",
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack:true}),
        winston.format.splat(),
        winston.format.json(),
    ),
    defaultMeta:{service :'identity-service'},
    transports:[
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({filename:"error.log",level:"error"}),
        new winston.transports.File({filename:"combined.log"}),
    ]
   
})

export default logger;