import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database-module';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

describe('UserController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  describe('[POST] /users', () => {
    it('should be able to create user', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'bruno@email.com',
        password: '123456',
        name: 'Bruno',
      });

      expect(response.statusCode).toBe(201);
    });
  });
});
