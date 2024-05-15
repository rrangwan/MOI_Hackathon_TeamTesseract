import { Box, Button, Input } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import CenteredContainer from '../components/CenteredContainer';
import styles from '../styles/GlassButton.module.css';

export default function Form() {
  const router = useRouter();
  
  const initialAudioRefs = useRef([]);
  const singleClickAudioRef = useRef(null);
  const doubleClickAudioRef = useRef(null);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [submitClickCount, setSubmitClickCount] = useState(0);

  // Use useEffect to play the audio once when the component mounts
  useEffect(() => {
    const playInitialAudio = async () => {
      const audioFiles = ['/orate-title-available.mp3', '/orate-name-available.mp3', '/name-field.mp3', '/orate-id-available.mp3', '/id-field.mp3', '/orate-submit-button.mp3'];
      for (const file of audioFiles) {
        const audio = new Audio(file);
        initialAudioRefs.current.push(audio);
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.play();
        });
      }
    };

    playInitialAudio();

    // Cleanup function to stop all initial audios when component unmounts
    return () => {
      initialAudioRefs.current.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  const stopAllAudio = () => {
    initialAudioRefs.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    if (singleClickAudioRef.current) {
      singleClickAudioRef.current.pause();
      singleClickAudioRef.current.currentTime = 0;
    }
    if (doubleClickAudioRef.current) {
      doubleClickAudioRef.current.pause();
      doubleClickAudioRef.current.currentTime = 0;
    }
  };

  const handleTitleAvailableClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-title-available.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleNameAvailableClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-name-available.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleIDAvailableClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-id-available.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleSubmitClick = () => {
    stopAllAudio();
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleSubmitDoubleClick();
    } else {
      const timeout = setTimeout(() => {
        handleSubmitSingleClick();
        setClickTimeout(null);
      }, 300); // Adjust delay as needed
      setClickTimeout(timeout);
    }
  };

  const handleSubmitSingleClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-submit-button.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleSubmitDoubleClick = () => {
    const nameField = document.querySelector('input[name="name"]').value;
    const idField = document.querySelector('input[name="id-number"]').value;

    if (!nameField || !idField) {
      stopAllAudio();
      const audio = new Audio('/button-submit-clicked.mp3');
      doubleClickAudioRef.current = audio;
      audio.play();
      setSubmitClickCount(0); // Reset the click count
      return;
    }

    if (submitClickCount === 0) {
      stopAllAudio();
      const nameAudio = new SpeechSynthesisUtterance(nameField);
      speechSynthesis.speak(nameAudio);

      nameAudio.onend = () => {
        const idAudio = new SpeechSynthesisUtterance(idField);
        speechSynthesis.speak(idAudio);
        idAudio.onend = () => setSubmitClickCount(1);
      };
    } else {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    const form = document.querySelector('form');
    const formData = new FormData(form);
    Cookies.set('formData', JSON.stringify(Object.fromEntries(formData.entries())));
    router.push('/report');
  };

  const handleInputChange = (event) => {
    stopAllAudio();
    const char = event.target.value.slice(-1);
    if (char) {
      const utterance = new SpeechSynthesisUtterance(char);
      speechSynthesis.speak(utterance);
    }
  };

  const handleSingleClick2 = () => {
    stopAllAudio();
    const audio = new Audio('/name-field.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const handleSingleClick3 = () => {
    stopAllAudio();
    const audio = new Audio('/id-field.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  return (
    <>
      <Head>
        <title>MOI xHackathon Team Tesseract</title>
      </Head>
      <CenteredContainer>
        <Button className={styles.glassButton} onClick={handleTitleAvailableClick}>
          Request Criminal Report
        </Button>
        <br />
        <br />
        <Button className={styles.glassButton} onClick={handleNameAvailableClick}>
          Name
        </Button>
        <br />
        <br />
        <form>
          <Input
            name="name"
            placeholder="name"
            aria-label="name"
            mb={4}
            required
            onClick={handleSingleClick2}
            onChange={handleInputChange}
          />
          <Button className={styles.glassButton} onClick={handleIDAvailableClick}>
            ID Number
          </Button>
          <br />
          <br />
          <Input
            name="id-number"
            placeholder="id-number"
            aria-label="id-number"
            mb={4}
            required
            onClick={handleSingleClick3}
            onChange={handleInputChange}
          />
          <Button type="button" className={styles.glassButton} onClick={handleSubmitClick}>
            Submit
          </Button>
        </form>
      </CenteredContainer>
    </>
  );
}
