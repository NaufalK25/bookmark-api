import * as pactum from 'pactum';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { ChangePasswordDto, EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('App GraphQL e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const port = 3002;

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
    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const auth = {
      email: 'test-graphql@gmail.com',
      password: '123',
    };

    const mutateAuth = (
      mutation: string,
      mutationName: string,
      input: string,
    ) => {
      return `mutation ${mutationName}($auth: Auth!) {
        ${mutation}(dto: ${input}) {
          access_token
        }
      }
    `;
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(
            mutateAuth('signup', 'Signup_1', `{password: "${auth.password}"}`),
          )
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(
            mutateAuth('signup', 'Signup_2', `{email: "${auth.email}"}`),
          )
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(mutateAuth('signup', 'Signup_3', '{}'))
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(mutateAuth('signup', 'Signup', '$auth'))
          .withGraphQLVariables(auth)
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(
            mutateAuth('signin', 'Signin_1', `{password: "${auth.password}"}`),
          )
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(
            mutateAuth('signin', 'Signin_2', `{email: "${auth.email}"}`),
          )
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(mutateAuth('signin', 'Signin_3', '{}'))
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if email not found', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(
            mutateAuth(
              'signin',
              'Signin_4',
              `{email: "test-graphql2@gmail.com", password: "${auth.password}"}`,
            ),
          )
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should throw if password incorrect', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(
            mutateAuth(
              'signin',
              'Signin_5',
              `{email: "${auth.email}", password: "1234"}`,
            ),
          )
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/graphql')
          .withGraphQLQuery(mutateAuth('signin', 'Signin', '$auth'))
          .withGraphQLVariables(auth)
          .expectStatus(HttpStatus.OK)
          .stores('userAccessToken', 'data.signin.access_token');
      });
    });
  });

  // describe('User', () => {
  // describe('Get me', () => {
  // const getMeQuery = `query GetMe {
  //         getMe {
  //           id,
  //           email,
  //           firstName,
  //           lastName,
  //           createdAt,
  //           updatedAt
  //         }
  //       }`;

  // it('should throw if unauthorized', () => {
  //   return pactum
  //     .spec()
  //     .post('/graphql')
  //     .withGraphQLQuery(getMeQuery)
  //     .expectStatus(HttpStatus.OK);
  // });
  // it('should get current user', () => {
  //   return pactum
  //     .spec()
  //     .post('graphql')
  //     .withHeaders({
  //       Authorization: 'Bearer $S{userAccessToken}',
  //     })
  //     .withGraphQLQuery(getMeMutation)
  //     .expectStatus(HttpStatus.OK);
  // });
  // });

  // describe('Edit user', () => {
  //   const dto: EditUserDto = {
  //     firstName: 'Test GraphQL',
  //     email: 'test-graphql0@gmail.com',
  //   };

  //   it('should throw if unauthorized', () => {
  //     return pactum
  //       .spec()
  //       .patch('/users')
  //       .withBody(dto)
  //       .expectStatus(HttpStatus.UNAUTHORIZED);
  //   });
  //   it('should edit user', () => {
  //     return pactum
  //       .spec()
  //       .patch('/users')
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAccessToken}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(HttpStatus.OK)
  //       .expectBodyContains(dto.firstName)
  //       .expectBodyContains(dto.email);
  //   });
  // });

  // describe('Change password', () => {
  //   it('should throw if unauthorized', () => {
  //     const dto: ChangePasswordDto = {
  //       oldPassword: '123',
  //       newPassword: '1234',
  //     };

  //     return pactum
  //       .spec()
  //       .patch('/users/change-password')
  //       .withBody(dto)
  //       .expectStatus(HttpStatus.UNAUTHORIZED);
  //   });
  //   it('should throw throw if old and new password is the same', () => {
  //     const dto: ChangePasswordDto = {
  //       oldPassword: '123',
  //       newPassword: '123',
  //     };

  //     return pactum
  //       .spec()
  //       .patch('/users/change-password')
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAccessToken}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(HttpStatus.FORBIDDEN);
  //   });
  //   it('should throw throw if old password does not match', () => {
  //     const dto: ChangePasswordDto = {
  //       oldPassword: '1234',
  //       newPassword: '12345',
  //     };

  //     return pactum
  //       .spec()
  //       .patch('/users/change-password')
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAccessToken}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(HttpStatus.FORBIDDEN);
  //   });
  //   it('should change password', () => {
  //     const dto: ChangePasswordDto = {
  //       oldPassword: '123',
  //       newPassword: '1234',
  //     };

  //     return pactum
  //       .spec()
  //       .patch('/users/change-password')
  //       .withHeaders({
  //         Authorization: 'Bearer $S{userAccessToken}',
  //       })
  //       .withBody(dto)
  //       .expectStatus(HttpStatus.OK);
  //   });
  // });
  // });

  // describe('Bookmarks', () => {
  //   describe('Get empty bookmarks', () => {
  //     it('should throw if unauthorized', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .expectStatus(HttpStatus.UNAUTHORIZED);
  //     });
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .expectStatus(HttpStatus.OK)
  //         .expectBody([])
  //         .expectJsonLength(0);
  //     });
  //   });

  //   describe('Create bookmark', () => {
  //     const dto: CreateBookmarkDto = {
  //       title: 'First Bookmark',
  //       link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
  //     };

  //     it('should throw if unauthorized', () => {
  //       return pactum
  //         .spec()
  //         .post('/bookmarks')
  //         .withBody(dto)
  //         .expectStatus(HttpStatus.UNAUTHORIZED);
  //     });
  //     it('should create bookmark', () => {
  //       return pactum
  //         .spec()
  //         .post('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(HttpStatus.CREATED)
  //         .stores('bookmarkId', 'id');
  //     });
  //   });

  //   describe('Get bookmarks', () => {
  //     it('should throw if unauthorized', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .expectStatus(HttpStatus.UNAUTHORIZED);
  //     });
  //     it('should get bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .expectStatus(HttpStatus.OK)
  //         .expectJsonLength(1);
  //     });
  //   });

  //   describe('Get bookmark by id', () => {
  //     it('should throw if unauthorized', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .expectStatus(HttpStatus.UNAUTHORIZED);
  //     });
  //     it('should get bookmark by id', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .expectStatus(HttpStatus.OK)
  //         .expectBodyContains('$S{bookmarkId}');
  //     });
  //   });

  //   describe('Edit bookmark by id', () => {
  //     const dto: EditBookmarkDto = {
  //       title:
  //         'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
  //       description:
  //         'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
  //     };

  //     it('should throw if unauthorized', () => {
  //       return pactum
  //         .spec()
  //         .patch('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withBody(dto)
  //         .expectStatus(HttpStatus.UNAUTHORIZED);
  //     });
  //     it('should edit bookmark', () => {
  //       return pactum
  //         .spec()
  //         .patch('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(HttpStatus.OK)
  //         .expectBodyContains(dto.title)
  //         .expectBodyContains(dto.description);
  //     });
  //   });

  //   describe('Delete bookmark by id', () => {
  //     it('should throw if unauthorized', () => {
  //       return pactum
  //         .spec()
  //         .delete('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .expectStatus(HttpStatus.UNAUTHORIZED);
  //     });
  //     it('should delete bookmark', () => {
  //       return pactum
  //         .spec()
  //         .delete('/bookmarks/{id}')
  //         .withPathParams('id', '$S{bookmarkId}')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .expectStatus(HttpStatus.NO_CONTENT);
  //     });
  //     it('should get empty bookmarks', () => {
  //       return pactum
  //         .spec()
  //         .get('/bookmarks')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAccessToken}',
  //         })
  //         .expectStatus(HttpStatus.OK)
  //         .expectBody([])
  //         .expectJsonLength(0);
  //     });
  //   });
  // });
});
