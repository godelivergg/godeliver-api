import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from "typeorm"
import * as moment from 'moment';

@Entity({ name: 'imports' })
export class ImportEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: false })
    finished: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @Column({ name: 'finished_at', nullable: true, type: 'date' })
    finishedAt: string

    @BeforeUpdate()
    updateFinishedAt() {
        this.finishedAt = moment().format();
    }

    constructor(importItem?: Partial<ImportEntity>) {
        this.id = importItem?.id;
        this.finished = importItem?.finished;
        this.createdAt = importItem?.createdAt;
        this.updatedAt = importItem?.updatedAt;
        this.finishedAt = importItem?.finishedAt;
    }
}