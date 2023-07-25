//recipes
const ingredientList = document.getElementById('ingredient-list');
const instructionList = document.getElementById('instruction-list');
const addIngredientButton = document.getElementById('add-ingredient');
const addInstructionButton = document.getElementById('add-instruction');
const submitButton = document.getElementById('submit');
const ingredients = [];
const instructions = [];


//images 
const imageForm  = document.getElementById('image-form');
const imageInput = document.getElementById('image-input');
let imagesList  = [];

addIngredientButton.addEventListener('click', () => {
  const ingredientText = document.getElementById('ingredients-text').value;
  if (ingredientText) {
      ingredients.push(ingredientText);
      document.getElementById('ingredients-text').value = ''; 
  }
});

addInstructionButton.addEventListener('click', () => {
  const instructionText = document.getElementById('instructions-text').value;
  if (instructionText) {
    instructions.push(instructionText);
    document.getElementById('instructions-text').value = '';
  }
});


submitButton.addEventListener('click', () => {
  
  const name = document.getElementById('name-text').value;

  const categories = [];
  const categoryCheckboxes = document.querySelectorAll('input[name="categories"]:checked');
  categoryCheckboxes.forEach((checkbox) => {
    categories.push(checkbox.value);
  });

  const data = {
    name,
    ingredients,
    instructions,
    categories,
  };
  console.log(data)
  fetch('/recipe/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

    
      const formData = new FormData();
      const files = imageInput.files;

      if(files.length>0){
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append('images', file);
      }

      fetch('/images', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // Clear the form
          imageForm.reset();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    })
    
    .catch((error) => {
      console.error('Error:', error);
    });

});


//image form POST
imageForm.addEventListener('submit', (event) => {


  const formData = new FormData();
  const files = imageInput.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append('images', file);
  }
  fetch('/images', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
  
    console.log(data);
    // clear the form
    //imageForm.reset();
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const food = 'Tikka_Masala';
  const apiUrl = `/recipe/${food}`;
  
  if(!document.getElementById('recipe-name').innerHTML){
  fetch(apiUrl)
    .then(response => response.json())
    
    .then(data => {
      if (data) {
        const recipe = data;
        //const recipe = data;
        document.getElementById('recipe-name').innerHTML = recipe.name;
        const instructionsList = document.getElementById('instructions');
        recipe.instructions.forEach(instruction => {
          const li = document.createElement('li');
          li.textContent = instruction;
          instructionsList.appendChild(li);
        });

        const ingredientsList = document.getElementById('ingredients');
        recipe.ingredients.forEach(ingredient => {
          const li = document.createElement('li');
          li.textContent = ingredient;
          ingredientsList.appendChild(li);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }
});


const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = searchBar.value;
    window.location.href = `/recipe/${encodeURIComponent(searchTerm)}`;
  }
});
