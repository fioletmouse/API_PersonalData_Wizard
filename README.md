# About
Идея - создать прокси сервис, который будет собирать разные сеты данных от клиента, в зависимости от того, Из какой компании вызывается АПИ. Набор данных и страниц определен уникально для каждой компании и есть дефолтный.
Т.е. для страхования недвижимости от компании А нам нужен один набор полей, а для страхования животного от компании Б - другой.

Данные о том, откуда пришел клиент, на какой странице закончил заполнение и тп. хранятся в БД сервиса. Значимые данные, которые ввел клиент отправляются в другие сервисы, которые непосредственно ответственны за их обработку (реализация не предполагается в рамках этого АПИ, будет сделано заглушками)


## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Additional info
The project was initialized by npx. If you have nest installed globally all `npx @nestjs/cli` in command might be changed to `nest`
Swagger access path is `wizard/api`

# TODO
 add logger