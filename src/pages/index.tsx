import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Home.module.scss';
import Card from '@/components/Card';

interface CadastroData {
  classificacao: "lendario" | "mestre" | "estrela";
  quantidade_cadastros: number;
  operadores: string[];
}

export default function Home() {
  const [data, setData] = useState<CadastroData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<CadastroData[]>('/api/cadastros');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchData();
  }, []);

  // Função para definir a meta com base no estágio
    function getGoal(stage: string): number {
      if (stage === 'estrela') {
        return 6    ;
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
      {data.length > 0 &&
        data.map((item, index) => (
          <Card
            key={index}
            stage={item.classificacao}
            goal={(getGoal(item.classificacao))} // Defina a meta com base no estágio
            current={item.quantidade_cadastros}
            operatorNames={item.operadores}
          />
        ))}
    </div>
  );
}
