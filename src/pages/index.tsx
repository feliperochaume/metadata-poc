import React from 'react';
import axios from 'axios';

import Card from '@/components/Card';

import styles from '@/styles/Home.module.scss';

interface OperatorData {
  id_operador: number;
  nome_operador: string;
  telefone_operador: string;
  id_application: number;
  data_application: string;
  grupo_whatsapp: string;
  status_application: string;
}

interface FormattedData {
  quantidade: number;
  operator: OperatorData;
  stage: 'lendario' | 'mestre' | 'estrela';
}

export default function Home() {
  const [data, setData] = React.useState<FormattedData[]>([]);

  React.useEffect(() => {
    async function fetchCadastros() {
      const response = await axios.get('/api/cadastros');
      setData(response.data);
    }

    fetchCadastros();
  }, []);

  // Função para definir a meta com base no estágio
  function getGoal(stage: string): number {
    if (stage === 'estrela') {
      return 6;
    } else if (stage === 'mestre') {
      return 12;
    } else if (stage === 'lendario') {
      return 32;
    } else {
      return 0; // Valor padrão, você pode ajustar conforme necessário
    }
  }  

  return (
    <div className={styles.homeContainer}>
      {data.length > 0 && (
        <>
          {data.map((item, index) => (
            <Card
              key={index}
              stage={item.stage}
              goal={(getGoal(item.stage))} // Defina a meta com base no estágio
              current={item.quantidade}
              operatorName={item.operator.nome_operador}
            />
          ))}
        </>
      )}
    </div>
  )
}
