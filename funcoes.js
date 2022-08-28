class Cliente
{
    constructor(id, nome, tarifa)
    {
        this._id = id;
        this._nome = nome;
        this._gastos = [];
        this._valorGastos = [];
        this._tarifa = tarifa;
    }

    get id()
    {
        return this._id;
    }

    set nome(nome)
    {
        this._nome = nome;
    }

    get nome()
    {
        return this._nome;
    }

    set gastos(gastos)
    {
        this._gastos = gastos;
    }

    get gastos()
    {
        return this._gastos;
    }

    set valorGastos(valorGastos)
    {
        this._valorGastos = valorGastos;
    }

    get valorGastos()
    {
        return this._valorGastos;
    }

    set tarifa(tarifa)
    {
        this._tarifa = tarifa;
    }

    get tarifa()
    {
        return this._tarifa;
    }

    somarGastos()
    {
        var sum = 0;

        for(var i = 0; i < this._valorGastos.length; i++)
        {
            sum += this._valorGastos[i];
        }

        return sum;
    }
}

class Produto
{
    constructor(id, nome, preco, quantidade)
    {
        this._id = id;
        this._nome = nome;
        this._preco = preco;
        this._quantidade = quantidade;
    }

    get id()
    {
        return this._id;
    }

    set nome(nome)
    {
        this._nome;
    }

    get nome()
    {
        return this._nome;
    }

    set preco(preco)
    {
        this._preco;
    }

    get preco()
    {
        return this._preco;
    }

    set quantidade(quantidade)
    {
        this._quantidade;
    }

    get quantidade()
    {
        return this._quantidade;
    }
}

var clientes = [], produtos = [], idCliente = 0, idProduto = 0;

function criarNovoCliente()
{
    idCliente++;
    var nome = document.getElementById("nomeCliente").value;
    var tarifa = document.querySelector("input[name='tarifa']:checked") == null ? false : true;
    
    var novoCliente = new Cliente(idCliente, nome, tarifa);
    clientes.push(novoCliente);
    
    atualizarListaClientes();
    atualizarListaProdutos();
}

function atualizarListaClientes()
{
    var ids = [], nomes = [];
    var tabela = document.querySelector("#clientes_cadastrados tbody");
    var lista = "";

    clientes.map(user => {
        ids.push(user.id)
        nomes.push(user.nome);
    });

    for(var i = 0; i < ids.length; i++)
    {
        lista += `<tr> <td>${ids[i]}</td> <td>${nomes[i]}</td> </tr>`;

        tabela.innerHTML = lista;
    }
}

function criarNovoProduto()
{
    idProduto++;
    var nome = document.getElementById("nomeProduto").value;
    var preco = parseFloat(document.getElementById("precoProduto").value);
    var quantidade = parseInt(document.getElementById("quantidadeProduto").value);

    var novoProduto = new Produto(idProduto, nome, preco, quantidade);
    produtos.push(novoProduto);

    atualizarListaProdutos();
}

function atualizarListaProdutos()
{
    var ids = [], nomes = [], precos = [], quantidades = [];
    var idsClientes = [], nomesClientes = [];
    var tabela = document.querySelector("#produtos_cadastrados tbody");
    var lista = "";

    produtos.map(produto => {
        ids.push(produto.id)
        nomes.push(produto.nome);
        precos.push(produto.preco);
        quantidades.push(produto.quantidade);
    });

    clientes.map(user => {
        idsClientes.push(user.id)
        nomesClientes.push(user.nome);
    });

    for(var i = 0; i < ids.length; i++)
    {
        lista += `<tr> <td>${ids[i]}</td> <td>${nomes[i]}</td> <td>R$ ${precos[i].toFixed(2)}</td> <td>${quantidades[i]}</td> <td>`;
        
        for(var j = 0; j < idsClientes.length; j++)
        {
            lista += ` <label><input type='checkbox' value='${nomesClientes[j]}' name='${ids[i]}'>${nomesClientes[j]}</label> `;
        }

        lista += "</td> </tr>";

        tabela.innerHTML = lista;
    }
}

function calcularComanda()
{
    produtos.map(produto => {
        var quantidadeConsumidores = 0;
        var caixasMarcadas = document.querySelectorAll(`input[name='${produto.id}']:checked`);
        console.log(caixasMarcadas);
        
        clientes.map(cliente => {

            for(var i = 0; i < caixasMarcadas.length; i++)
            {
                if(caixasMarcadas[i].value == cliente.nome)
                {
                    quantidadeConsumidores++;
                    cliente.gastos.push(produto.id);
                }
            }
        });

        var valorDividido = (produto.quantidade * produto.preco) / quantidadeConsumidores;
        console.log("🚀 ~ file: funcoes.js ~ line 210 ~ valorDividido", valorDividido)

        clientes.map(cliente => {

            if(cliente.gastos.indexOf(produto.id) >= 0)
            {
                cliente.valorGastos.push(valorDividido);
            }
        });
    });

    imprimirNotaFiscal();
}

function imprimirNotaFiscal()
{
    var notasFiscais = document.querySelector("#notas_fiscais");
    var nomesProdutos = [];

    produtos.map(produto => {
        nomesProdutos.push(produto.nome);
    });

    clientes.map(cliente => {

        if(cliente.tarifa)
        {
            cliente.gastos.push("Tarifa");
            var soma = cliente.somarGastos();
            cliente.valorGastos.push(soma*0.1);
        }

        var titulo = `<h2>${cliente.nome}</h2>`;

        var thead = "<thead> <th>Produtos Consumidos</th> <th>Valor a Pagar</th> </thead>"; 
        
        var tbody = "<tbody>";
        for(var i = 0; i < cliente.gastos.length; i++)
        {
            if(cliente.gastos[i] == "Tarifa")
            {
                tbody += `<tr> <td>Tarifa</td> <td>${cliente.valorGastos[i].toFixed(2)}</td> </tr>`;
            }
            else
            {
                tbody += `<tr> <td>${nomesProdutos[cliente.gastos[i]-1]}</td> <td>${cliente.valorGastos[i].toFixed(2)}</td> </tr>`;
            }
        }
        tbody += "</tbody>";
        
        var tfoot = `<tfoot> <tr> <td>Valor Total:</td> <td>R$ ${cliente.somarGastos().toFixed(2)}</td> </tr> </tfoot>`;
        
        var tabela = `<table>${thead}${tbody}${tfoot}</table>`;
        
        var conteudo = titulo + tabela;

        var notaIndividual = `<div class='nota_individual'>${conteudo}</div>`;

        notasFiscais.innerHTML += notaIndividual;
    });


}

document.getElementById("adicionarCliente").onclick = criarNovoCliente;
document.getElementById("adicionarProduto").onclick = criarNovoProduto;
document.getElementById("calcular").onclick = calcularComanda;