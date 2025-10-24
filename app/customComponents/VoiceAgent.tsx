// VoiceAgent.tsx
import { SYSTEM_PROMPTS } from "@/constants/System-Prompts";
import { GoogleGenAI } from "@google/genai";
import * as Speak from "expo-speech";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useEffect, useRef, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { AIAgentIcon, AgentState } from "./AIAgentIcon";

type MessagePart = {
  text: string;
};

type Message = {
  role: string;
  parts: MessagePart[];
};

type ParsedResponse = {
  highlight: string;
  text: string;
};

const langMap: { [key: string]: string[] } = {
  en: ["en-US", "english", "I’m your helpful assistant. Ask me anything about this page!"],
  hi: ["hi-IN", "hindi", "मैं आपकी सहायक हूँ। इस पेज के बारे में मुझसे कुछ भी पूछिए!"],
};

export const VoiceAgent = ( {tutorialName, uiHandlerFunction,size}:{tutorialName:string,uiHandlerFunction:(locationRef:string)=>void,size:number}) => {
  const [state, setState] = useState<AgentState>("idle");
  const stateRef = useRef<AgentState>(state);
  const [disabled, setDisabled] = useState<Boolean>(true);
  const disabledRef = useRef<Boolean>(disabled);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const textRef = useRef<string>("");
  const language = useRef<string>("");
  const agentResponse = useRef<ParsedResponse>({text:"",highlight:"null"});
  const [error,setError] = useState<Boolean>(false);


  //initiaize elements
  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_KEY });
    (async () =>{
      language.current = await AsyncStorage.getItem("user-language")as string
      agentResponse.current = {text:langMap[language.current][2],highlight:"null"};
      setState("speaking");
    })();

    return () => {
      startAborting();
    };
  }, []);

  useEffect(()=>{
    disabledRef.current = disabled;
  },[disabled])


  useEffect(()=>{
    if(error)setState("idle");
  },[error]);

  useEffect(()=>{
    stateRef.current = state;
    if(state == "listening"){
      startListening();
    }else if(state == "processing"){
     startProcessing();
    }else if(state == "speaking"){
      startSpeaking();
    }else {
      if(error){
        //incase user have disabled it.
        setDisabled(false);
        setError(false);
      }else
        startAborting();
    }
  },[state]);



  useSpeechRecognitionEvent("result", (event) => {
    textRef.current = event.results[0]?.transcript || "";
  });

  useSpeechRecognitionEvent("end", () => {
    console.log("User finished speaking");
    if(disabledRef.current){
      //interrupted by user
      setDisabled(false);
    }else
      setState("processing");
  });


  // Start listening
  const startListening = async () => {
    await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    ExpoSpeechRecognitionModule.start({
      lang: language.current,
      interimResults: true,
    });
  };


  //Start processing
  const startProcessing = async ()=>{
    messagesRef.current.push({
      role: "user",
      parts: [{ text: textRef.current }],
    });

    if (!aiRef.current) aiRef.current = new GoogleGenAI({apiKey:process.env.EXPO_PUBLIC_GEMINI_KEY});

    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: SYSTEM_PROMPTS[tutorialName](
            langMap[language.current][1]
          ),
          responseMimeType: "application/json",
        },
        contents: messagesRef.current,
      });

      const responseText = response.text as string;

      let parsed: ParsedResponse;
      try {
        parsed = JSON.parse(responseText) as ParsedResponse;
        // Push AI message
        messagesRef.current.push({
          role: "model",
          parts: [{ text: responseText }],
        });
        agentResponse.current = parsed;
        if(disabledRef.current){
          messagesRef.current.pop();
          messagesRef.current.pop();
          setDisabled(false);
        }else setState("speaking");
      } catch (e) {
        console.error("Response is not valid JSON:", e);
        throw e;
      }
    } catch (err) {
      console.log("Error generating AI content:", err);
      messagesRef.current.pop();
      setError(true);
    }
  }

  //start speaking
  const startSpeaking = ()=>{
    uiHandlerFunction(agentResponse.current.highlight);
    Speak.speak(agentResponse.current.text, {
      language: langMap[language.current][0],
      rate: 0.8,
      onDone: ()=>{
        setState("idle");
        setDisabled(false); //for safety
      },
      onStopped:()=>{
        //interruption case
        setDisabled(false);
      }
    });
  }

  //start aborting
  const startAborting = async()=>{
    ExpoSpeechRecognitionModule.stop();
    await Speak.stop();
  }

  const handleClick = async()=>{
    if(stateRef.current !== "idle"){
      //it means user is interrupting the current state
      setDisabled(true);
      setState("idle");
    }
    else setState("listening");
  }

  return (
    <TouchableOpacity onPress={()=>disabled?null:handleClick()}>
      <AIAgentIcon state={state} size={size} />
    </TouchableOpacity>
  );
}