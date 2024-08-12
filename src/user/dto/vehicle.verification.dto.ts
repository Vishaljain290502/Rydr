import { IsString } from "class-validator";


export class CreateVehicleVerificationDto {

  @IsString()
  vehicleType:string;

  @IsString()
  registrationCertificateNumber:string;

//   @IsString()
//   drivingLicense:string;

  @IsString()
  vehicleNumber:string;

  @IsString()
  vehicleOwnerName:string;

  @IsString()
  insuranceNumber:string;

}