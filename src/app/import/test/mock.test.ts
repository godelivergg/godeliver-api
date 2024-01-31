
import { ImportEntity } from "../entity/import.entity";


export const importEntityList: ImportEntity[] = [
    new ImportEntity({
        id: '1',
        finished: true,
    }),
    new ImportEntity({
        id: '2',
        finished: true,
    }),
];

export const importRequestMock = {
    headers: {
        id: '1',
        finished: true,
    },
};