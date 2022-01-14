import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  password_confirm: string;

  @IsOptional()
  is_ambassador: boolean;
}
