/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, RefreshCw, Bot } from 'lucide-react';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { clientConfigurations, ClientConfiguration, FlowOption } from './chatbot-configurations';

interface Message {
    id: number;
    text: string | React.ReactNode;
    sender: 'bot' | 'user';
}

interface UserData {
    service?: string;
    [key: string]: any;
}

const TypingIndicator = () => (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2"> <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0"> <Bot size={24} className="text-gray-600" /> </div> <div className="bg-gray-200 rounded-2xl rounded-bl-lg p-3"> <div className="flex items-center gap-1.5"> <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-0"></span> <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-150"></span> <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-300"></span> </div> </div> </motion.div>);

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeConfig, setActiveConfig] = useState<ClientConfiguration>(clientConfigurations.thebotagency);
    const [messages, setMessages] = useState<Message[]>([]);
    const [flowState, setFlowState] = useState<string>('INITIAL');
    const [userData, setUserData] = useState<UserData>({});
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [phoneValue, setPhoneValue] = useState<string | undefined>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sendSoundRef = useRef<HTMLAudioElement | null>(null);
    const receiveSoundRef = useRef<HTMLAudioElement | null>(null);
    const nextId = useRef(2);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const clientKey = urlParams.get('client');
        if (clientKey && clientConfigurations[clientKey]) {
            setActiveConfig(clientConfigurations[clientKey]);
        } else {
            setActiveConfig(clientConfigurations.thebotagency);
        }
    }, []);

    useEffect(() => {
        let initialMessage = `Hey 👋 I'm Harry, your virtual guide from ${activeConfig.brandName}.\nHow can I help you today?`;
        if (activeConfig.brandName === 'Global Softwares') {
            initialMessage = "Hi, I am your virtual assistant. How can I help you today?";
        }

        setMessages([{ id: 1, text: initialMessage, sender: 'bot' }]);
        setFlowState('INITIAL');
        setUserData({});
        nextId.current = 2;
    }, [activeConfig]);

    useEffect(() => { sendSoundRef.current = new Audio('/sounds/send.mp3'); receiveSoundRef.current = new Audio('/sounds/receive.mp3'); }, []);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
    useEffect(() => { if (isOpen) { scrollToBottom(); const lastMessage = messages[messages.length - 1]; if (lastMessage?.sender === 'bot' && messages.length > 1) { receiveSoundRef.current?.play().catch(e => console.error("Error playing receive sound:", e)); } } }, [messages, isOpen]);
    useEffect(() => { window.parent.postMessage({ type: 'chatbot-status', status: isOpen ? 'open' : 'closed' }, '*'); }, [isOpen]);

    const addMessage = (text: string | React.ReactNode, sender: 'user' | 'bot') => {
        if (sender === 'user') { sendSoundRef.current?.play().catch(e => console.error("Error playing send sound:", e)); }
        const newId = nextId.current++;
        setMessages(prev => [...prev, { id: newId, text, sender }]);
    };

    const handleResetChat = () => {
        nextId.current = 2;
        let initialMessage = `Hey 👋 I'm Harry, your virtual guide from ${activeConfig.brandName}.\nHow can I help you today?`;
        if (activeConfig.brandName === 'Global Softwares') {
            initialMessage = "Hi, I am your virtual assistant. How can I help you today?";
        }
        setMessages([{ id: 1, text: initialMessage, sender: 'bot' }]);
        setFlowState('INITIAL');
        setUserData({});
        setIsTyping(false);
    };

    const submitProductRequest = async (data: UserData) => {
        addMessage("Just a moment, saving your details...", 'bot');
        const API_URL = `${activeConfig?.apiUrl || process.env.NEXT_PUBLIC_GLOBAL_SOFT_URL}/api/product`;

        const payload = {
            fullname: "ChatBot Lead",
            companyName: data.companyName || '',
            email: data.email || '',
            product: data.service || 'Not Specified',
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown API error occurred.');
            }

            await response.json();
            return true;
        } catch (error) {
            console.error("Failed to submit product request:", error);
            addMessage("Oops! There was a problem saving your info. Our team has been notified.", 'bot');
            return false;
        }
    };

    const submitLeadData = async (data: UserData) => {

        addMessage("Just a moment, saving your details...", 'bot');
        const API_URL = `${activeConfig?.apiUrl || process.env.NEXT_PUBLIC_API_BASE_URL}/api/lead-generate/`;
        const formData = new FormData();
        formData.append('first_name', 'ChatBot');
        formData.append('last_name', 'Lead');
        formData.append('access_key', process.env.NEXT_PUBLIC_CLIENT_ID || '0694b9b2-af29-4505-891c-c623dec03c5d');
        formData.append('interested_in', data.service || 'Other');
        formData.append('source', window.location.href);
        formData.append('email', data.email || '');
        formData.append('phone', data.phone || '');
        const note = Object.entries(data).map(([key, value]) => `${key}: ${value}`).join('\n');
        formData.append('note', note);
        try {
            const response = await fetch(API_URL, { method: 'POST', body: formData });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.data?.email) { addMessage("That email address doesn't look quite right. Could you please double-check it?", 'bot'); }
                else if (errorData.msg?.includes("You are in our list")) { addMessage("Looks like you're already in our system! Our team will be in touch with you soon.", 'bot'); return true; }
                else { throw new Error(errorData.msg || 'An unknown error occurred.'); }
                return false;
            }
            return true;
        } catch (error) {
            console.error("Failed to submit lead data:", error);
            addMessage("Oops! There was a problem saving your info. Our team has been notified.", 'bot');
            return false;
        }
    };

    const handleOptionSelect = (option: FlowOption) => {
        addMessage(option.text, 'user');
        const newUserData = { ...userData };
        if (flowState === 'INITIAL' && option.service) {
            newUserData.service = option.service;
        }

        newUserData[flowState] = option.text;
        setUserData(newUserData);
        if (option.action === 'OPEN_LINK' && option.link) { window.open(option.link, '_blank'); }
        setIsTyping(true);
        setTimeout(() => { setIsTyping(false); addMessage(option.botResponse, 'bot'); setFlowState(option.nextState); }, 1200);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentFlowStep = activeConfig.flow[flowState];
        if (currentFlowStep?.type !== 'input') return;

        let submittedValue = '';
        let dataKey = '';

        if (currentFlowStep.inputType === 'phone') {
            if (!phoneValue || phoneValue.trim() === '') return;
            submittedValue = phoneValue;
            dataKey = 'phone';
        } else {
            if (inputValue.trim() === '') return;
            submittedValue = inputValue;

            dataKey = flowState === 'COLLECT_COMPANY_GS' ? 'companyName' : currentFlowStep.inputType;
        }

        addMessage(submittedValue, 'user');
        const newUserData = { ...userData, [dataKey]: submittedValue };
        setUserData(newUserData);

        setInputValue('');
        setPhoneValue('');
        setIsTyping(true);

        if (currentFlowStep.submitOnCompletion) {
            let success = false;

            if (activeConfig.apiType === 'PRODUCT_REQUEST') {
                success = await submitProductRequest(newUserData);
            } else {
                success = await submitLeadData(newUserData);
            }

            setIsTyping(false);
            if (success) {
                setTimeout(() => {
                    addMessage(currentFlowStep.botResponse, 'bot');
                        setFlowState(currentFlowStep.nextState ?? "END");
                }, 500);
            }
        } else {

            setIsTyping(false);
            addMessage(currentFlowStep.botResponse, 'bot');
            setFlowState(currentFlowStep.nextState ?? "END");
        }
    };

    const renderCurrentStep = () => {
    if (isTyping) return <TypingIndicator />;

    const currentFlowStep = activeConfig.flow[flowState];
    if (!currentFlowStep || currentFlowStep.type !== 'options') return null;

    return (
        <div className="flex flex-col gap-2">
            {/* Display the question */}
            {currentFlowStep.question && (
                <div className="text-gray-800 text-sm font-medium p-2">{currentFlowStep.question}</div>
            )}

            {/* Display the options */}
            {currentFlowStep.options.map((option: FlowOption) => (
                <button
                    key={option.text}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full text-left cursor-pointer text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-4 py-2 transition-colors flex items-center gap-2"
                >
                    {option.text}
                </button>
            ))}
        </div>
    );
};

    const currentFlowStep = activeConfig.flow[flowState];
    const showInputBar = currentFlowStep?.type === 'input' && !isTyping;
    const showOptions = currentFlowStep?.type === 'options' && !isTyping;

    return (
        <>
            <style jsx global>{`
                html.dark, body.dark { background: transparent !important;}                
                .PhoneInput { width: 100%; border: 1px solid #d1d5db; border-radius: 9999px; padding: 0 1rem; display: flex; align-items: center; }
                .PhoneInput:focus-within { --tw-ring-color: #3b82f6; box-shadow: var(--tw-ring-inset, 0 0 0 calc(2px + var(--tw-ring-offset-width, 0px)) var(--tw-ring-color)); }
                .PhoneInputInput { height: 2.5rem; border: none; outline: none; background-color: transparent; flex-grow: 1; width: 100%; }
                .PhoneInputCountry { margin-right: 0.5rem; }
            `}</style>

            <div className="fixed inset-0 z-50 flex flex-col items-end pointer-events-none">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="w-full h-full sm:w-96 sm:h-full bg-white rounded-xl shadow-2xl flex flex-col pointer-events-auto"
                        >
                            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-1 rounded-full"><Image src="/images/bot-icon.png" width={48} height={48} alt="Avatar" /></div>
                                    <h3 className="font-bold text-base">{activeConfig.brandName === 'Global Softwares' ? 'Virtual Assistant' : `Harry from ${activeConfig.brandName}`}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handleResetChat} title="Start Over" className="hover:bg-blue-700 cursor-pointer p-1 rounded-full transition-colors"><RefreshCw size={20} /></button>
                                    <button onClick={() => setIsOpen(false)} title="Close Chat" className="hover:bg-blue-700 cursor-pointer p-1 rounded-full transition-colors"><X size={20} /></button>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex-1 overflow-y-auto p-4">
                                    <div className="flex flex-col gap-3">
                                        {messages.map((msg) => (<div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}> {msg.sender === 'bot' && <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0"> <Bot size={24} className="text-gray-600" /> </div>} <div className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}> <div className="text-sm whitespace-pre-wrap">{msg.text}</div> </div> </div>))}
                                        {isTyping && <TypingIndicator />}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                {showOptions && (<div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50"> <div className="flex flex-col gap-2">{renderCurrentStep()}</div> </div>)}
                            </div>

                            {showInputBar && currentFlowStep.type === 'input' && (
                                <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
                                    <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                                        {currentFlowStep.inputType === 'phone' ? (
                                            <PhoneInput placeholder="Enter your phone number..." value={phoneValue} onChange={setPhoneValue} defaultCountry="IN" international limitMaxLength autoFocus />
                                        ) : (
                                            <input type={currentFlowStep.inputType} placeholder="Enter your response..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="off" autoFocus />
                                        )}
                                        <button type="submit" className="bg-blue-600 cursor-pointer text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors shrink-0"><Send size={20} /></button>
                                    </form>
                                </div>
                            )}

                            <div className="text-center text-xs text-gray-400 py-2 bg-white rounded-b-xl border-t">
                                Powered by <strong>PJ</strong>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="pointer-events-auto">
                    <div className="pointer-events-auto">
                        {!isOpen && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsOpen(true)}
                                className="absolute bottom-2 right-2 bg-white hover:bg-white/80 transition-colors rounded-full shadow-lg p-1 cursor-pointer flex items-center justify-center"
                            >
                                <Image src="/images/bot-icon.png" width={65} height={65} alt="Avatar" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}