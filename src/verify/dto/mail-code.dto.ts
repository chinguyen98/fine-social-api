import { IsString } from "class-validator";

class MailCodeDto {
  @IsString({
    message: 'Mã không được để trống!',
  })
  mailCode: string;
}

export default MailCodeDto;