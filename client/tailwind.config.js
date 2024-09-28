/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", // Note the addition of the tsx file extension
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dolly': "url('images/bill.jpeg')",
        'login': "url('images/login.jpg')",
        'background': "url('images/dolly.jpeg')",
        'background1': "url('images/dolly2.jpg')"
      },
      fontFamily: {
        'henny': 'Henny Penny, system-ui',
        'raleway': "Raleway, sans-serif",
        'lora': "Lora, serif",
        'Playfair': "Playfair Display, serif",
        'lato':'Lato, sans-serif'
      },
      backgroundColor: {
        'background-color': '#b794f4',
        'background-color1': '#38b2ac',

      },
      colors: {
        Coral: '#FF7F50',
        TangerineOrange: '#FFA500'
      },
      screens:{
        'medium':'786px',
        'mediumlarge':'872px',
        'mediunlarge1':"865px",
        'mediunlarge2':"842px",
        'sm-md': '770px',
        'lg-md': '865px',
        'sm-ma':'768px',
        'sm-ma1':'200px'
        
      }

    },
  },
  plugins: [],
}
