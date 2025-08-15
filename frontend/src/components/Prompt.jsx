import axios from 'axios';
import { ArrowUp, Bot, Globe, History, Paperclip } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

function Prompt() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [inputValue, setInputValue] = useState("");
  const [typeMessage, setTypeMessage] = useState("");
  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  const promptEndRef = useRef();
  const storedPrompt = localStorage.getItem(`PromptHistory_${user._id}`);
  const hasPrompt = prompt.length > 0;

  useEffect(() => {
    if (storedPrompt) {
      setPrompt(JSON.parse(storedPrompt));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(`PromptHistory_${user._id}`, JSON.stringify(prompt));
  }, [prompt]);

  useEffect(() => {
    promptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prompt, loading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setTypeMessage(trimmed);
    setInputValue("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("https://deepseek-backend-2qlp.onrender.com/api/v1/deepseekai/prompt",
        { content: trimmed },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply }
      ]);
    } catch (error) {
      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "AI may have faced heavy load. Please try again later." }
      ]);
    } finally {
      setLoading(false);
      setTypeMessage(null);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="w-full h-screen flex flex-col items-center">
      
      {/* HEADER */}
      {!hasPrompt && (
        <div className='flex flex-col items-center justify-center mt-60'>
          <div className='flex items-center justify-center'>
            <img src="ai4.png" alt="ai image" className='h-10 w-10 mr-2'/>
            <span className='text-2xl font-semibold'>Hi, I'm DeepSeek.</span>
          </div>
          <div className='text-gray-500 text-sm mt-3'>
            How can I help you today?
          </div>
        </div>
      )}

      {hasPrompt && (
        
        <div className=' flex flex-col items-center justify-start mt-4 mb-4'>
          <div className='mb-3 text-black text-sm font-semibold'>
            How can I help you today?
          </div>
        </div>
        
      )}
      

      {/* PROMPT MESSAGES */}
      <div className={`scrollbar-hide overflow-y-auto scroll-smooth w-full max-w-4xl flex-1 ${!hasPrompt ? 'mt-6' : 'mt-0'} mb-32 space-y-4 px-4`}>
        
        {prompt.map((msg, index) => (
          <div key={index} className={`w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            
            {msg.role === "assistant" ? (
              
              <div className="w-full text-gray-800 rounded-xl px-4 py-3 text-md whitespace-pre-wrap">
                <div className='mb-2'><img src="ai4.png" alt="" className='h-8 w-8'/></div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          customStyle={{
                            fontSize: '14px',
                            borderRadius: '10px',
                            padding: '14px',
                            backgroundColor: '#f9fafb',
                          }}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-100 px-1 py-0.5 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className='whitespace-normal break-words self-end bg-[#eff6ff] text-gray-800 px-3 py-2 rounded-xl max-w-[90%]'>{msg.content}</div>
            )}
          </div>
        ))}

        <div ref={promptEndRef} />
        {loading && typeMessage && (
          <div className='flex justify-end'>
            <div className="self-end ml-auto whitespace-normal bg-[#eff6ff] text-gray-800 px-3 py-2 rounded-xl max-w-[90%]">
              {typeMessage}
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="mb-3 text-black px-4 py-3 rounded-xl text-md animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* INPUT BOX FIXED TO BOTTOM */}
      <div className={`w-full px-4 max-w-4xl ${!hasPrompt ? "fixed top-90":"fixed bottom-6"}`}>
        <div className='bg-gray-50 border border-gray-100 p-5 rounded-3xl shadow-md'>
          <input
            type="text"
            placeholder='Message DeepSeek'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleEnter}
            className='overflow-x-scroll bg-transparent outline-none mt-1 w-full text-black'
          />

          <div className='flex items-center justify-between mt-4'>
            <div className='flex gap-2'>
              <button className='cursor-pointer px-3 py-1 flex items-center text-sm gap-2 bg-white border border-gray-300 rounded-2xl text-black hover:bg-gray-200 hover:text-blue-600 transition'>
                <Bot className='h-5 w-5' />Deepthink(R1)
              </button>
              <button className='cursor-pointer px-3 py-1 flex items-center text-sm gap-2 bg-white border border-gray-300 rounded-2xl text-black hover:bg-gray-200 hover:text-blue-600 transition'>
                <Globe className='h-4 w-4' />Search
              </button>
            </div>
            <div className='flex gap-3'>
              <Paperclip className='h-5 w-5 cursor-pointer' />
              <button onClick={handleSend}>
                <ArrowUp className={`text-white p-1 h-7 w-7 rounded-full transition ${inputValue.trim() ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' : 'cursor-not-allowed bg-gray-300'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prompt;
