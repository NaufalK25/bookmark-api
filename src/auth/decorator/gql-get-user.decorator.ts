import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';

export const GqlGetUser = createParamDecorator(
  (data: keyof User | undefined, context) => {
    const ctx = GqlExecutionContext.create(context).getContext();
    const user: User = ctx.req.user;
    if (data) {
      return user[data];
    }

    return user;
  },
);
