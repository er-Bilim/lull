import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist {
  @Prop({ required: true, type: String, unique: true, min: 1, max: 55 })
  name!: string;
  @Prop({ type: String, required: false, default: null })
  image!: string;
  @Prop({ type: String, max: 500, required: false, default: null })
  description!: string;
  @Prop({ type: Boolean, required: false, default: false })
  isPublished!: boolean;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
