// hooks/usePlayAudio.js
import { useEffect } from 'react';

const usePlayAudio = (audioFiles) => {
  useEffect(() => {
    const playAudioSequentially = async (files) => {
      for (const file of files) {
        const audio = new Audio(file);
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.play();
        });
      }
    };

    playAudioSequentially(audioFiles);
  }, [audioFiles]);
};

export default usePlayAudio;
