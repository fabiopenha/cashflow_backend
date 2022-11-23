import { server } from './server/Server';

server.listen(process.env.PORT, () => console.log(`App running ${process.env.PORT}`));