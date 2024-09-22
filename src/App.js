import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';
import Banner from './components/Banner';
import Footer from './components/Footer';
import './App.css';


function App() {
  return (
      <Router >
            <Banner/>
        <Routes>
          <Route exact path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;