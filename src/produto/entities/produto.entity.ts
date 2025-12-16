import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categotia.entity";


@Entity({ name: "tb_produto" })
export class Produto {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @Column({ length: 100, nullable: false })
    nome: string;

    @IsNotEmpty()
    @Column({ type: "decimal", precision: 6, scale: 2, nullable: false })
    preco: number;

    @IsNotEmpty()
    @Column({ nullable: false })
    quantidade_estoque: number;

    @IsNotEmpty()
    @Column({ length: 200, nullable: false })
    laboratorio: string;

    @IsNotEmpty()
    @Column({ length: 500, nullable: false })
    principio_ativo: string;

    @IsNotEmpty()
    @Column({ type: 'date', nullable: false })
    data_validade: string;

    @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
        onDelete: "CASCADE"
    })
    categoria: Categoria
}