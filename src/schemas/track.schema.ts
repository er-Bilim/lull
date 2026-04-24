import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ type: String, ref: 'Album', required: true })
  album!: string;
  @Prop({ type: String, required: true })
  name!: string;
  @Prop({ type: String, required: true })
  time!: string;
  @Prop({ type: Boolean, required: false, default: false })
  isPublished!: boolean;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
