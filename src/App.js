import { BrowserRouter, Route, Routes} from 'react-router-dom'

import { Home } from './pages/Home';
import { Question} from './pages/Question';

import {AuthContextProvider} from './contexts/AuthContext'

function App() {   

  return (
    <BrowserRouter> 
    <AuthContextProvider>
     <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/question/:id" exact element={<Question/>} />      
     </Routes> 
     </AuthContextProvider>    
    </BrowserRouter>
   );
}

export default App;
