import { create } from 'zustand';//Allows you to create custom store with state and actions to manage the apps global state.
import axios from 'axios';//Axios used for AJAX requests to fetch data without reloading the page.

const showStore = create((set) => ({
    graphData: [],
    data: null,

    //Async & Await makes function always return a promise.
    fetchData: async (id) => {
        const [graphRes, dataRes] = await Promise.all([
            //Fetch coins for historical market data and general info.
            //Fetch by specific id.
            axios.get(
                `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=121`
            ),
            axios.get(
                `https://api.coingecko.com/api/v3/coins/${id}?localization=false&market_data=true`
            ),
        ]);

        //Transform historical data to readable format by mapping data array.
        //Timestamp converted to readable date using localDateString. 
        try {
            const graphData = graphRes.data.prices.map((price) => {
                const [timestamp, p] = price;
                const date = new Date(timestamp).toLocaleDateString("en-US");
                //Array of objects displaying date and price.
                return {
                    Date: date,
                    Price: p,
                };
            });

            // Log the fetched data for debugging purposes
            console.log(dataRes);
            console.log(graphRes.data);

            // Update Zustand store state with the fetched and transformed dat
            set({ graphData })
            set({ data: dataRes.data });
        } catch (error) {
            // Handle any errors that may occur during data fetching
            console.error('Error fetching data:', error.message);
        }
    },
}));

export default showStore
