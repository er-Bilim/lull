import 'multer';
import {
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
    try {
      const existArtist = await this.artistModel.exists({ _id: id });

      if (!existArtist) {
        throw new Error();
      }

      return this.artistModel.findById(id);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Artist not found!');
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', { dest: './public/uploads/products' }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistData: CreateArtistDTO,
  ) {
    try {
      const newArtist = new this.artistModel({
        name: artistData.name,
        image: file ? '/uploads/products/' + `${file.filename}` : null,
        description: artistData.description,
        isPublished: artistData.isPublished,
      });

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
    try {
      const existArtist = await this.artistModel.exists({ _id: id });

      if (!existArtist) {
        throw new Error();
      }

      return { message: 'Artist Deleted!' };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Artist not found!');
    }
  }
}
