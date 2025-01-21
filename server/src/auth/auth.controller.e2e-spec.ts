import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database-module';
import { UserFactory } from '../../test/factories/make-user';
import { hash } from 'bcrypt';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, JwtService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  describe('[POST] /auth/sign-in', () => {
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
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorEnableSecret: user.twoFactorEnableSecret,
      });
    });
  });

  describe('[GET] /auth/generate-2fa-code', () => {
    it('should be able to generate 2fa code', async () => {
      const user = await userFactory.makeUser({
        email: 'bruno1@email.com',
        password: await hash('123456', 10),
        name: 'Bruno Rafael',
      });

      const accessToken = await jwtService.signAsync({
        sub: user.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/auth/generate-2fa-code?email=${user.email}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        qrCode: expect.any(String),
        secret: expect.any(String),
      });
    });
  });
});
