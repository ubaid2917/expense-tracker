import { SetMetadata } from "@nestjs/common";

export const Is_Public_Key= 'isPublic';
export const Public = () => SetMetadata(Is_Public_Key, true);