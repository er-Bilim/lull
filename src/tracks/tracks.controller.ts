import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/albums.schema';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { CreateTrackDTO } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('albumId') albumID: string) {
    if (albumID) {
      const albumExist = await this.albumModel.findById({ _id: albumID });
      const albumTracks = await this.trackModel.find({ album: albumID });

      if (!albumExist) {
        throw new NotFoundException('Album not found');
      }

      return albumTracks;
    }

    return this.trackModel.find();
  }

  @Post()
  async create(@Body() trackData: CreateTrackDTO) {
    const existAlbum = await this.albumModel.exists({
      _id: trackData.album,
    });

    if (!existAlbum) {
      throw new NotFoundException('Album not found!');
    }

    try {
      const newTrack = new this.trackModel({
        album: trackData.album,
        name: trackData.name,
        time: trackData.time,
        isPublished: trackData.isPublished,
      });

      return newTrack.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }

      throw new InternalServerErrorException('Error creating an track');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteTrack = await this.trackModel.findByIdAndDelete({ _id: id });

    if (!deleteTrack) {
      throw new NotFoundException('Track not found!');
    }

    try {
      return { message: 'Track Deleted!' };
    } catch (error) {
      console.error(error);
    }
  }
}
