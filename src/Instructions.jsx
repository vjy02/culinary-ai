export default function Instructions(props){

    const handleClose = () => {
      props.handleHidden(true);
    }
    
    return(
      <div className="z-30 fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
        <div className="border-2 border-black-500 rounded-lg p-10 bg-white w-1/3 gap-10 flex flex-col items-center pb-20 bg-white">
          <h1 className="text-3xl mb-4 font-bold">Welcome to CulinaryAI!</h1>
          <h3 className="text-xl mb-6">CulinaryAI is a ChatGPT powered recipe generator. It's fast and simple to use:<br /><br />
            1. Start typing the ingredients you want and don't want.<br /><br />
            2. Click <span class="text-sm py-2 px-3 bg-customGreen text-white rounded-lg focus:outline-none ml-1 mr-1">Generate recipe</span> and wait a few seconds as the AI thinks.<br /><br />
            3. A tailored recipe will be generated on the right side of the screen! <br /><br />
            Feel free to generate as many recipe as you need, the AI will try its best to think of new recipes each time.
          </h3>
          <button className="text-xl py-2 px-4 bg-customGreen hover:bg-customGreen-600 text-white rounded-lg focus:outline-none focus:ring focus:ring-customGreen-500 w-1/3"
            onClick={handleClose}
          >
            Let's Start!
          </button>
        </div>
      </div>
    )
  }
  