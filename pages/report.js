import { Box, Button, Text } from "@chakra-ui/react";
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import CenteredContainer from '../components/CenteredContainer';
import styles from '../styles/GlassButton.module.css';


// Updated mapping from characters to Braille patterns
const brailleMap = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
  'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
  'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵', ' ': ' ',
  '0': '⠴', '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔',
  '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', '-': '⠤', ';': '⠆', ':': '⠒', '\'': '⠄', '\"': '⠶', '(': '⠐⠣', ')': '⠐⠜'
};

// Function to convert text to Braille
const toBraille = (text) => {
  return text.split('').map(char => brailleMap[char.toLowerCase()] || char).join('');
};

const generatePDF = (data) => {
  const doc = new jsPDF();
  const text = `Applicant ${data.name} with ID ${data['id-number']} has a clean record.`;
  doc.text(text, 10, 10);
  doc.save('report.pdf');
};

const generateBraille = (data) => {
  const text = `Applicant ${data.name} with ID ${data['id-number']} has a clean record.`;
  const brailleText = toBraille(text); // Use the toBraille function
  const doc = new jsPDF();
  doc.setFont("Courier", "normal");
  doc.text(brailleText, 10, 10);
  doc.save('report-braille.pdf');
};
export default function Report() {
  const [formData, setFormData] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [clickTimeout, setClickTimeout] = useState(null);

  const initialAudioRefs = useRef([]);
  const singleClickAudioRef = useRef(null);
  const doubleClickAudioRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(Cookies.get('formData') || '{}');
    setFormData(data);

    const playInitialAudio = async () => {
      const audioFiles = ['/orate-report.mp3', '/orate-pdf.mp3', '/orate-brf.mp3'];
      for (const file of audioFiles) {
        const audio = new Audio(file);
        initialAudioRefs.current.push(audio);
        await new Promise((resolve) => {
          audio.onended = resolve;
          audio.play();
        });
      }
      speakText(`Text. Applicant ${data.name} with ID ${data['id-number']} has a clean record.`);
    };

    playInitialAudio();

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

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleButtonClick1 = (singleClickAction, doubleClickAction) => {
    stopAllAudio();
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleButtonDoubleClick1(doubleClickAction);
    } else {
      const timeout = setTimeout(() => {
        handleButtonSingleClick1(singleClickAction);
        setClickTimeout(null);
      }, 300); // Adjust delay as needed
      setClickTimeout(timeout);
    }
  };

  const handleButtonClick = (singleClickAction, doubleClickAction) => {
    stopAllAudio();
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleButtonDoubleClick(doubleClickAction);
    } else {
      const timeout = setTimeout(() => {
        handleButtonSingleClick(singleClickAction);
        setClickTimeout(null);
      }, 300); // Adjust delay as needed
      setClickTimeout(timeout);
    }
  };

  const handleButtonSingleClick = (action) => {
    stopAllAudio();
    const audio = new Audio('/orate-pdf.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
    if (action) action();
  };

  const handleButtonDoubleClick = (action) => {
    stopAllAudio();
    const audio = new Audio('/pdf-clicked.mp3');
    doubleClickAudioRef.current = audio;
    audio.play();
    audio.onended = action;
  };

  const handleButtonSingleClick1 = (action) => {
    stopAllAudio();
    const audio = new Audio('/orate-brf.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
    if (action) action();
  };

  const handleButtonDoubleClick1 = (action) => {
    stopAllAudio();
    const audio = new Audio('/brf-clicked.mp3');
    doubleClickAudioRef.current = audio;
    audio.play();
    audio.onended = action;
  };

  const handleReportClick = () => {
    stopAllAudio();
    const audio = new Audio('/orate-report.mp3');
    singleClickAudioRef.current = audio;
    audio.play();
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <>
      <Head>
        <title>MOI xHackathon Team Tesseract</title>
      </Head>
      <CenteredContainer>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button className={styles.glassButton} onClick={handleReportClick}>
            Criminal Report
          </Button>
          <br />
          <br />
          <Button className={styles.glassButton} onClick={() => handleButtonClick(() => handleButtonSingleClick(), () => generatePDF(formData))}>
            Download PDF File
          </Button>
          <br />
          <br />
          <Button className={styles.glassButton} onClick={() => handleButtonClick1(() => handleButtonSingleClick(), () => generateBraille(formData))}>
            Download Braille Ready Format
          </Button>
          <br />
          <br />
          {/* <Button className={styles.glassButton} onClick={() => handleButtonClick(() => handleButtonSingleClick(), () => generateDigitalBraille(formData))}>
            Download Digital Braille
          </Button>
          <br />
          <br /> */}
          <Text onClick={() => speakText(`Text. Applicant ${formData.name} with ID ${formData['id-number']} has a clean record.`)}>
            Applicant {formData.name} with ID {formData['id-number']} has a clean record.
          </Text>
        </Box>
      </CenteredContainer>
    </>
  );
}
