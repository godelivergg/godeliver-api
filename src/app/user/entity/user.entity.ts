import { MaxLength, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @MinLength(1)
    @MaxLength(10)
    userExternalId: number;

    @Column()
    @MinLength(1)
    @MaxLength(45)
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    constructor(user?: Partial<UserEntity>) {
        this.id = user?.id;
        this.name = user?.name;
        this.userExternalId = user?.userExternalId;
        this.createdAt = user?.createdAt;
        this.updatedAt = user?.updatedAt;
    }
}