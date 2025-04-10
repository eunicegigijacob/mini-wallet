import { IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
