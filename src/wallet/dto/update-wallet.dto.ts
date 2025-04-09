import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateWalletDto {
  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
