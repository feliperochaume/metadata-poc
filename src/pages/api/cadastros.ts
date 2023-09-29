import { NextApiRequest, NextApiResponse } from 'next';
import { mockedData } from '@/mocks/data';

// Interface para representar um cadastro com sua quantidade
interface CadastroQuantidade {
  nome_operador: string;
  quantidade_cadastros: number;
}

// Enum para as classificações de acordo com a quantidade de cadastros
enum Classificacao {
  Estrela = 'estrela',
  Mestre = 'mestre',
  Lendario = 'lendario',
}

// Função para contar a quantidade de cadastros por operador
function contarCadastrosPorOperador(): Record<string, number> {
  const cadastroPorOperador: Record<string, number> = {};

  mockedData.forEach((cadastro) => {
    const nomeOperador = cadastro.nome_operador;
    cadastroPorOperador[nomeOperador] = (cadastroPorOperador[nomeOperador] || 0) + 1;
  });

  return cadastroPorOperador;
}

// Função para converter o objeto em um array de objetos
function converterParaArray(cadastroPorOperador: Record<string, number>): CadastroQuantidade[] {
  return Object.entries(cadastroPorOperador).map(([nomeOperador, quantidadeCadastros]) => ({
    nome_operador: nomeOperador,
    quantidade_cadastros: quantidadeCadastros,
  }));
}

// Função para agrupar operadores por quantidade de cadastros
function agruparPorQuantidade(cadastroPorOperadorArray: CadastroQuantidade[]): Record<number, string[]> {
  const cadastrosPorQuantidade: Record<number, string[]> = {};

  cadastroPorOperadorArray.forEach((item) => {
    const quantidade = item.quantidade_cadastros;
    if (!cadastrosPorQuantidade[quantidade]) {
      cadastrosPorQuantidade[quantidade] = [];
    }
    cadastrosPorQuantidade[quantidade].push(item.nome_operador);
  });

  return cadastrosPorQuantidade;
}

// Função para determinar a classificação com base na quantidade de cadastros
function getClassificacao(quantidadeCadastros: number): Classificacao {
  if (quantidadeCadastros >= 7 && quantidadeCadastros <= 12) {
    return Classificacao.Mestre;
  } else if (quantidadeCadastros >= 13 && quantidadeCadastros <= 32) {
    return Classificacao.Lendario;
  }
  return Classificacao.Estrela;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Conta a quantidade de cadastros por operador
    const cadastroPorOperador = contarCadastrosPorOperador();

    // Converte o objeto em um array de objetos
    const cadastroPorOperadorArray = converterParaArray(cadastroPorOperador);

    // Ordena o array em ordem decrescente
    cadastroPorOperadorArray.sort((a, b) => b.quantidade_cadastros - a.quantidade_cadastros);

    // Agrupa operadores por quantidade de cadastros
    const cadastrosPorQuantidade = agruparPorQuantidade(cadastroPorOperadorArray);

    // Cria um novo array com classificação
    const novoArray = Object.keys(cadastrosPorQuantidade).map((quantidade) => {
      const quantidadeCadastros = parseInt(quantidade, 10);
      const classificacao = getClassificacao(quantidadeCadastros);

      return {
        quantidade_cadastros: quantidadeCadastros,
        operadores: cadastrosPorQuantidade[quantidadeCadastros],
        classificacao: classificacao,
      };
    });

    // Ordena o novo array em ordem decrescente com base na quantidade_cadastros
    novoArray.sort((a, b) => b.quantidade_cadastros - a.quantidade_cadastros);

    res.status(200).json(novoArray);
  } else {
    res.status(405).end(); // Método não permitido
  }
};
