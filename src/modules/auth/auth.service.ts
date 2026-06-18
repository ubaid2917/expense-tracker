import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;
    const userExists = await this.userModel.findOne({ email });
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }
    const newUser = new this.userModel(registerDto); 
    const userPassword = await bcrypt.hash(registerDto.password, 10);
    newUser.password = userPassword;
    await newUser.save();
    return { message: 'Registration successful' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Token payload variables allocation
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, name: user.name, email: user.email },
    };
  }
}