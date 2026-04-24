import 'multer';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDTO } from './create-artist.dto';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const existArtist = await this.artistModel.exists({ _id: id });
    if (!existArtist) {
      throw new NotFoundException('Artist not found!');
    }
    try {
      return this.artistModel.findById(id);
    } catch (error) {
      console.error(error);
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads/artists',
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
    @Body() artistData: CreateArtistDTO,
  ) {
    const newArtist = new this.artistModel({
      name: artistData.name,
      image: file ? '/uploads/artists/' + `${file.filename}` : null,
      description: artistData.description,
      isPublished: artistData.isPublished,
    });

    const artistExist = await this.artistModel.exists({
      name: newArtist.name,
    });

    if (artistExist) {
      throw new BadRequestException('Artist already exist');
    }

    try {
      return newArtist.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }

      throw new InternalServerErrorException('Error creating an artist');
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteArtist = await this.artistModel.findByIdAndDelete({
      _id: id,
    });

    if (!deleteArtist) {
      throw new NotFoundException('Artist not found!');
    }

    try {
      return { message: 'Artist Deleted!' };
    } catch (error) {
      console.error(error);
    }
  }
}
