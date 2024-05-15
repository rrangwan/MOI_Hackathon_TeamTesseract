// pages/index.js
import { Box, Button, Image } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import usePlayAudio from '../hooks/usePlayAudio';
import CenteredContainer from '../components/CenteredContainer';
import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
//   usePlayAudio(['/orate-button.mp3', '/button-clicked.mp3']);
const [clickTimeout, setClickTimeout] = useState(null);
const singleClickAudioRef = useRef(null);
const doubleClickAudioRef = useRef(null);

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
    // Stop double-click audio if playing
    if (doubleClickAudioRef.current) {
      doubleClickAudioRef.current.pause();
      doubleClickAudioRef.current.currentTime = 0;
    }

    const audio = new Audio('/orate-assist-button.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleDoubleClick = () => {
    // Stop single-click audio if playing
    if (singleClickAudioRef.current) {
      singleClickAudioRef.current.pause();
      singleClickAudioRef.current.currentTime = 0;
    }

    const audio = new Audio('/button-assist-clicked.mp3');
    doubleClickAudioRef.current = audio;
    audio.play();
    setTimeout(() => {
      router.push('/page2');
    }, 6000); // 3-second delay before navigation
  };

  return (
    <>
        <Head>
        <title>MOI xHackathon  Team Tesseract</title>
         </Head>
        <CenteredContainer>
        <Image src="/image.jpg" alt="Description of image" mb={4} />
        <Button onClick={handleClick}>
            Active Assistive Technology
        </Button>
        </CenteredContainer>
    </>
  );
}
