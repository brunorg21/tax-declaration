import { Test } from '@nestjs/testing';

import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { DatabaseModule } from '../database/database-module';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { UserFactory } from 'test/factories/make-user';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TaxDeclarationFactory } from 'test/factories/make-tax-declarations';
import { PrismaService } from '@/database/prisma-service';

describe('TaxDeclarationController', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prismaService: PrismaService;
  let taxDeclarationFactory: TaxDeclarationFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TaxDeclarationFactory, PrismaService],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    taxDeclarationFactory = moduleRef.get(TaxDeclarationFactory);
    jwt = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);

    await app.init();
  });

  describe('[POST] /tax-declarations', () => {
    it('it should be able to declare income tax', async () => {
      const user = await userFactory.makeUser({
        email: 'bruno1@email.com',
        password: await hash('123456', 10),
        name: 'Bruno',
      });

      const accessToken = jwt.sign({ sub: user.id.toString() });
      const response = await request(app.getHttpServer())
        .post('/tax-declarations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          alimony: 400.0,
          socialSecurityContribution: 4200.0,
          complementarySocialSecurityContribution: 400.0,
          earnings: 22400.0,
          educationExpenses: 2400.0,
          medicalExpenses: 4020.0,
          dependents: [
            {
              name: 'Bruno',
              cpf: '481.026.578-12',
              email: 'bruno4@email.com',
              birthDate: new Date(),
            },
          ],
        });

      expect(response.statusCode).toBe(201);
    });
  });

  describe('[GET] /tax-declarations/history?year=', () => {
    it('it should be able to list tax declarations by year', async () => {
      const user = await userFactory.makeUser({
        email: 'bruno2@email.com',
        password: await hash('123456', 10),
        name: 'Bruno',
      });

      const accessToken = jwt.sign({ sub: user.id.toString() });

      await taxDeclarationFactory.makeTaxDeclaration({
        complementarySocialSecurityContribution: 400,
        earnings: 10000.22,
        educationExpenses: 1000,
        medicalExpenses: 2000,
        socialSecurityContribution: 2000,
        status: 'UNSUBMMITED',
        userId: user.id,
        alimony: 1000,
        createdAt: new Date(
          new Date().setFullYear(new Date().getFullYear() - 1),
        ),
      });
      await taxDeclarationFactory.makeTaxDeclaration({
        complementarySocialSecurityContribution: 4200,
        earnings: 120000.22,
        educationExpenses: 1000,
        medicalExpenses: 2000,
        socialSecurityContribution: 2000,
        status: 'UNSUBMMITED',
        userId: user.id,
        alimony: 1000,
        createdAt: new Date(
          new Date().setFullYear(new Date().getFullYear() - 1),
        ),
      });
      await taxDeclarationFactory.makeTaxDeclaration({
        complementarySocialSecurityContribution: 4200,
        earnings: 120000.22,
        educationExpenses: 1000,
        medicalExpenses: 2000,
        socialSecurityContribution: 2000,
        status: 'UNSUBMMITED',
        userId: user.id,
        alimony: 1000,
        createdAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .get(
          `/tax-declarations/history?year=${(new Date().getFullYear() - 1).toString()}`,
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('[PUT] /tax-declarations/:taxDeclarationId', () => {
    it('it should be able update tax declaration', async () => {
      const user = await userFactory.makeUser({
        email: 'bruno3@email.com',
        password: await hash('123456', 10),
        name: 'Bruno',
      });

      const taxDeclaration = await taxDeclarationFactory.makeTaxDeclaration({
        complementarySocialSecurityContribution: 4200,
        earnings: 130000.22,
        educationExpenses: 1000,
        medicalExpenses: 2000,
        socialSecurityContribution: 2000,
        status: 'UNSUBMMITED',
        userId: user.id,
        alimony: 1000,
        createdAt: new Date(),
      });

      const accessToken = jwt.sign({ sub: user.id.toString() });
      const response = await request(app.getHttpServer())
        .put(`/tax-declarations/${taxDeclaration.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          alimony: 400.0,
          socialSecurityContribution: 4200.0,
          complementarySocialSecurityContribution: 400.0,
          earnings: 2220.0,
          educationExpenses: 2400.0,
          medicalExpenses: 4020.0,
          status: 'SUBMMITED',
        });

      const taxDeclarationUpdated =
        await prismaService.taxDeclaration.findUnique({
          where: {
            id: taxDeclaration.id,
          },
        });

      expect(taxDeclarationUpdated?.alimony).toBe(400.0);
      expect(response.statusCode).toBe(204);
    });
  });

  describe('[GET] /tax-declarations/history?year=', () => {
    it('it should be able to list tax declarations by year', async () => {
      const user = await userFactory.makeUser({
        email: 'bruno10@email.com',
        password: await hash('123456', 10),
        name: 'Bruno Rafael',
      });

      const accessToken = jwt.sign({ sub: user.id.toString() });

      const taxDeclaration = await taxDeclarationFactory.makeTaxDeclaration({
        complementarySocialSecurityContribution: 400,
        earnings: 10000.22,
        educationExpenses: 1000,
        medicalExpenses: 2000,
        socialSecurityContribution: 2000,
        status: 'UNSUBMMITED',
        userId: user.id,
        alimony: 1000,
        createdAt: new Date(
          new Date().setFullYear(new Date().getFullYear() - 1),
        ),
      });

      const response = await request(app.getHttpServer())
        .get(`/tax-declarations/${taxDeclaration.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: taxDeclaration.id,
        alimony: 1000,
        complementarySocialSecurityContribution: 400,
        createdAt: expect.any(String),
        educationExpenses: 1000,
        earnings: 10000.22,
        medicalExpenses: 2000,
        socialSecurityContribution: 2000,
        status: 'UNSUBMMITED',
        userId: user.id,
        dependents: [],
      });
    });
  });
});
