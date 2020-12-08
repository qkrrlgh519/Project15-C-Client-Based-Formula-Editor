import useCurrentTab from '@hooks/useCurrentTab';
import { useSelector } from 'react-redux';
import { RootState } from '@contexts/index';
import html2canvas from 'html2canvas';
import * as clipboard from 'clipboard-polyfill';
import { ClipboardItem } from 'clipboard-polyfill';
import React, { useRef, useState } from 'react';
import { setToken, getToken } from '@utils/token';
import useToggle from '@hooks/useToggle';

export const useSaveButtons = () => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentTabInfo } = useCurrentTab();
  const { mathfieldRef } = useSelector((state: RootState) => state.latex);
  const [message, onToggleMessage] = useToggle(false);
  const [imageUrl, setImageUrl] = useState('');

  const downloadText = () => {
    const fileName = `수식셰프${Date.now()}.txt`;
    const element = document.createElement('a');
    element.href = `data:text/plain; charset=utf-8,${currentTabInfo.latex}`;
    element.download = fileName;
    element.click();
  };

  const downloadImage = () => {
    if (mathfieldRef) {
      html2canvas(mathfieldRef).then((canvas) => {
        const url = canvas.toDataURL('image/png');
        const element = document.createElement('a');
        element.href = url;
        element.download = `수식셰프${Date.now()}.png`;
        element.click();
      });
    }
  };

  const clipboardHandler = () => {
    messageHandler();
    if (mathfieldRef) {
      html2canvas(mathfieldRef).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          }
        });
      });
    }
  };

  const messageHandler = () => {
    onToggleMessage();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onToggleMessage();
    }, 2500);
  };

  const createQrcode = () => {
    if (!process.env.Client_ID) return;
    const clientId: string = process.env.Client_ID;

    if (mathfieldRef) {
      html2canvas(mathfieldRef).then((canvas) => {
        canvas.toBlob((blob) => {
          if (!blob) return;
          const formData = new FormData();
          formData.append('image', blob);
          fetch('https://api.imgur.com/3/image', {
            method: 'post',
            headers: {
              Authorization: clientId,
              Accept: 'application/json',
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((response) => {
              setImageUrl(response.data.link);
            });
        });
      });
    }
  };

  const saveHandler = () => {
    console.log('이미지저장');
  };

  return {
    downloadImage,
    downloadText,
    clipboardHandler,
    message,
    createQrcode,
    imageUrl,
    setImageUrl,
    saveHandler,
  };
};

export default useSaveButtons;
