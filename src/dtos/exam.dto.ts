import i18next from 'i18next';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class ExamDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: Date;

  @IsOptional()
  @IsInt()
  @Min(5, { message: i18next.t('exam.errors.time_limit') })
  time_limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: i18next.t('exam.errors.attempt_limit') })
  attempt_limit?: number;
}
