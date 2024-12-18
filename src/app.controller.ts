import { Controller, Get, Post, Put, Delete, Res, Req, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import { UsersService } from './users/users.service';
import { Users } from './users/DTO/users.dto';
import { JwtService } from '@nestjs/jwt';
@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly jwt: JwtService
  ) { }


  @Post("signup/user")
  async set(@Body() body: Users): Promise<any> {
    try {
      const { username, password, email } = body
      const created = await this.userService.signup(username, password, email)
      return ({ message: created })
    } catch (err) {
      console.error(err.message);
    }
  }
  @Post("login/user")
  async login(@Body() body: Users, @Res() res: Response): Promise<any> {
    try {
      const { username, password } = body

      if (!username && !password)
        return { message: "harap inputkan dengan benar" }

      const loginned = await this.userService.login(username, password)

      if (loginned) {
        const jwts = await this.jwt.signAsync({ userName: username })
        res.setHeader("token", jwts)
        res.header("Access-Control-Expose-Headers", "token");
        res.status(200).json({ message: loginned })
      } else {
        return ({ message: "gagal untuk mencoba login" })
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}
