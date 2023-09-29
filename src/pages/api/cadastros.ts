import { mockedData } from '@/mocks/data';
import { NextApiRequest, NextApiResponse } from 'next';

interface OriginalData {
  id_operador: number;
  nome_operador: string;
  telefone_operador: string;
  id_application: number;
  data_application: string;
  grupo_whatsapp: string;
  status_application: string;
}

// Seus dados originais
const data: OriginalData[] = mockedData;

// Função para contar duplicatas e gerar operadores únicos com contagem
function countDuplicatesAndGenerateUniqueOperators(data: OriginalData[]) {
  const operatorMap: Record<number, { operator: OriginalData, count: number, stage: string }> = {};

  for (const item of data) {
    const { id_operador } = item;

    if (operatorMap[id_operador]) {
      operatorMap[id_operador].count++;
    } else {
      operatorMap[id_operador] = { operator: item, count: 1, stage: '' };
    }
  }

  const sortedOperators = Object.values(operatorMap)
    .sort((a, b) => b.count - a.count);

  let currentStage = '';

  return sortedOperators.map(({ operator, count }) => {
    let stage = currentStage;
    if (count <= 6) {
      stage = 'estrela';
    } else if (count <= 12) {
      stage = 'mestre';
    } else {
      stage = 'lendario';
    }

    if (stage !== currentStage) {
      currentStage = stage;
    }

    return {
      operator,
      quantidade: count,
      stage,
    };
  });
}


export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const uniqueOperatorsWithCount = countDuplicatesAndGenerateUniqueOperators(data);

    res.status(200).json(uniqueOperatorsWithCount);
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
};
