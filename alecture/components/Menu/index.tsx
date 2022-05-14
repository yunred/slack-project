import React, { FC, CSSProperties, useCallback } from 'react';
import * as S from './style';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton = true }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return (
    <S.CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <S.CloseModalButton onClick={onCloseModal}> &times;</S.CloseModalButton>}
        {children}
      </div>
    </S.CreateMenu>
  );
};

export default Menu;
