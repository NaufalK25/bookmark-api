import * as pactum from 'pactum';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { ChangePasswordDto, EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('App API e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const port = 3001;

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(port);

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${port}/api`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test-api@gmail.com',
      password: '123',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email not found', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'test-api2@gmail.com',
            password: dto.password,
          })
          .expectStatus(HttpStatus.FORBIDDEN);
      });
      it('should throw if password incorrect', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
            password: '1234',
          })
          .expectStatus(HttpStatus.FORBIDDEN);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAccessToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        firstName: 'Test API',
        email: 'test-api0@gmail.com',
      };

      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });

    describe('Change password', () => {
      it('should throw if unauthorized', () => {
        const dto: ChangePasswordDto = {
          oldPassword: '123',
          newPassword: '1234',
        };

        return pactum
          .spec()
          .patch('/users/change-password')
          .withBody(dto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should throw throw if old and new password is the same', () => {
        const dto: ChangePasswordDto = {
          oldPassword: '123',
          newPassword: '123',
        };

        return pactum
          .spec()
          .patch('/users/change-password')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
      it('should throw throw if old password does not match', () => {
        const dto: ChangePasswordDto = {
          oldPassword: '1234',
          newPassword: '12345',
        };

        return pactum
          .spec()
          .patch('/users/change-password')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
      it('should change password', () => {
        const dto: ChangePasswordDto = {
          oldPassword: '123',
          newPassword: '1234',
        };

        return pactum
          .spec()
          .patch('/users/change-password')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([])
          .expectJsonLength(0);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
      };

      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(dto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };

      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should throw if unauthorized', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(HttpStatus.NO_CONTENT);
      });
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([])
          .expectJsonLength(0);
      });
    });
  });
});
