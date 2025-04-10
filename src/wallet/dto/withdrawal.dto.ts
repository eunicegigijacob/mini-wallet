import { IsNumber, IsNotEmpty } from 'class-validator';

export class WithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
