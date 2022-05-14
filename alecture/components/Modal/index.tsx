import * as S from '@components/Modal/style';
import React, { FC, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<Props> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <S.CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <S.CloseModalButton onClick={onCloseModal}>&times;</S.CloseModalButton>
        {children}
      </div>
    </S.CreateModal>
  );
};

export default Modal;
