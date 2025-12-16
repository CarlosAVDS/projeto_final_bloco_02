import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { CategoriaService } from "../../categoria/services/categoria.service";

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,
        private categoriaService: CategoriaService,
    ) { }

    async findAll(): Promise<Produto[]> {
        return await this.produtoRepository.find({
            relations: { categoria: true }
        });
    }

    async findByID(id: number): Promise<Produto> {
        const produto = await this.produtoRepository.findOne({
            where: { id },
            relations: { categoria: true }
        });
        if (!produto) {
            throw new HttpException(`Produto numero ${id} não encontrado`, HttpStatus.NOT_FOUND);
        }
        return produto;
    }

    async findByPrincipio(principio: string): Promise<Produto[]> {
        return await this.produtoRepository.find({
            where: {
                principio_ativo: ILike(`%${principio}%`)
            },
            relations: { categoria: true }
        })
    }

    async create(produto: Produto): Promise<Produto> {
        await this.categoriaService.findByID(produto.categoria.id);

        return await this.produtoRepository.save(produto);
    }

    async update(produto: Produto): Promise<Produto> {
        await this.findByID(produto.id);
        await this.categoriaService.findByID(produto.categoria.id);
        return await this.produtoRepository.save(produto);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);
        return await this.produtoRepository.delete(id);
    }
}