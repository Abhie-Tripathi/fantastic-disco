import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import DataHandle from './components/DataHandle';
import ColorPalette from './components/ColorPalette';
import CalendarModal from './components/calendar';
import AddEvent from './components/AddEvent';
import Widgets from './components/widgets/Widget';
import EmployeePage from './components/employeepage/EmployeePage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/data' element={<DataHandle/>} />
        <Route path='/palette' element={<ColorPalette/>} />
        <Route path='/slots' element={<CalendarModal/>} />
        <Route path='/addevent' element={<AddEvent/>} />
        <Route path='/employee' element={<EmployeePage/>}/>
        <Route path='/widgets' element={<Widgets/>}/>
      </Routes>
    </div>
  )
};


export default App