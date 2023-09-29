import React from 'react';
import Image from 'next/image';
import reward_icon from '../../assets/social-medias-rewards-rating.svg';
import styles from './card.styles.module.scss';

interface Props {
  stage: "lendario" | "mestre" | "estrela";
  goal: number;
  current: number;
  operatorName: string;
}

const Card: React.FC<Props> = ({ stage, goal, current, operatorName }) => {
  const totalCadastros = goal; // Valor total de cadastros
  const cadastrosConcluidos = current; // Valor atual de cadastros concluídos
  const porcentagemConcluida = (cadastrosConcluidos / totalCadastros) * 100;

  // Define uma classe de estilo com base no valor de 'stage'
  const cardStyle = stage === 'lendario' ? styles.lendario : stage === 'mestre' ? styles.mestre : styles.estrela;

  function formatStringToTitleCase(inputString: string): string {
    // Dividir a string em palavras usando espaço como separador
    const words = inputString.split(' ');
  
    // Mapear cada palavra e formatá-la para o formato de título
    const titleCaseWords = words.map(word => {
      // Converter a primeira letra da palavra para maiúscula e o restante para minúscula
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    // Juntar as palavras formatadas de volta em uma única string
    return titleCaseWords.join(' ');
  }

  return (
    <div className={`${styles.card} ${cardStyle}`}>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${porcentagemConcluida}%` }}
        ></div>
      </div>
      <p className={styles.metaText}>{cadastrosConcluidos} de {totalCadastros} cadastros para garantir 1 voucher IFood de R$30!</p>
      <section className={styles.operatorSection}>
        <Image src={reward_icon} alt="Reward Icon" width={24} height={24} />
        <h3>{formatStringToTitleCase(operatorName)}</h3>
      </section>
      <button className={styles.cardBtn}>
        Já garantiu R$ 128 nesta rodada!
      </button>
    </div>
  );
}

export default Card;
