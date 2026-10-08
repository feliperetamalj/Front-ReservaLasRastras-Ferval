import { Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { IrArriba } from './components/layout/IrArriba';
import { Metadatos } from './components/layout/Metadatos';
import { WhatsAppFlotante } from './components/layout/WhatsAppFlotante';
import { Inicio } from './pages/Inicio';
import { Modelos } from './pages/Modelos';
import { ModeloDetalle } from './pages/ModeloDetalle';
import { MasterPlan } from './pages/MasterPlan';
import { ElBarrio } from './pages/ElBarrio';
import { Partners } from './pages/Partners';
import { Contacto } from './pages/Contacto';
import { Privacidad } from './pages/Privacidad';
import { Agendar } from './pages/Agendar';
import { Gestionar } from './pages/Gestionar';
import { NoEncontrada } from './pages/NoEncontrada';

export default function App() {
  return (
    <>
      <a className="saltoContenido" href="#contenido">
        Saltar al contenido
      </a>

      <IrArriba />
      <Metadatos />
      <Header />

      <main id="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/modelos" element={<Modelos />} />
          <Route path="/modelos/:slug" element={<ModeloDetalle />} />
          <Route path="/master-plan" element={<MasterPlan />} />
          <Route path="/el-barrio" element={<ElBarrio />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/agendar" element={<Agendar />} />
          <Route path="/agendar/gestionar" element={<Gestionar />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppFlotante />
    </>
  );
}
