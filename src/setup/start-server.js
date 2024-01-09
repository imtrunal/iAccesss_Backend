// App Imports
import { PORT, NODE_ENV, HOST } from '../config/env'

// Start server
export default function (server) {

    console.info('SETUP - Starting server..')
    server.register(require('fastify-formbody'))

    server.get('/', async (request, reply) => {
        return 'iaccesss Backend Services';
    });

    //server.register( require( './routes/authRoute' ), { prefix: 'api/v1' } );
    server.register(require('./routes/storeRoute'), { prefix: 'api/v1' });
    server.register(require('./routes/userRoute'), { prefix: 'api/v1' });
    server.register(require('./routes/driverRoute'), { prefix: 'api/v1' });

    console.info('SETUP - Setup Routes')
    server.ready(err => {
        if (err) throw err
        server.swagger()
    })
  
    const start = async () => {
        try {

            await server.listen(PORT, '0.0.0.0')
            console.info(`INFOMATION -🚀 Server ready at   ${HOST}:${PORT} [${NODE_ENV}]`)
        } catch (err) {
            //server.log.error( err )
            process.exit(1)
        }
    }
    start()

}

