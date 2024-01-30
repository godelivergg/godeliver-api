import { MaxLength, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @MinLength(1)
    @MaxLength(10)
    productExternalId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    constructor(product?: Partial<ProductEntity>) {
        this.id = product?.id;
        this.productExternalId = product?.productExternalId;
        this.createdAt = product?.createdAt;
        this.updatedAt = product?.updatedAt;
    }
}