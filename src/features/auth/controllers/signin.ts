import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { loginSchema } from '@auth/schemes/signin';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import JWT from 'jsonwebtoken';

// import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
// import { IResetPasswordParams, IUserDocument } from '@user/interfaces/user.interface';
// import { emailQueue } from './../../../shared/services/queues/email.queue';
// import moment from 'moment';
// import publicIP from 'ip';
// import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const existingUser: IAuthDocument = await authService.getAuthUserByUsername(
      username,
    );
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(
      password,
    );

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const user: IUserDocument = await userService.getUserByAuthId(
      existingUser.id,
    );
    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor,
      },
      config.JWT_TOKEN!,
    );

    req.session = { jwt: userJwt };

    // const resetLink = `${config.CLIENT_URL}/reset-password?token=3366423642843864`;
    // const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username!, resetLink);
    // emailQueue.addEmailJob('forgotPasswordEmail',  { template, receiverEmail: 'bridie94@ethereal.email', subject: 'Reset your password' });

    // const templateParams: IResetPasswordParams = {
    //   username: existingUser.username!,
    //   email: existingUser.email!,
    //   ipaddress: publicIP.address(),
    //   date: moment().format('DD/MM/YYYY HH:mm')
    // };
    // const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    // emailQueue.addEmailJob('forgotPasswordEmail',  { template, receiverEmail: 'bridie94@ethereal.email', subject: 'Password reset confirmation' });

    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id,
      username: existingUser!.username,
      email: existingUser!.email,
      avatarColor: existingUser!.avatarColor,
      uId: existingUser!.uId,
      createdAt: existingUser.createdAt,
    } as IUserDocument;

    res.status(HTTP_STATUS.OK).json({
      message: 'User login successfully',
      user: userDocument,
      token: userJwt,
    });
  }
}
