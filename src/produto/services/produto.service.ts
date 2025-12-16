import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Produto } from "../entities/produto.entity";
import { Between, DeleteResult, ILike, Repository } from "typeorm";
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

    //Feature de checagem de validade. Minha ideia é ter uma função que ajude a identificar produtos que estão próximos da data de validade, o prazo de 60 dias é pra não ter produtos tão próximos da data.
    async validade(): Promise<Produto[]> {
        const hoje = new Date();
        const prazo = new Date();
        prazo.setDate(hoje.getDate() + 60);

        return await this.produtoRepository.find({
            where: {
                data_validade: Between(hoje, prazo)
            },
            relations: { categoria: true },
            order: { data_validade: 'ASC' }
        });
    }

    //Feature de desconto por categoria. Permite um desconto em porcentagem para todos os produtos de uma categoria específica, facilitando o gerenciamento de promoções. Utilizei a doc do TypeORM para fazer um update em massa, com o QueryBuilder ao inves do Repository.
    async aplicarDescontoPorCategoria(categoriaId: number, porcentagem: number): Promise<any> {

        await this.categoriaService.findByID(categoriaId);

        const fator = 1 - (porcentagem / 100);
        if (fator <= 0) {
            throw new HttpException(
                "A porcentagem de desconto é inválida ou resultaria em preço zero/negativo. Máximo 100%",
                HttpStatus.BAD_REQUEST
            );
        }

        const resultado = await this.produtoRepository
            .createQueryBuilder()
            .update(Produto)
            .set({
                preco: () => `preco * ${fator}`
            })
            .where("categoriaId = :id", { id: categoriaId })
            .execute();

        if (resultado.affected === 0) {
            throw new HttpException(
                `Nenhum produto encontrado na Categoria ID ${categoriaId}.`,
                HttpStatus.NOT_ACCEPTABLE
            );
        }

        return {
            mensagem: `Desconto de ${porcentagem}% aplicado com sucesso para ${resultado.affected} produtos.`,
            produtosAfetados: resultado.affected
        };
    }


}