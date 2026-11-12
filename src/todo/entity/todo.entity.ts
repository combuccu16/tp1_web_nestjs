import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimestampEntity } from '../../common/entities/timestamp.entity.js';
import { StatusEnum } from './status.enum.js';
@Entity('todos')
export class TodoEntity extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    name: string;
    @Column({ type: 'text' })
    description: string;
    @Column({
        type: 'simple-enum',
        enum: StatusEnum,
        default: StatusEnum.TODO,
    })
    status: StatusEnum;
    // Nullable so rows created before authentication was introduced stay valid.
    @Column({ type: 'integer', nullable: true })
    userId: number | null;
}
