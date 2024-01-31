import { MaxLength, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity({ name: 'products' })
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, name: 'product_external_id' })
    @MinLength(1)
    @MaxLength(10)
    productExternalId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    constructor(product?: Partial<ProductEntity>) {
        this.id = product?.id;
        this.productExternalId = product?.productExternalId;
        this.createdAt = product?.createdAt;
    }
}