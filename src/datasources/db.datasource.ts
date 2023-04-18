import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import config from 'config';

const password = config.get('Main.dbConfig.password');
const database = config.get('Main.dbConfig.databaseName');
const user = config.get('Main.dbConfig.user');
const port = config.get('Main.dbConfig.port');
const host = config.get('Main.dbConfig.host');

const dbConfig = {
	name: 'db',
	connector: 'postgresql',
	url: '',
	host,
	port,
	user,
	password,
	database
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource implements LifeCycleObserver {
	static dataSourceName = 'db';
	static readonly defaultConfig = config;

	constructor(
		@inject('datasources.config.db', { optional: true })
		dsConfig: object = dbConfig
	) {
		super(dsConfig);
	}
}
