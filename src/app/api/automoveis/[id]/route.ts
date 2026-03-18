import { AutomovelUsuario } from "@/types";
import { promises as fs} from "fs";
import { NextResponse } from "next/server";

export async function PUT(request:Request, {params}:{params:{id:number}}){

    try{
        const file = await fs.readFile(process.cwd() + '/src/data/automoveis.json','utf-8')
        const automovel:AutomovelUsuario[] = JSON.parse(file)
        const index = automovel.findIndex(a => a.ID_AUTOMOVEL == params.id)
        if(index != -1){
            const body = await request.json()
            automovel.splice(index,1,body)
            await fs.writeFile(process.cwd() + '/src/data/automoveis.json', JSON.stringify(automovel))
            return NextResponse.json({msg:'Automovel atualizado com sucesso'})
        }
    }catch(error){
        return NextResponse.json({msg:'Erro ao atualizar automovel'+error},{status:500})
    }
}

export async function DELETE(request:Request,{params}:{params:{id:number}}){

    try{
        const file = await fs.readFile(process.cwd() + '/src/data/automoveis.json','utf-8')
        const automovel:AutomovelUsuario[] = JSON.parse(file)
        const index = automovel.findIndex(a => a.ID_AUTOMOVEL == params.id)
        if(index != -1){
            automovel.splice(index, 1)
            await fs.writeFile(process.cwd() + '/src/data/automoveis.json', JSON.stringify(automovel))
            return NextResponse.json({msg:"Automovel apagado com sucesso"})
        }

    }catch(error){
        return NextResponse.json({msg:"Erro ao apagar o automovel"+error},{status:500})
    }
}