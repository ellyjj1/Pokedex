# Pokédex App

This project is a **Pokédex web application** built with **React**, **Tailwind CSS**, **IndexedDB**, and the **PokeAPI**. It allows users to browse, search, and sort through a list of 151 Pokémon, view detailed stats, and see evolution chains. The app is designed with clean coding principles, strong error handling, and optimized performance using caching mechanisms.

## Features

- **Search & Sort**: Users can search for Pokémon by name or ID and sort them by various criteria, including height, weight, and type.
- **Detailed Pokémon Info**: Displays detailed information on Pokémon, including stats, abilities, types, evolutions, and weaknesses.
- **Local Data**: Uses **IndexedDB** to cache Pokémon data locally for reduce API access and improved performance.
- **Responsive Design**: Optimized for different screen sizes using **Tailwind CSS**.
- **Error Handling**: Gracefully handles API errors, connection issues, and missing data with fallback strategies.

## Design Approach

- **Clean Code**: Follows best practices, focusing on readability, maintainability, and modularity.
- **DRY Principle**: Reuses components and utilities to avoid duplication and improve maintainability.
- **Strong Typing**: Although JavaScript is used in this project, components are carefully typed through PropTypes for validation of props and state.
- **Error Handling**: Every API call and state update is wrapped in try-catch blocks, with user-friendly error messages.
- **Optimized Performance**: Caches API responses in IndexedDB to reduce API load and ensure a seamless user experience even when offline.

## Deploy
https://pokedex-ochre-nine.vercel.app/

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

    ```bash
   git clone https://github.com/your-username/pokedex-app.git

2. Navigate to the project directory:

    ```bash
    cd pokedex-app

3. Install the dependencies:
    ```bash
    npm install

4. Start the development server:
    ```bash
    npm start


## Code Structure

The application is structured to maintain separation of concerns and adhere to React best practices.

# Code Structure

```plaintext
src/
│
├── assets/                     # Static assets used in the application
│   ├── arrow.png               # Arrow image for evolutions chain
│   ├── logo.svg                # Pokémon logo for branding
│   └── Poke_ball_small.png     # Poké ball image for Footer
│
├── components/                 # All React components related to the UI
│   ├── Banner.jsx              # Banner component
│   ├── Footer.jsx              # Footer component
│   ├── PokemonCard.jsx         # Component for rendering individual Pokémon cards in the list
│   ├── PokemonDetail.jsx       # Detailed page for an individual Pokémon, showing stats, evolutions, etc.
│   └── PokemonList.jsx         # Component for rendering the main Pokémon list, includes sorting, searching, and filtering
│
├── utils/                      # Utility/helper functions that can be reused
│   └── getTypeColor.jsx        # Function to get color based on Pokémon types, used for styling type badges
│
├── Data_Fetching_and_Caching.js # Handles all the API requests and IndexedDB caching for Pokémon data
│
├── App.js                      # Main application component that brings all the components together
