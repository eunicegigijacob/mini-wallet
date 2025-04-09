import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(128)
  email = '';

  @IsNotEmpty()
  @IsString()
  password = '';

  @IsOptional()
  @IsString()
  device_token = '';

  @IsOptional()
  @IsString()
  device_name = '';

  @IsOptional()
  @IsString()
  device_type = '';
}
