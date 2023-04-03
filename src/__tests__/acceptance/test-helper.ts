import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {MainApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new MainApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: MainApplication;
  client: Client;
}
