import Companies from 'src/constants/CompaniesEnum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WSession {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column({ nullable: true, length: 50 })
  clientId: string;

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

  @Column({ nullable: false })
  last_edit_date: Date;
}
