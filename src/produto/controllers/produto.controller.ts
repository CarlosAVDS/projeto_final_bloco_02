import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseFloatPipe, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ProdutoService } from "../services/produto.service";
import { Produto } from "../entities/produto.entity";


@Controller("/produtos")
export class ProdutoController {
    constructor(private readonly produtoService: ProdutoService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Produto[]> {
        return this.produtoService.findAll();
    }

    @Get('/validade')
    @HttpCode(HttpStatus.OK)
    validade(): Promise<Produto[]> {
        return this.produtoService.validade();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findByID(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
        return this.produtoService.findByID(id);
    }

    @Get('/principio_ativo/:nome')
    @HttpCode(HttpStatus.OK)
    findByNome(@Param('nome') nome: string): Promise<Produto[]> {
        return this.produtoService.findByPrincipio(nome);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() produto: Produto): Promise<Produto> {
        return this.produtoService.create(produto);
    }

    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() produto: Produto): Promise<Produto> {
        return this.produtoService.update(produto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.produtoService.delete(id);
    }

    @Put('/aplicar_desconto/:categoriaId/:porcentagem')
    @HttpCode(HttpStatus.OK)
    aplicarDesconto(
        @Param('categoriaId', ParseIntPipe) categoriaId: number, @Param('porcentagem', ParseFloatPipe) porcentagem: number): Promise<any> {
        return this.produtoService.aplicarDescontoPorCategoria(categoriaId, porcentagem);
    }
}