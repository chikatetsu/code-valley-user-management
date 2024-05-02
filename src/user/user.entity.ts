import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'varchar' })
  public username!: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public createdAt: Date;
}
