import { Length, MaxLength, MinLength } from "class-validator";
import { UserEntity } from "../../user/entity/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"

@Entity({ name: 'orders' })
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, name: 'order_external_id' })
    @MinLength(1)
    @MaxLength(10)
    orderExternalId: number;

    @Column({ name: 'order_date' })
    @Length(8)
    orderDate: number

    @ManyToOne(() => UserEntity, (orders) => OrderEntity)
    user: UserEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    constructor(order?: Partial<OrderEntity>) {
        this.id = order?.id;
        this.orderExternalId = order?.orderExternalId;
        this.orderDate = order?.orderDate;
        this.user = order?.user;
        this.createdAt = order?.createdAt;
        this.updatedAt = order?.updatedAt;
    }
}