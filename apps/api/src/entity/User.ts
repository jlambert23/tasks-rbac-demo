import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @ManyToOne(() => Role)
  role: Role;
}
