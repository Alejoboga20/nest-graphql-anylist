import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column('text')
  @Field(() => String)
  name: string;

  @Column('text')
  @Field(() => String)
  quantityUnits: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('user_id_index')
  @Field(() => User)
  user: User;
}
