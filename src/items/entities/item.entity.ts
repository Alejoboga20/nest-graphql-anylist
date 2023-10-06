import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column('numeric')
  @Field(() => Float)
  quantity: number;

  @Column('text')
  @Field(() => String)
  quantityUnits: string;

  @ManyToOne(() => User, (user) => user.items)
  @Field(() => User)
  user: User;
}
