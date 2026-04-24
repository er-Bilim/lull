import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ type: String, ref: 'Artist', required: true })
  artist!: string;
  @Prop({ required: true, type: String })
  name!: string;
  @Prop({ type: Number, required: true })
  release_year!: number;
  @Prop({ type: String, required: false, default: null })
  image!: string;
  @Prop({ type: Boolean, required: false, default: false })
  isPublished!: boolean;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
