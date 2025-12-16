import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categoria } from "../entities/categotia.entity";
import { DeleteResult, ILike, Repository } from "typeorm";


@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(Categoria)
        private categoriaRepository: Repository<Categoria>,
    ) { }

    async findAll(): Promise<Categoria[]> {
        return await this.categoriaRepository.find();
    }

    async findByID(id: number): Promise<Categoria> {
        const categoria = await this.categoriaRepository.findOne({
            where: { id }
        });
        if (!categoria) {
            throw new HttpException(`Categoria numero ${id} não encontrada`, HttpStatus.NOT_FOUND);
        }
        return categoria;
    }

    async findByNome(nome: string): Promise<Categoria[]> {
        return await this.categoriaRepository.find({
            where: {
                nome: ILike(`%${nome}%`)
            }
        })
    }

    async create(categoria: Categoria): Promise<Categoria> {
        return await this.categoriaRepository.save(categoria);
    }

    async update(categoria: Categoria): Promise<Categoria> {
        const buscaCategoria = await this.findByID(categoria.id);
        return await this.categoriaRepository.save(categoria);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);
        return await this.categoriaRepository.delete(id);
    }
}