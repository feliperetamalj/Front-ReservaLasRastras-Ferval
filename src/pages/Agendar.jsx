import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Boton, Contenedor, Icono } from '../components/ui';
import { Encabezado } from './Encabezado';
import { EVENTO, TEXTOS, mensajeRespaldo } from '../data/agenda';
import { CONTACTO, HORARIO } from '../data/proyecto';
import { SITIOS } from '../data/sitios';
import { modelos } from '../data/modelos';
import { calendario, crearIcs, fechaLegible, validarDatos } from '../utils/agenda';
import { enlaceWhatsApp, whatsAppDirecto } from '../utils/contacto';
import f from '../components/sections/Formulario.module.css';
import s from './Agendar.module.css';

const VACIO = {
  nombre: '',
  telefono: '',
  email: '',
  interes: '',
  comentario: '',
  consentimiento: false,
  marketing: false,
  website: '', // trampa para bots
};

const OPCIONES = [
  ...modelos.map((m) => `Modelo ${m.nombre}`),
  'Un sitio con casa construida',
  'Un sitio para construir',
];

/** Lo que llega por la URL (?sitio=B23 o ?modelo=slug), solo si existe en los datos. */
function interesDesdeUrl(params) {
  const sitio = SITIOS.find((x) => x.id === params.get('sitio')?.toUpperCase());
  if (sitio) return `Sitio ${sitio.id}`;
  const modelo = modelos.find((m) => m.slug === params.get('modelo'));
  return modelo ? `Modelo ${modelo.nombre}` : '';
}

const semana = new Intl.DateTimeFormat('es-CL', { weekday: 'short', timeZone: 'UTC' });
const mes = new Intl.DateTimeFormat('es-CL', { month: 'short', timeZone: 'UTC' });
const partesDia = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return { semana: semana.format(d).replace('.', ''), numero: d.getUTCDate(), mes: mes.format(d).replace('.', '') };
};
const MOTIVO_CORTO = { 'Domingo cerrado': 'Cerrado', Cerrado: 'Cerrado', Feriado: 'Feriado', 'Sin horas disponibles': 'Completo' };

function validar(datos, eleccion) {
  const errores = validarDatos(datos);
  if (!eleccion.fecha) errores.fecha = 'Elige el día de tu visita.';
  else if (!eleccion.hora) errores.hora = 'Elige la hora.';
  if (!datos.consentimiento)
    errores.consentimiento = 'Para agendar necesitamos tu autorización para usar estos datos.';
  return errores;
}

const TODOS = Object.fromEntries(
  ['nombre', 'telefono', 'email', 'interes', 'comentario', 'consentimiento', 'fecha', 'hora'].map((k) => [k, true]),
);

/**
 * Agenda de visitas: día, hora y datos en una sola página.
 *
 * La disponibilidad viene de /api/disponibilidad. Si la agenda no está
 * configurada o no responde, el mismo formulario arma el pedido y lo abre en
 * WhatsApp: nunca se pierde un contacto.
 */
