const searchBtn = document.querySelector("#search");
const clearBtn = document.querySelector("#clear");
const resultsContainer = document.querySelector(".resuts-container");

searchBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	const searchField = document.querySelector("#search-field");

	const searchParam = searchField.value;
	if (searchParam === "") {
		alert("Please try again");
	} else {
		const data = await getData();
		if (data) {
			const results = processSearch(searchParam, data);
			updateUi(results);
		}
	}
});

clearBtn.addEventListener("click", () => {
	e.preventDefault();
	const searchField = document.querySelector("#search-field");

	searchField.value = "";
});

async function getData() {
	const dataUrl = "./assets/js/travel_recommendation_api.json";

	try {
		const res = await fetch(dataUrl);
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		const data = await res.json();

		return data;
	} catch (error) {
		console.error("Failed to fetch data:", error);
		return null;
	}
}

function processSearch(location, data) {
	const { countries, temples, beaches } = data;

	const searchKeyword = location.trim().toLowerCase();

	let results = [];

	// country
	const matchCountry = countries.find((country) =>
		country.name.toLowerCase().includes(searchKeyword)
	);

	if (matchCountry) {
		results.push({
			type: "Country",
			places: matchCountry.cities,
		});
	}

	// temples
	if (searchKeyword === "temple" || searchKeyword === "temples") {
		results.push({
			type: "Temples",
			places: temples,
		});
	}

	// beaches
	if (searchKeyword === "beach" || searchKeyword === "beaches") {
		results.push({
			type: "Beaches",
			places: beaches,
		});
	}

	// No matches
	if (results.length === 0) {
		console.log(`No matches found for "${location}".`);
		alert(`No matches found for "${location}".`);
		return;
	}
	console.log(results);
	return results;
}

function updateUi(locationData) {
	const places = locationData[0]["places"];

	const resContainer = document.querySelector(".results-container");
	resContainer.innerHTML = "";

	places.forEach((place) => {
		const { name, imageUrl, description } = place;

		const article = document.createElement("article");
		article.classList.add("results-item");

		const img = document.createElement("img");
		img.src = imageUrl;
		img.alt = `An image of ${name}`;

		const h3 = document.createElement("h3");
		h3.textContent = name;

		const p = document.createElement("p");
		p.textContent = description;

		const button = document.createElement("button");
		button.classList.add("btn");
		button.textContent = "Visit";

		article.appendChild(img);
		article.appendChild(h3);
		article.appendChild(p);
		article.appendChild(button);

		resContainer.appendChild(article);
	});
}
