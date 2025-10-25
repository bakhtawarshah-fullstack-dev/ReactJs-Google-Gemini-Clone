import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({children}) => {
    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompt, setPrevPrompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');
    
    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev+nextWord);
        }, 75*index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        console.log("onSent clicked...")
        setResultData('');
        setLoading(true);
        setShowResult(true);

        let response;
        if(prompt !== undefined){
            setRecentPrompt(prompt);
            response = await runChat(prompt);
        } else {
            setRecentPrompt(input);
            setPrevPrompt(prev => [...prev, input]);
            response = await runChat(input);
        }

        let responseArray = response.split("**");
        let newResponseArray = '';
        responseArray.map((item, index) => {
            if(index === 0 || index%2 !== 1){
                newResponseArray += responseArray[index];
            } else {
                newResponseArray += '<strong>'+responseArray[index]+'</strong>';
            }
        });
        let newResponse2 = newResponseArray.split("*") ? newResponseArray.split("*").join('<br />') : newResponseArray;
        let newResponse = newResponse2.split(" ");
        newResponse.forEach((item, index) => {
            const nextWord = item;
            delayPara(index, nextWord+" ");
        });
        setLoading(false);
        setInput('');
    }

    const contextValue = {
        onSent,
        input, setInput,
        recentPrompt, setRecentPrompt,
        prevPrompt,
        showResult,
        loading,
        resultData,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
}

export default ContextProvider;