document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
    let filterOn = false;
  
    // Fetch data from the server
    fetch("http://localhost:3000/pups")
      .then((response) => response.json())
      .then((data) => {
        // Display all dogs in the dog bar
        data.forEach((dog) => {
          const span = document.createElement("span");
          span.textContent = dog.name;
          span.addEventListener("click", () => displayDogInfo(dog));
          dogBar.appendChild(span);
        });
      });
  
    // Display dog information
    function displayDogInfo(dog) {
      dogInfo.innerHTML = `
        <img src="${dog.image}" />
        <h2>${dog.name}</h2>
        <button>${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
      `;
      // Toggle dog goodness
      const dogButton = dogInfo.querySelector("button");
      dogButton.addEventListener("click", () => toggleGoodness(dog));
    }
  
    // Toggle dog goodness
    function toggleGoodness(dog) {
      dog.isGoodDog = !dog.isGoodDog;
      fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isGoodDog: dog.isGoodDog,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          const dogButton = dogInfo.querySelector("button");
          dogButton.textContent = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
        });
    }
  
    // Filter good dogs
    filterButton.addEventListener("click", () => {
      filterOn = !filterOn;
      filterButton.textContent = filterOn ? "Filter good dogs: ON" : "Filter good dogs: OFF";
      // Clear dog bar
      dogBar.innerHTML = "";
      // Fetch data from the server
      fetch("http://localhost:3000/pups")
        .then((response) => response.json())
        .then((data) => {
          // Display filtered dogs in the dog bar
          data.forEach((dog) => {
            if (!filterOn || dog.isGoodDog) {
              const span = document.createElement("span");
              span.textContent = dog.name;
              span.addEventListener("click", () => displayDogInfo(dog));
              dogBar.appendChild(span);
            }
          });
        });
    });
  });
  