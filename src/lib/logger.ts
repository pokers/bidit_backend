import { devEnv } from '../config'
import { Logger, createLogger, transports, format } from "winston";

// TODO : Use 3rd party logger module.

const log = {
    info: console.log,
    error: console.error
}
export { log }
