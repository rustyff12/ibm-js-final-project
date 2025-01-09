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
			processSearch(searchParam, data);
		}
	}
	// console.log(searchParam);
});

clearBtn.addEventListener("click", () => {
	e.preventDefault();
	const searchField = document.querySelector("#search-field");

	searchField.value = "";
	// console.log(searchField.value);
});

async function getData() {
	const dataUrl = "./assets/js/travel_recommendation_api.json";

	try {
		const res = await fetch(dataUrl);
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}
		const data = await res.json();
		// console.log(data);
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
			name: matchCountry.name,
			cities: matchCountry.cities,
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

	console.log("Search results: ", JSON.stringify(results));
}
