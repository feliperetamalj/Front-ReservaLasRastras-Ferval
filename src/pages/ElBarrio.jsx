import { Contenedor, Icono, Reveal, Seccion } from '../components/ui';
import { Atributos, BloqueContacto, Galeria } from '../components/sections';
import { Encabezado } from './Encabezado';
import { ENTORNO, GALERIA_BARRIO, PROYECTO, RAZONES } from '../data/proyecto';
import s from './ElBarrio.module.css';

export function ElBarrio() {
  return (
    <>
      <Encabezado
        versalita="El barrio"
        titulo="Por qué vivir en Reserva Las Rastras"
        bajada={`Un barrio urbanizado en el sector nororiente de ${PROYECTO.comuna}, a pocos metros de un entorno comercial de alta plusvalía y cerca de instituciones de salud, educación y entretenimiento.`}
      />

      <Seccion fondo="papel" compacta>
        <ol className={s.razones}>
          {RAZONES.map((r, i) => (
            <Reveal como="li" key={r.titulo} retraso={i * 80} className={s.razon}>
              <span className={`${s.numero} tabular`}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className={s.razonTitulo}>{r.titulo}</h2>
                <p className={s.razonTexto}>{r.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Seccion>

      <Atributos fondo="blanco" />

      <Seccion
        fondo="papel"
        versalita="El barrio hoy"
        titulo="Construido, no proyectado"
        bajada="El portal, las avenidas y las áreas verdes ya existen. Estas son imágenes del barrio tal como se recorre hoy."
      >
        <Galeria imagenes={GALERIA_BARRIO} />
      </Seccion>

      <Seccion fondo="tinta" compacta>
        <Contenedor ancho="texto" className={s.entorno}>
          <p className="versalita">Entorno</p>
          <h2 className={s.entornoTitulo}>Todo a pocos minutos</h2>
          <p className={s.entornoTexto}>
            Acceso directo desde Av. Las Rastras y veinte minutos hasta el centro de{' '}
            {PROYECTO.comuna}.
          </p>
          <ul className={s.servicios}>
            {ENTORNO.map((e) => (
              <li key={e} className={s.servicio}>
                <Icono nombre="check" tamano={16} className={s.check} />
                {e}
              </li>
            ))}
          </ul>
        </Contenedor>
      </Seccion>

      <BloqueContacto
        titulo="Ven a conocer el barrio"
        bajada="Agenda una visita a la sala de ventas y recorre el loteo con una ejecutiva."
      />
    </>
  );
}
