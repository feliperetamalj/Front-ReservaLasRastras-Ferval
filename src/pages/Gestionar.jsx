import { useEffect, useRef, useState } from 'react';
import { Boton, Contenedor } from '../components/ui';
import { Encabezado } from './Encabezado';
import { fechaLegible } from '../utils/agenda';
import { whatsAppDirecto } from '../utils/contacto';
import f from '../components/sections/Formulario.module.css';
import s from './Agendar.module.css';

const ESTADOS = {
  solicitada: 'Solicitada: la sala de ventas te confirmará por WhatsApp.',
  confirmada: 'Confirmada.',
  realizada: 'Realizada.',
  cancelada: 'Cancelada.',
};

const pedir = async (token, accion) => {
  const r = await fetch('/api/gestionar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, accion }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'No pudimos completar la acción.');
  return j.visita;
};

/**
 * Cancelar la visita o borrar los datos, desde el enlace del correo de
 * confirmación. El token viene en el fragmento (#token=…), que no llega al
 * servidor del sitio; se lee al montar.
 */
export function Gestionar() {
  const [token, setToken] = useState(null);
  const [visita, setVisita] = useState(null);
  const [estado, setEstado] = useState('cargando'); // cargando · lista · trabajando · error · sinToken
  const [mensaje, setMensaje] = useState('');
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const refResultado = useRef(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (!t) return setEstado('sinToken');
    setToken(t);
    pedir(t, 'ver')
      .then((v) => {
        setVisita(v);
        setEstado('lista');
      })
      .catch((e) => {
        setMensaje(e.message);
        setEstado('error');
      });
  }, []);

  useEffect(() => {
    if (mensaje) refResultado.current?.focus();
  }, [mensaje]);

  const actuar = async (accion) => {
    setEstado('trabajando');
    try {
      const v = await pedir(token, accion);
      setVisita(v);
      setMensaje(
        accion === 'borrar'
          ? 'Listo: borramos tus datos y la solicitud de visita.'
          : 'Listo: cancelamos tu visita. Si quieres, puedes agendar otra.',
      );
      setEstado('lista');
    } catch (e) {
      setMensaje(e.message);
      setEstado('error');
    }
  };

  const activa = visita && ['solicitada', 'confirmada'].includes(visita.estado);
  const borrada = visita?.estado === 'borrada';

  return (
    <>
      <Encabezado
        versalita="Agenda"
        titulo="Tu visita"
        bajada="Cancela tu visita o pide que borremos tus datos. Es inmediato y no tienes que explicar nada."
      />
      <Contenedor ancho="texto" className={s.confirmacion}>
        <div className={s.panel} aria-busy={estado === 'cargando' || estado === 'trabajando' || undefined}>
          {estado === 'cargando' && <p className={s.textoPanel}>Buscando tu visita…</p>}

          {estado === 'sinToken' && (
            <p className={s.textoPanel}>
              Este enlace está incompleto. Usa el del correo de confirmación, o escríbenos y lo
              hacemos por ti.
            </p>
          )}

          {mensaje && (
            <p
              ref={refResultado}
              tabIndex={-1}
              className={estado === 'error' ? f.resumen : s.textoPanel}
              role={estado === 'error' ? 'alert' : 'status'}
            >
              {mensaje}
            </p>
          )}

          {visita && !borrada && (
            <dl className={s.lugar}>
              <dt>
                <strong>
                  {fechaLegible(visita.fecha)}, {visita.hora}
                </strong>
              </dt>
              <dd>{ESTADOS[visita.estado]}</dd>
            </dl>
          )}

          {visita && !borrada && (
            <div className={f.acciones}>
              {activa && (
                <Boton variante="contorno" onClick={() => actuar('cancelar')} disabled={estado === 'trabajando'}>
                  Cancelar mi visita
                </Boton>
              )}
              {confirmarBorrado ? (
                <Boton variante="oscuro" onClick={() => actuar('borrar')} disabled={estado === 'trabajando'}>
                  Sí, borrar mis datos
                </Boton>
              ) : (
                <Boton variante="contorno" onClick={() => setConfirmarBorrado(true)}>
                  Borrar mis datos
                </Boton>
              )}
            </div>
          )}
          {confirmarBorrado && !borrada && (
            <p className={s.ayuda}>
              Se elimina tu nombre, teléfono, correo y la solicitud completa. No se puede deshacer.
            </p>
          )}

          {(estado === 'error' || estado === 'sinToken' || visita?.estado === 'cancelada' || borrada) && (
            <div className={f.acciones}>
              {estado !== 'error' && estado !== 'sinToken' && (
                <Boton a="/agendar" variante="primario">
                  Agendar otra visita
                </Boton>
              )}
              <Boton href={whatsAppDirecto('cancelar o cambiar mi visita a Reserva Las Rastras')} variante="contorno" icono="whatsapp" iconoAlInicio>
                Escribir por WhatsApp
              </Boton>
            </div>
          )}
        </div>
      </Contenedor>
    </>
  );
}
