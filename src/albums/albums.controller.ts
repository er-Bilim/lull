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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/albums.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDTO } from './create-album.dto';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll(@Query('artistId') artistID: string) {
    if (artistID) {
      const artistExist = await this.artistModel.findById({ _id: artistID });
      const artistAlbums = await this.albumModel.find({ artist: artistID });

      if (!artistExist) {
        throw new NotFoundException('Artist not found');
      }

      return artistAlbums;
    }

    return this.albumModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    try {
      const existAlbum = await this.albumModel.exists({ _id: id });

      if (!existAlbum) {
        throw new Error();
      }

      return this.albumModel.findById(id);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Album not found!');
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/albums',
        filename(_req, file, callback) {
          const randomName = randomUUID();
          const ext = extname(file.originalname);
          callback(null, `${randomName}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDTO,
  ) {
    const existArtist = await this.artistModel.exists({
      _id: albumData.artist,
    });

    if (!existArtist) {
      throw new NotFoundException('Artist not found!');
    }

    try {
      const newAlbum = new this.albumModel({
        artist: albumData.artist,
        name: albumData.name,
        release_year: albumData.release_year,
        image: file ? '/uploads/albums/' + `${file.filename}` : null,
        isPublished: albumData.isPublished,
      });

      return newAlbum.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }

      throw new InternalServerErrorException('Error creating an album');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteAlbum = await this.albumModel.findByIdAndDelete({ _id: id });

    if (!deleteAlbum) {
      throw new NotFoundException('Album not found!');
    }

    try {
      return { message: 'Album Deleted!' };
    } catch (error) {
      console.error(error);
    }
  }
}
