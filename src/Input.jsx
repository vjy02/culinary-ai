import { useState, useEffect } from 'react';
import React from 'react';
import {ThreeCircles} from 'react-loader-spinner';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';

const API_KEY = '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'; 

export default function Input() {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState(''); 
  const [suggestions, setSuggestions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [listExlusions, setExlusions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState('')
  const [isCopied, setIsCopied] = useState(false);

  const handleInput = (event) => {
    const inputValue = event.target.value;
    if (/^[A-Za-z ]*$/.test(inputValue)) {
      setInput(inputValue);
    } else {
      alert('Please enter only letters or space');
    }
  };

  function handleCopyClick() {
    setIsCopied(true)
    setTimeout(()=>
    setIsCopied(false)
    ,2000)
  }

  const addList = () => {
     if (listItems.includes(selectedOption) == true){
        alert('Please enter unique ingridients only')
    }
    else if (selectedOption && listItems.length < 8) {
      setInput('');
      setSuggestions([]);
      setSelectedOption(null);
      setListItems([...listItems, selectedOption]);
    }
    else if (listItems.length == 8){
      alert('You can only have up to 8 items in the list');
   }
   else{
      alert('Select from valid ingridients only.');
   }
  };

  const addExlusion = () => {
    if (listExlusions.includes(selectedOption) == true){
       alert('Please enter unique ingridients only')
   }
   else if (selectedOption && listExlusions.length < 8) {
     setInput('');
     setSuggestions([]);
     setSelectedOption(null);
     setExlusions([...listExlusions, selectedOption]);
   }
   else if (listExlusions.length == 8){
      alert('You can only have up to 8 items in the list');
   }
   else{
      alert('Select from valid ingridients only.');
   }
 };

  const deleteItemList = (item) => {
    setListItems(listItems.filter(food => food != item))
  }

  const deleteItemExcl = (item) => {
    setExlusions(listExlusions.filter(food => food != item))

  }

  async function callOpenAIAPI() {
    if (listItems.length > 0){
      console.log('Calling the OpenAI API');
      setLoading(true)

      const APIBody = {
        model: 'text-davinci-003',
        prompt:
          'Suggest 1 detailed recipe with specific quantities of each ingridients, using these ingridients:' +
          listItems.join(' ') + '. Do not include these ingridients at any cost:' +listExlusions.join(' ')+'. Do not suggest any of these banned recipes or recipe names, \
          each of these banned recipes are seperated by a "//" \
          : ' + recipes + 'END OF LIST.\
          If you cant think of any recipe that isnt in the list then return an appropriate recipe. Return with the following format:\
          recipe name, then an empty line then ingridients header followed by ingridient \
          list then another empty line then numbered instructions (dont seperate each step with a new line). Do not\
          include other ingridients at the beginning of ur answer.',
        temperature: 0,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };

      await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + API_KEY,
        },
        body: JSON.stringify(APIBody),
      })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setLoading(false)
        setMessage(data.choices[0].text);
        setRecipes(message+"//"+recipes)
      });
    }
    else{
      alert('Ingridient list empty! Please add at least one ingridient.')
    }
  }

  useEffect(() => {
    async function callSpoonacularAPI() {
        if (input) {
          await fetch(
            `https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=923b291dff704e07b3f2f0db15f83634&query=${input}&number=5`,
            {
              method: 'GET',
            }
          )
            .then((data) => {
              return data.json();
            })
            .then((data) => {
              console.log(data);
              const results = data.map((suggestion) => ({
                label: suggestion.name,
                value: suggestion.name,
                id: suggestion.id,
              }));
              setSuggestions(results);
            });
        } else {
          setSuggestions([]);
        }
    }      
    callSpoonacularAPI();
  }, [input]);

  return (
<div class="flex gap-40  items-center h-screen w-screen">
  <div class="flex justify-between flex-col ml-auto border-2 border-black-500 rounded-lg p-10 bg-white">
        <h1 class="flex-row text-4xl font-bold mb-4 font-Baskerville">CulinaryAI</h1>
        <div class="relative flex w-6/7 items-center mb-4 h-16">
            <div class="w-2/3">
                <input
                type="text"
                placeholder="Enter a food item"
                value={input}
                onChange={handleInput}
                class="py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                />
                {suggestions.length > 0 && (
                <div class="suggestions absolute top-12 left-0 bg-white rounded-lg border border-gray-300 mt-1 w-2/3 " >
                    {suggestions.map((suggestion) => (
                    <div
                        key={suggestion.id}
                        onClick={() => {
                            setInput(suggestion.label);
                            setSelectedOption(suggestion.label);
                            setSuggestions([])
                        }}
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                        {suggestion.label}
                    </div>
                    ))}
                </div>
                )}
            </div>
            <button
                onClick={addList}
                class="ml-2 py-2 px-4 bg-customGreen bg-customGreen-500 hover:bg-customGreen-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-customGreen-500"
            >
                Add
            </button>
            <button
                onClick={addExlusion}
                class="ml-2 py-2 px-4 bg-customGreen bg-customGreen-500 hover:bg-customGreen-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-customGreen-500"
            >
                Exclude
            </button>
        
        </div>
        <div class="h-[25vh]">
            <h3 class="text-xl font-bold mb-2">Selected Items:</h3>
            
            <div class="grid grid-cols-2 gap-20">

                <ul class="list-disc list-inside mb-4">
                {listItems.map((item) => (
                    <li key={item} class="flex items-center w-full mt-2">
                        {item}
                        <span class="ml-auto">
                            <svg  
                            onClick={() =>deleteItemList(item)} 
                            xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M14.293 5.293a1 1 0 011.414 0l.707.707a1 1 0 010 1.414L12.414 12l4.707 4.707a1 1 0 01-1.414 1.414L11 13.414l-4.707 4.707a1 1 0 01-1.414-1.414L9.586 12 4.879 7.293a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0L11 10.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </li>
                ))}
                </ul>

                <ul>
                {listExlusions.map((item) => (
                    <li key={item} class="flex items-center w-full mt-2 text-red-500">
                        {item}
                        <span class="ml-auto">
                            <svg  
                            onClick={() =>deleteItemExcl(item)} 
                            xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M14.293 5.293a1 1 0 011.414 0l.707.707a1 1 0 010 1.414L12.414 12l4.707 4.707a1 1 0 01-1.414 1.414L11 13.414l-4.707 4.707a1 1 0 01-1.414-1.414L9.586 12 4.879 7.293a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0L11 10.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </li>
                ))}
                </ul>

            </div>
        </div>
        <div class="flex mt-20">
            <button
                onClick={callOpenAIAPI}

                class="py-2 px-4 bg-customGreen hover:bg-customGreen-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-customGreen-500 mb-4"
            >
                Generate Recipe
            </button>
          </div>  
    </div>


    <div class="mb-8 w-1/2 mr-40 flex justify-center">
      {loading && (

      <ThreeCircles
        height="160"
        width="160"
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="three-circles-rotating"
        outerCircleColor=""
        innerCircleColor=""
        middleCircleColor=""
      />

      )}
        
    <div class="mt-50 flex align-center justify-center">
      {message && !loading && (
          <div class="border-2 border-black-500 rounded-lg p-10 pt-0 bg-white">
            <h3 class="message h-500 whitespace-pre-wrap mb-4">{message}</h3>
            <div class="flex gap-5 items-center">
              <CopyToClipboard text={message}>
                <button onClick={handleCopyClick} class="mt-10 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200">
                  <FiCopy class="text-gray-500"/>
                  <span>Copy to clipboard</span>
                </button>
              </CopyToClipboard>
              {isCopied && (
                  <div class="mt-8 text-green-600 font-semibold">Copied!</div>
              )}
            </div>
          </div>
      )}
    </div>
  </div>
</div>
)}
