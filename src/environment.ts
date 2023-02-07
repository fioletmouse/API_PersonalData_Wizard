export const environment = {
  corsRegex: '^(http(s)?://)(www.)?(localhost:[0-9]{4,5})(/.*)*?$',
  port: '3003',
  swagger: {
    title: 'wizard-service',
    description: 'Personal data wizard API',
    version: '1.0',
    path: 'wizard/api'
  },
  pgCredentials: {
    type: 'postgres',
    username: 'wizardadmin',
    host: 'localhost',
    database: 'wizard',
    password: '123456',
    port: 5432,
    autoLoadEntities: true,
    synchronize: true
  }
};
