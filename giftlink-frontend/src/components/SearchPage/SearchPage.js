import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';
import './SearchPage.css';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?`;
            const params = new URLSearchParams();
            if (searchQuery) params.append('name', searchQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedCondition) params.append('condition', selectedCondition);
            params.append('age_years', ageRange);
            url += params.toString();

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Fetch error: ' + error.message);
        }
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        // Task 6. Enable navigation to the details page of a selected gift.
        navigate(`/app/product/${productId}`);
    };




    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <label>Category</label>
                            <select className="dropdown-filter" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">All</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>

                            <label>Condition</label>
                            <select className="dropdown-filter" value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
                                <option value="">All</option>
                                {conditions.map((condition, index) => (
                                    <option key={index} value={condition}>{condition}</option>
                                ))}
                            </select>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <label>Less than {ageRange} years</label>
                            <input
                                type="range"
                                className="age-range-slider"
                                min="1"
                                max="10"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Task 7: Add text input field for search criteria*/}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="search-input form-control"
                            placeholder="Search for gifts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Task 8: Implement search button with onClick event to trigger search:*/}
                    <button className="search-button btn btn-primary mb-3" onClick={handleSearch}>
                        Search
                    </button>

                    {/*Task 5: Display search results and handle empty results with a message. */}
                    {searchResults.length > 0 ? (
                        searchResults.map((gift) => (
                            <div key={gift.id} className="search-results-card card mb-3" onClick={() => goToDetailsPage(gift.id)}>
                                <div className="card-body">
                                    <h5 className="card-title">{gift.name}</h5>
                                    <p className="card-text">{gift.description?.slice(0, 100)}...</p>
                                    <p className="card-text"><small>Category: {gift.category} | Condition: {gift.condition}</small></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="mt-3">No results found. Try adjusting your filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
