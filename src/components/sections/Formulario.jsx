import { useEffect, useRef, useState } from 'react';
import { Boton, Icono } from '../ui';
import { componerMensaje, enlaceCorreo, enlaceWhatsApp } from '../../utils/contacto';
import s from './Formulario.module.css';

const VACIO = { nombre: '', telefono: '', email: '', mensaje: '' };

/** Reglas de validación. Cuatro campos, uno opcional. */
function validar({ nombre, telefono, email }) {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'Escribe tu nombre para saber con quién hablamos.';

  const hayTelefono = telefono.trim().length > 0;
  const hayEmail = email.trim().length > 0;

  if (!hayTelefono && !hayEmail) {
    errores.telefono = 'Necesitamos al menos un teléfono o un correo para responderte.';
  } else {
    if (hayTelefono && telefono.replace(/\D/g, '').length < 8) {
      errores.telefono = 'El teléfono parece incompleto.';
    }
    if (hayEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errores.email = 'Revisa el correo: le falta el @ o el dominio.';
    }
  }
  return errores;
}

/**
 * El formulario no envía a ningún servidor: compone el mensaje y lo entrega a
 * WhatsApp o al cliente de correo, que es donde la sala de ventas ya trabaja.
 */
export function Formulario({ interes, tono = 'claro' }) {
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});
  const [intentos, setIntentos] = useState(0);
  const refResumen = useRef(null);

  /*
    El foco al aviso va en un efecto, no dentro del manejador del clic.
    En el primer envío fallido el aviso todavía está `hidden` cuando corre el
    manejador — React aún no ha vuelto a pintar — y un elemento oculto no puede
    recibir el foco: el lector de pantalla se quedaba sin anuncio justo en el
    intento que más importa. Aquí ya está en el DOM y visible.
  */
  useEffect(() => {
    if (intentos > 0) refResumen.current?.focus();
  }, [intentos]);

  const cambiar = (campo) => (e) => {
    const valor = e.target.value;
    setDatos((d) => ({ ...d, [campo]: valor }));
    // Revalida en caliente solo lo que ya se tocó: no se regaña mientras escribe.
    if (tocado[campo]) {
      setErrores(validar({ ...datos, [campo]: valor }));
    }
  };

  const salir = (campo) => () => {
    setTocado((t) => ({ ...t, [campo]: true }));
    setErrores(validar(datos));
  };

  /** Devuelve el texto compuesto, o null si el formulario no está completo. */
  const preparar = () => {
    const nuevos = validar(datos);
    setErrores(nuevos);
    setTocado({ nombre: true, telefono: true, email: true });

    if (Object.keys(nuevos).length > 0) {
      // Dispara el efecto que lleva el foco al resumen ya renderizado.
      setIntentos((n) => n + 1);
      return null;
    }
    return componerMensaje({ ...datos, interes });
  };

  const porWhatsApp = () => {
    const texto = preparar();
    if (texto) window.open(enlaceWhatsApp(texto), '_blank', 'noopener,noreferrer');
  };

  const porCorreo = () => {
    const texto = preparar();
    if (texto) window.location.href = enlaceCorreo(texto, interes && `Consulta · ${interes}`);
  };

  const campo = (nombre, etiqueta, props = {}) => {
    const conError = Boolean(errores[nombre] && tocado[nombre]);
    return (
      <div className={s.campo}>
        <label className={s.etiqueta} htmlFor={`f-${nombre}`}>
          {etiqueta}
          {props.opcional && <span className={s.opcional}> · opcional</span>}
        </label>
        {props.multilinea ? (
          <textarea
            id={`f-${nombre}`}
            className={`${s.control} ${s.area} ${conError ? s.conError : ''}`}
            value={datos[nombre]}
            onChange={cambiar(nombre)}
            onBlur={salir(nombre)}
            rows={4}
            aria-invalid={conError || undefined}
            aria-describedby={conError ? `e-${nombre}` : undefined}
          />
        ) : (
          <input
            id={`f-${nombre}`}
            className={`${s.control} ${conError ? s.conError : ''}`}
            type={props.tipo || 'text'}
            inputMode={props.inputMode}
            autoComplete={props.autoComplete}
            value={datos[nombre]}
            onChange={cambiar(nombre)}
            onBlur={salir(nombre)}
            aria-invalid={conError || undefined}
            aria-describedby={conError ? `e-${nombre}` : undefined}
          />
        )}
        {conError && (
          <p className={s.error} id={`e-${nombre}`}>
            <Icono nombre="cerrar" tamano={14} />
            {errores[nombre]}
          </p>
        )}
      </div>
    );
  };

  const hayErrores = Object.keys(errores).length > 0 && Object.keys(tocado).length > 0;

  return (
    <form className={`${s.formulario} ${s[tono]}`} noValidate onSubmit={(e) => e.preventDefault()}>
      <p
        ref={refResumen}
        tabIndex={-1}
        className={s.resumen}
        role="alert"
        hidden={!hayErrores}
      >
        Falta completar {Object.keys(errores).length === 1 ? 'un campo' : 'algunos campos'} antes
        de enviar.
      </p>

      <div className={s.grilla}>
        {campo('nombre', 'Nombre', { autoComplete: 'name' })}
        {campo('telefono', 'Teléfono', {
          tipo: 'tel',
          inputMode: 'tel',
          autoComplete: 'tel',
        })}
        {campo('email', 'Correo', { tipo: 'email', autoComplete: 'email' })}
      </div>

      {campo('mensaje', 'Mensaje', { multilinea: true, opcional: true })}

      <div className={s.acciones}>
        <Boton variante="primario" tamano="grande" icono="whatsapp" iconoAlInicio onClick={porWhatsApp}>
          Enviar por WhatsApp
        </Boton>
        <Boton
          variante={tono === 'oscuro' ? 'contornoClaro' : 'contorno'}
          tamano="grande"
          icono="correo"
          iconoAlInicio
          onClick={porCorreo}
        >
          Enviar por correo
        </Boton>
      </div>

      <p className={s.nota}>
        Al continuar se abre WhatsApp o tu correo con el mensaje ya escrito. Nada se envía ni se
        guarda desde este sitio.
      </p>
    </form>
  );
}
