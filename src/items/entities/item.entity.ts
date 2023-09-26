import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
