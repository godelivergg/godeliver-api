import { IsNotEmpty } from 'class-validator';

export class UserDto {
    /**
     * user name
     * @example Jon Doe
     */
    @IsNotEmpty()
    name: string;

    /**
     * user id from legado system
     * @example 22
     */
    @IsNotEmpty()
    userExternalId: number;

}
