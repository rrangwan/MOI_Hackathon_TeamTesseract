import { Box, Button } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import CenteredContainer from '../components/CenteredContainer';
import styles from '../styles/GlassButton.module.css'; // Ensure the correct path

console.log(styles);

export default function Page2() {
  const router = useRouter();
  
  // Use useEffect to play the audio once when the component mounts
  useEffect(() => {
    const playInitialAudio = async () => {
      const audioFiles = ['/orate-options-available.mp3', '/orate-cr-button.mp3', '/btn.mp3'];
      for (const file of audioFiles) {
        const audio = new Audio(file);
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.play();
        });
      }
    };

    playInitialAudio();
  }, []);

  const [clickTimeout, setClickTimeout] = useState(null);
  const singleClickAudioRef = useRef(null);
  const doubleClickAudioRef = useRef(null);

  const stopAllAudio = () => {
    if (singleClickAudioRef.current) {
      singleClickAudioRef.current.pause();
      singleClickAudioRef.current.currentTime = 0;
    }
    if (doubleClickAudioRef.current) {
      doubleClickAudioRef.current.pause();
      doubleClickAudioRef.current.currentTime = 0;
    }
  };

  const handleOptionsAvailableClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-options-available.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick();
    } else {
      const timeout = setTimeout(() => {
        handleSingleClick();
        setClickTimeout(null);
      }, 300); // Adjust delay as needed
      setClickTimeout(timeout);
    }
  };

  const handleSingleClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-cr-button.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleDoubleClick = () => {
    stopAllAudio();
    const audio = new Audio('/button-cr-clicked.mp3');
    doubleClickAudioRef.current = audio;
    audio.play();
    setTimeout(() => {
      router.push('/form');
    }, 4500); // 3-second delay before navigation
  };

  return (
    <>
      <Head>
        <title>MOI xHackathon Team Tesseract</title>
      </Head>
      <CenteredContainer>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button className={styles.glassButton} onClick={handleOptionsAvailableClick}>
            Options Available
          </Button>
          <br />
          <br />
          <Button className={styles.glassButton} onClick={handleClick}>
            Criminal Reports
          </Button>
          <br />
          <br />
          <Button className={styles.glassButton}>
            Menu Option 2
          </Button>
          <br />
          <br />
          <Button className={styles.glassButton}>
            Menu Option 3
          </Button>
        </Box>
      </CenteredContainer>
    </>
  );
}
