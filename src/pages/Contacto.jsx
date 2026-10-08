import { Link } from 'react-router-dom';
import { Contenedor, Icono, Reveal, Seccion } from '../components/ui';
import { Formulario } from '../components/sections';
import { Encabezado } from './Encabezado';
import { CONTACTO, CORPORATIVO, HORARIO } from '../data/proyecto';
import { whatsAppDirecto } from '../utils/contacto';
import s from './Contacto.module.css';

const VIAS = [
  {
    icono: 'calendario',
    titulo: 'Visita a la sala',
    detalle: 'Elige día y hora: te mostramos el barrio, los sitios y las casas.',
    accion: 'Agendar visita',
    a: '/agendar',
  },
  {
    icono: 'whatsapp',
    titulo: 'WhatsApp',
    detalle: 'La vía más rápida. Te responde una ejecutiva en horario de sala.',
    accion: 'Abrir WhatsApp',
    href: whatsAppDirecto(),
    externo: true,
  },
  {
    icono: 'telefono',
    titulo: 'Teléfono de la sala',
    detalle: CONTACTO.telefono,
    accion: 'Llamar',
    href: `tel:${CONTACTO.telefonoLink}`,
  },
  {
    icono: 'correo',
    titulo: `Correo de ${CORPORATIVO.nombre}`,
    detalle: CONTACTO.email,
    accion: 'Escribir',
    href: `mailto:${CONTACTO.email}`,
  },
];

export function Contacto() {
  return (
    <>
      <Encabezado
        versalita="Contacto"
        titulo="Hablemos de tu casa"
        bajada="Visítanos en la sala de ventas o escríbenos: te respondemos con superficies, precios vigentes y disponibilidad real de sitios."
      />

      <Seccion fondo="papel" compacta>
        <ul className={s.vias}>
          {VIAS.map((v, i) => (
            <Reveal como="li" key={v.titulo} retraso={i * 70} className={s.via}>
              <span className={s.iconoVia}>
                <Icono nombre={v.icono} tamano={24} />
              </span>
              <h2 className={s.viaTitulo}>{v.titulo}</h2>
              <p className={s.viaDetalle}>{v.detalle}</p>
              {v.a ? (
                <Link to={v.a} className={s.viaAccion}>
                  {v.accion}
                  <Icono nombre="flecha" tamano={15} />
                </Link>
              ) : (
                <a
                  href={v.href}
                  className={s.viaAccion}
                  {...(v.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {v.accion}
                  <Icono nombre="flecha" tamano={15} />
                </a>
              )}
            </Reveal>
          ))}
        </ul>
      </Seccion>

      <Seccion fondo="blanco">
        <div className={s.grilla}>
          <div>
            <p className={`versalita ${s.versalita}`}>Formulario</p>
            <h2 className={s.tituloForm}>Déjanos tus datos</h2>
            <p className={s.bajadaForm}>
              Completa y elige por dónde prefieres que te lleguemos. El mensaje se arma solo.
            </p>
            <Formulario />
          </div>

          <aside className={s.aside}>
            <h2 className={`versalita ${s.versalita}`}>{CONTACTO.sala}</h2>
            <address className={s.direccion}>
              {CONTACTO.direccion}
              <br />
              {CONTACTO.ciudad}
              <br />
              <a href={CONTACTO.mapa} target="_blank" rel="noopener noreferrer" className={s.mapa}>
                Ver en Google Maps
              </a>
            </address>

            <h3 className={`versalita ${s.versalita} ${s.versalitaExtra}`}>Horario</h3>
            <ul className={s.horario}>
              {HORARIO.map((h) => (
                <li key={h.dias} className={s.fila}>
                  <span>{h.dias}</span>
                  <span className={`${s.horas} tabular`}>{h.horas}</span>
                </li>
              ))}
            </ul>

            <p className={s.notaHorario}>
              Desde la sala salen las visitas al loteo, de lunes a sábado. Domingo cerrado.
            </p>

            <h3 className={`versalita ${s.versalita} ${s.versalitaExtra}`}>{CORPORATIVO.nombre}</h3>
            <p className={s.direccion}>
              {CORPORATIVO.direccion}
              <br />
              <a href={`tel:${CORPORATIVO.telefonoLink}`} className="tabular">
                {CORPORATIVO.telefono}
              </a>
            </p>
          </aside>
        </div>
      </Seccion>

      <Seccion fondo="alterno" compacta>
        <Contenedor ancho="texto" className={s.mapaAviso}>
          <Icono nombre="pin" tamano={24} className={s.iconoMapa} />
          <p>
            La sala de ventas está en {CONTACTO.direccion}, {CONTACTO.ciudad}. El acceso al barrio
            es directo desde Av. Las Rastras.{' '}
            <a href={CONTACTO.mapa} target="_blank" rel="noopener noreferrer">
              Cómo llegar
            </a>
          </p>
        </Contenedor>
      </Seccion>
    </>
  );
}
