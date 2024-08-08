import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entities';

function randomNum() {
  return Math.floor(Math.random() * 10000000);
}

@Injectable()
export class BookService {
  @Inject()
  dbService: DbService;

  async list(name: string) {
    const books: Book[] = await this.dbService.read();
    return name
      ? books.filter((book) => {
          return book.name.includes(name);
        })
      : books;
  }

  async findById(id: number) {
    const books: Book[] = await this.dbService.read();
    return books.find((book) => book.id === id);
  }

  async create(createBookDto: CreateBookDto) {
    const books: Book[] = await this.dbService.read();
    const { author, cover, description, name } = createBookDto;

    const book = new Book();
    book.id = randomNum();
    book.author = author;
    book.cover = cover;
    book.description = description;
    book.name = name;

    books.push(book);
    await this.dbService.write(books);

    return book;
  }

  async update(updateBookDto: UpdateBookDto) {
    const books: Book[] = await this.dbService.read();
    const { id, author, cover, description, name } = updateBookDto;
    const foundBook = books.find((book) => book.id === id);

    if (!foundBook) {
      throw new BadRequestException('该图书不存在');
    }

    foundBook.id = id;
    foundBook.author = author;
    foundBook.cover = cover;
    foundBook.description = description;
    foundBook.name = name;

    await this.dbService.write(books);
    return foundBook;
  }

  async delete(id: number) {
    const books: Book[] = await this.dbService.read();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
      books.splice(index, 1);
      await this.dbService.write(books);
    }
  }
}
