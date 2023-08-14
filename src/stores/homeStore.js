import { create } from 'zustand';//Allows you to create custom store with state and actions to manage the apps global state.
import axios from 'axios';//Axios used for AJAX requests to fetch data without reloading the page.
import debounce from '../helpers/debounce';//Debouncing used to limit the number of API calls. Function wraps the logic so that it won't be executed until 500 ms after last call.

const homeStore = create((set) => ({
	//State to store the coins, trending coins, query results, etc.
	coins: [],
	trending: [],
	query: '',
	searched: false,

	//Updates the query state when a coin is searched.
	setQuery: (e) => {
		set({ query: e.target.value });
		homeStore.getState().searchCoins()
	},

	//Function to search for a coin.
	//Async & Await  handle asynchronous operations and avoid callback issues.
	searchCoins: debounce(async () => {
		//Set searching state to true before making the calls.
		set({ searching: true });
		//Retrieve the values of query and trending.
		const { query, trending } = homeStore.getState();

		//Makes sure the length of the query is > 2 before making API call to avoid unnecessary calls.
		if (query.length > 2) {
			try {
				const res = await axios.get
					(`https://api.coingecko.com/api/v3/search?query=${query}`);

				//Mapping results that extracts name, image and id
				const coins = res.data.coins.map((coins) => ({

					name: coins.name,
					image: coins.large,
					id: coins.id,

				}));
				//Set the state so coins array is updated and searched is set to true.
				set({ coins, searched: true });
			} catch (err) {
				//Handle errors during AP call.
				console.error('Error during API call to retrieve:', err.message);
				// Show an error message to the user.
				set({ coins: [], searched: false, errMessage: 'An error occurred during the search. Please try again later.' });
			}
		} else {
			//When search box is empty or < 2 revert back to trending, and searched state is false.
			set({ coins: trending, searched: false });
		}
	}, 500),

	//Function for using the API to fetch the coins. 
	//Async & Await makes function always return a promise.
	fetchCoins: async () => {
		try{

		const [res, btcRes] = await Promise.all([

			//Fetch trending coins, and Bitcoin price in USD.
			axios.get('https://api.coingecko.com/api/v3/search/trending'),

			axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
		]);

		//Extract Bitcoin price in USD from response.
		const btcPrice = btcRes.data.bitcoin.usd;
		// console.log(btcPrice);

		//Array that returns only the selected data from the api instead of the whole object.
		const coins = res.data.coins.map((coin) => {
			return {
				name: coin.item.name,
				image: coin.item.large,
				id: coin.item.id,
				priceBtc: (coin.item.price_btc).toFixed(10),//Set to 10 decimal places
				priceUsd: (coin.item.price_btc * btcPrice).toFixed(10),//Set to 10 decimal places

			};
		});

		//Update the state with the fetched coins and trending data.
	set({ coins, trending: coins });
	
	//Handle errors during AP call.
	} catch (err) {
		console.error('Error during API call to retrieve:', err.message);
		throw err;
	}

}}))

export default homeStore
