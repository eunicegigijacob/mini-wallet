import { IsOptional, IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class TransferDto {
  @IsNotEmpty()
  @IsString()
  receiverWalletId: string;

  @IsOptional()
  @IsNumber()
  amount: number;
}