export function Agendar() {
  const [params] = useSearchParams();
  const [interesUrl] = useState(() => interesDesdeUrl(params));
  const [datos, setDatos] = useState(() => ({ ...VACIO, interes: interesUrl }));
  const [eleccion, setEleccion] = useState({ fecha: null, hora: null });
  const [ocupados, setOcupados] = useState(() => new Set());
  const [modo, setModo] = useState('cargando'); // cargando · agenda · whatsapp
  const [estado, setEstado] = useState('editando'); // editando · enviando · enviada · fallo
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});
  const [intentos, setIntentos] = useState(0);
  const [aviso, setAviso] = useState('');
  const refResumen = useRef(null);
  const refConfirmacion = useRef(null);

  const dias = useMemo(() => calendario(new Date(), ocupados), [ocupados]);
  const dia = dias.find((d) => d.fecha === eleccion.fecha);

  const cargar = useCallback(async () => {
    try {
      const r = await fetch('/api/disponibilidad');
      const j = await r.json();
      if (!r.ok) throw new Error(String(r.status));
      setOcupados(new Set(j.ocupados));
      setModo(j.configurada ? 'agenda' : 'whatsapp');
    } catch {
      setModo('whatsapp');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // El foco va al resumen de errores ya pintado (mismo motivo que en Formulario.jsx).
  useEffect(() => {
    if (intentos > 0) refResumen.current?.focus();
  }, [intentos]);

  useEffect(() => {
    if (estado === 'enviada') refConfirmacion.current?.focus();
  }, [estado]);

  const revalidar = (nuevosDatos, nuevaEleccion) => setErrores(validar(nuevosDatos, nuevaEleccion));

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const nuevos = { ...datos, [campo]: valor };
    setDatos(nuevos);
    if (tocado[campo]) revalidar(nuevos, eleccion);
  };

  const salir = (campo) => () => {
    setTocado((t) => ({ ...t, [campo]: true }));
    revalidar(datos, eleccion);
  };

  const elegir = (cambios) => {
    const nueva = { ...eleccion, ...cambios };
    setEleccion(nueva);
    setAviso('');
    if (tocado.fecha) revalidar(datos, nueva);
  };

  const respaldo = () =>
    enlaceWhatsApp(
      mensajeRespaldo({
        ...datos,
        fecha: eleccion.fecha && fechaLegible(eleccion.fecha),
        hora: eleccion.hora,
      }),
    );

  const enviar = async (e) => {
    e.preventDefault();
    const nuevos = validar(datos, eleccion);
    setErrores(nuevos);
    setTocado(TODOS);
    if (Object.keys(nuevos).length) {
      setIntentos((n) => n + 1);
      return;
    }

    if (modo === 'whatsapp') {
      window.open(respaldo(), '_blank', 'noopener,noreferrer');
      return;
    }

    setEstado('enviando');
    setAviso('');
    try {
      const r = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos, ...eleccion }),
      });
      const j = await r.json().catch(() => ({}));

      if (r.status === 201) return setEstado('enviada');
      if (r.status === 409) {
        // Otra persona tomó el bloque mientras llenaba: se libera la hora y se recarga.
        setEleccion((x) => ({ ...x, hora: null }));
        setAviso(j.error || 'Esa hora se acaba de ocupar. Elige otra.');
        await cargar();
        return setEstado('editando');
      }
      if (r.status === 422 || r.status === 429) {
        setErrores(j.errores ?? {});
        setAviso(r.status === 429 ? j.error || 'Recibimos varias solicitudes seguidas. Intenta en unos minutos.' : '');
        if (j.errores) setIntentos((n) => n + 1);
        return setEstado('editando');
      }
      throw new Error(String(r.status));
    } catch {
      setEstado('fallo');
    }
  };

  const campo = (nombre, etiqueta, props = {}) => {
    const conError = Boolean(errores[nombre] && tocado[nombre]);
    const comun = {
      id: `a-${nombre}`,
      value: datos[nombre],
      onChange: cambiar(nombre),
      onBlur: salir(nombre),
      'aria-invalid': conError || undefined,
      'aria-describedby': [props.ayuda && `ay-${nombre}`, conError && `e-${nombre}`].filter(Boolean).join(' ') || undefined,
    };
    return (
      <div className={`${f.campo} ${props.ancho ? s.ancho : ''}`}>
        <label className={f.etiqueta} htmlFor={`a-${nombre}`}>
          {etiqueta}
          {props.opcional && <span className={f.opcional}> · opcional</span>}
        </label>
        {props.ayuda && (
          <p className={s.ayuda} id={`ay-${nombre}`}>
            {props.ayuda}
          </p>
        )}
        {props.multilinea ? (
          <textarea {...comun} className={`${f.control} ${f.area} ${conError ? f.conError : ''}`} rows={3} maxLength={500} />
        ) : props.opciones ? (
          <select {...comun} className={`${f.control} ${s.select}`}>
            <option value="">Aún no lo sé</option>
            {props.opciones.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            {...comun}
            className={`${f.control} ${conError ? f.conError : ''}`}
            type={props.tipo || 'text'}
            inputMode={props.inputMode}
            autoComplete={props.autoComplete}
          />
        )}
        {conError && <MensajeError id={`e-${nombre}`}>{errores[nombre]}</MensajeError>}
      </div>
    );
  };

  const encabezado = (
    <Encabezado
      versalita="Sala de ventas"
      titulo="Agenda tu visita"
      bajada="Elige un día y una hora. Te mostramos el barrio, los sitios disponibles y las casas; la visita dura cerca de una hora."
    />
  );

  if (estado === 'enviada') {
    const ics = crearIcs({
      uid: `visita-${eleccion.fecha}-${eleccion.hora.replace(':', '')}@reservalasrastras.cl`,
      fecha: eleccion.fecha,
      hora: eleccion.hora,
      ...EVENTO,
    });
    return (
      <>
        {encabezado}
        <Contenedor ancho="texto" className={s.confirmacion}>
          <div className={s.panel}>
            <span className={s.iconoListo} aria-hidden="true">
              <Icono nombre="check" tamano={28} />
            </span>
            <h2 ref={refConfirmacion} tabIndex={-1} className={s.tituloPanel}>
              Solicitud enviada
            </h2>
            <p className={s.textoPanel}>
              Te esperamos el <strong>{fechaLegible(eleccion.fecha)}</strong> a las{' '}
              <strong>{eleccion.hora}</strong>. {TEXTOS.confirmacion}
            </p>
            {datos.email && (
              <p className={s.textoPanel}>
                También te enviamos la confirmación a tu correo, con un enlace para cancelar si cambias
                de planes.
              </p>
            )}
            <address className={s.lugar}>
              <strong>{CONTACTO.sala}</strong>
              <span>
                {CONTACTO.direccion}, {CONTACTO.ciudad}
              </span>
              <a href={CONTACTO.mapa} target="_blank" rel="noopener noreferrer">
                Cómo llegar
              </a>
            </address>
            <div className={f.acciones}>
              <Boton
                href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`}
                download="visita-reserva-las-rastras.ics"
                variante="primario"
                tamano="grande"
                icono="calendario"
                iconoAlInicio
              >
                Agregar a mi calendario
              </Boton>
              <Boton a="/master-plan" variante="contorno" tamano="grande">
                Ver los sitios
              </Boton>
            </div>
          </div>
        </Contenedor>
      </>
    );
  }

  const hayErrores = Object.keys(errores).length > 0 && Object.keys(tocado).length > 0;
  const enviando = estado === 'enviando';

  return (
    <>
      {encabezado}

      <Contenedor className={s.cuerpo}>
        <form className={s.formulario} noValidate onSubmit={enviar} aria-busy={enviando || undefined}>
          <p ref={refResumen} tabIndex={-1} className={f.resumen} role="alert" hidden={!hayErrores}>
            Falta completar {Object.keys(errores).length === 1 ? 'un dato' : 'algunos datos'} antes de
            enviar.
          </p>

          <fieldset className={s.paso}>
            <legend className={s.pasoTitulo}>
              <span className={s.numeroPaso} aria-hidden="true">
                1
              </span>
              Elige el día
            </legend>
            <div className={s.dias}>
              {dias.map((d) => {
                const p = partesDia(d.fecha);
                const elegido = eleccion.fecha === d.fecha;
                return (
                  <label key={d.fecha} className={`${s.dia} ${d.motivo ? s.cerrado : ''} ${elegido ? s.elegido : ''}`}>
                    <input
                      type="radio"
                      name="fecha"
                      value={d.fecha}
                      className={s.radio}
                      checked={elegido}
                      disabled={Boolean(d.motivo)}
                      onChange={() => elegir({ fecha: d.fecha, hora: null })}
                      aria-label={`${fechaLegible(d.fecha)}${d.motivo ? `: ${d.motivo.toLowerCase()}` : ''}`}
                    />
                    <span className={s.diaSemana} aria-hidden="true">
                      {p.semana}
                    </span>
                    <span className={`${s.diaNumero} tabular`} aria-hidden="true">
                      {p.numero}
                    </span>
                    <span className={s.diaMes} aria-hidden="true">
                      {d.motivo ? MOTIVO_CORTO[d.motivo] : p.mes}
                    </span>
                  </label>
                );
              })}
            </div>
            {errores.fecha && tocado.fecha && <MensajeError>{errores.fecha}</MensajeError>}
          </fieldset>

          <fieldset className={s.paso} disabled={!dia}>
            <legend className={s.pasoTitulo}>
              <span className={s.numeroPaso} aria-hidden="true">
                2
              </span>
              Elige la hora
            </legend>
            {dia ? (
              <>
                <p className={s.ayuda}>{fechaLegible(dia.fecha)}</p>
                <div className={s.horas}>
                  {dia.bloques.map((b) => (
                    <label
                      key={b.hora}
                      className={`${s.hora} ${b.libre ? '' : s.cerrado} ${eleccion.hora === b.hora ? s.elegido : ''}`}
                    >
                      <input
                        type="radio"
                        name="hora"
                        value={b.hora}
                        className={s.radio}
                        checked={eleccion.hora === b.hora}
                        disabled={!b.libre}
                        onChange={() => elegir({ hora: b.hora })}
                        aria-label={`${b.hora}${b.libre ? '' : ': no disponible'}`}
                      />
                      <span className="tabular" aria-hidden="true">
                        {b.hora}
                      </span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <p className={s.ayuda}>Primero elige un día.</p>
            )}
            {errores.hora && tocado.hora && <MensajeError>{errores.hora}</MensajeError>}
          </fieldset>

          <fieldset className={s.paso}>
            <legend className={s.pasoTitulo}>
              <span className={s.numeroPaso} aria-hidden="true">
                3
              </span>
              Tus datos
            </legend>
            <div className={s.campos}>
              {campo('nombre', 'Nombre', { autoComplete: 'name' })}
              {campo('telefono', 'Teléfono (WhatsApp)', { tipo: 'tel', inputMode: 'tel', autoComplete: 'tel' })}
              {campo('email', 'Correo', {
                tipo: 'email',
                autoComplete: 'email',
                opcional: true,
                ayuda: 'Para enviarte la confirmación y el archivo de calendario.',
              })}
              {campo('interes', '¿Qué te interesa?', {
                opcional: true,
                opciones: interesUrl && !OPCIONES.includes(interesUrl) ? [interesUrl, ...OPCIONES] : OPCIONES,
              })}
              {campo('comentario', 'Comentario', { multilinea: true, opcional: true, ancho: true })}
            </div>

            <div className={s.trampa} aria-hidden="true">
              <label>
                No completar este campo
                <input name="website" tabIndex={-1} autoComplete="off" value={datos.website} onChange={cambiar('website')} />
              </label>
            </div>

            <p className={s.aviso}>
              {TEXTOS.aviso} <Link to="/privacidad">Política de privacidad</Link>
            </p>

            <label className={s.casilla}>
              <input
                type="checkbox"
                checked={datos.consentimiento}
                onChange={cambiar('consentimiento')}
                aria-invalid={Boolean(errores.consentimiento && tocado.consentimiento) || undefined}
                aria-describedby={errores.consentimiento && tocado.consentimiento ? 'e-consentimiento' : undefined}
              />
              <span>{TEXTOS.consentimiento}</span>
            </label>
            {errores.consentimiento && tocado.consentimiento && (
              <MensajeError id="e-consentimiento">{errores.consentimiento}</MensajeError>
            )}

            <label className={s.casilla}>
              <input type="checkbox" checked={datos.marketing} onChange={cambiar('marketing')} />
              <span>
                {TEXTOS.marketing}
                <span className={f.opcional}> · opcional</span>
              </span>
            </label>
          </fieldset>

          {estado === 'fallo' && (
            <div className={s.fallo} role="alert">
              <p>
                <strong>No pudimos registrar tu solicitud.</strong> Envíala por WhatsApp: el mensaje ya
                va escrito con el día y la hora que elegiste.
              </p>
              <Boton href={respaldo()} variante="primario" icono="whatsapp" iconoAlInicio>
                Enviar por WhatsApp
              </Boton>
            </div>
          )}

          {aviso && (
            <p className={f.resumen} role="alert">
              {aviso}
            </p>
          )}

          <div className={s.envio}>
            {modo === 'whatsapp' ? (
              <>
                <Boton type="submit" variante="primario" tamano="grande" icono="whatsapp" iconoAlInicio>
                  Solicitar por WhatsApp
                </Boton>
                <p className={s.ayuda}>
                  Se abrirá WhatsApp con tu solicitud ya escrita; la sala de ventas te confirma la hora.
                </p>
              </>
            ) : (
              <Boton type="submit" variante="primario" tamano="grande" disabled={modo === 'cargando' || enviando}>
                {enviando ? 'Enviando…' : 'Solicitar visita'}
              </Boton>
            )}
          </div>
        </form>

        <aside className={s.lateral} aria-labelledby="titulo-sala">
          <h2 id="titulo-sala" className={`versalita ${s.lateralTitulo}`}>
            Dónde nos encontramos
          </h2>
          <address className={s.lugar}>
            <strong>{CONTACTO.sala}</strong>
            <span>
              {CONTACTO.direccion}, {CONTACTO.ciudad}
            </span>
            <a href={CONTACTO.mapa} target="_blank" rel="noopener noreferrer">
              Cómo llegar
            </a>
          </address>
          <ul className={s.horario}>
            {HORARIO.map((h) => (
              <li key={h.dias}>
                <span>{h.dias}</span>
                <span className="tabular">{h.horas}</span>
              </li>
            ))}
          </ul>
          <p className={s.ayuda}>¿Prefieres escribirnos?</p>
          <Boton href={whatsAppDirecto('agendar una visita a Reserva Las Rastras')} variante="contorno" icono="whatsapp" iconoAlInicio>
            {CONTACTO.telefono}
          </Boton>
        </aside>
      </Contenedor>
    </>
  );
}

function MensajeError({ id, children }) {
  return (
    <p className={f.error} id={id}>
      <Icono nombre="cerrar" tamano={14} />
      {children}
    </p>
  );
}
