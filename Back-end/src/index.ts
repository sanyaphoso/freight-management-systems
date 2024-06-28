import config from '~/config';
import { getConnection } from './packages/database';
import server from './server';

const PORT = config.SERVER_PORT || '3000';

async function onStart(): Promise<any> {
  try {
    await getConnection();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

server.listen(PORT, onStart);
// tslint:disable-next-line:no-console
console.log(`Server up and running on http://localhost:${PORT}`);
