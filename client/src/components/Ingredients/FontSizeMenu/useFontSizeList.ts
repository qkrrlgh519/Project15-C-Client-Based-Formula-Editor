import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editLatex } from '@contexts/latex';
import { FONT_SIZE_LISTS } from '@constants/constants';
import { FontSizeListType, FontSizeMenuProps } from './index';

const useFontSizeList = ({ toggleSizeMenu }: FontSizeMenuProps) => {
  const dispatch = useDispatch();
  const [stateList, setStateList] = useState<FontSizeListType[]>(FONT_SIZE_LISTS);

  const clickHandler = (clickIndex: number, fontSize: string) => {
    const newStateList = stateList.map((state, index) => {
      state.checked = clickIndex === index ? true : false;
      return state;
    });

    dispatch(editLatex({ fontSize }));
    toggleSizeMenu();
    setStateList(newStateList);
  };

  return {
    clickHandler,
  };
};

export default useFontSizeList;
