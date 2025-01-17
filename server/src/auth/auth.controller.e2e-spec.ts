import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database-module';
import { UserFactory } from '../../test/factories/make-user';
import { hash } from 'bcrypt';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

describe('AppController', () => {
  let app: INestApplication;

  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  describe('[POST] Auth Controller', () => {
    it('should be able to sign in', async () => {
      const user = await userFactory.makeUser({
        email: 'bruno@email.com',
        password: await hash('123456', 10),
        name: 'Bruno',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password: '123456',
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        access_token: expect.any(String),
        email: user.email,
        name: user.name,
        id: user.id,
      });
    });
  });
});
