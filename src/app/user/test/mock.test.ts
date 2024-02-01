import { UserDto } from "../dto/user.dto";
import { UserEntity } from "../entity/user.entity";

export const userEntityList: UserEntity[] = [
    new UserEntity({
        id: '1',
        name: 'fake-name',
        userExternalId: 1,
    }),
    new UserEntity({
        id: '2',
        name: 'fake-name2',
        userExternalId: 1,
    }),
];

export const newUserEntity: UserEntity = new UserEntity({
    id: '1',
    name: 'fake-name',
    userExternalId: 1,
});

export const createBody: UserDto = {
    name: 'fake-name',
    userExternalId: 1,
};

export const userUpsert = {
    identifiers: [
        {
            id: 1
        }
    ]
};