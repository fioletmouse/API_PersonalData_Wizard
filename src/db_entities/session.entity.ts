import Companies from 'src/constants/CompaniesEnum';
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class WSession {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column({ nullable: true, length: 50 })
  clientId: string;

  @Column({ nullable: true, length: 50 })
  internalClientId: string;

  @Column({
    type: 'enum',
    enum: Companies,
    default: Companies.Default
  })
  companyId: Companies;

  @Column({ nullable: true, length: 50 })
  lastSection: string;

  @Column({ nullable: true, length: 50 })
  lastPage: string;

  @UpdateDateColumn()
  last_edit_date: Date;
}
