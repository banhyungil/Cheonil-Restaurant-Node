import { env } from 'node:process'
import dConfig from './development'
import pConfig from './production'

const environment = env.NODE_ENV || 'development'

// eslint-disable-next-line node/no-unsupported-features/es-syntax
export default environment == 'development' ? dConfig : pConfig
