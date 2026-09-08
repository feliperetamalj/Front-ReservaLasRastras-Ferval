import { Link, useParams } from 'react-router-dom';
import { Boton, Contenedor, Etiqueta, Icono, Reveal, Seccion } from '../components/ui';
import { BloqueContacto, Galeria, ModeloCard } from '../components/sections';
import { modelos, porSlug } from '../data/modelos';
import { FOTOS } from '../data/proyecto';
import { m2, uf } from '../utils/formato';
import { whatsAppDirecto } from '../utils/contacto';
import { NoEncontrada } from './NoEncontrada';
import s from './ModeloDetalle.module.css';

export function ModeloDetalle() {
  const { slug } = useParams();
  const modelo = porSlug(slug);

  if (!modelo) return <NoEncontrada />;

  const otros = modelos.filter((m) => m.slug !== modelo.slug).slice(0, 3);
  const ficha = [
    { rotulo: 'Superficie', valor: m2(modelo.m2), icono: 'superficie' },
    { rotulo: 'Dormitorios', valor: modelo.dormitorios, icono: 'cama' },
    { rotulo: 'Baños', valor: modelo.banos, icono: 'bano' },
    { rotulo: 'Niveles', valor: modelo.pisos, icono: 'niveles' },
  ];

  return (
    <>
      {/* --- Portada --- */}
      <header className={`${s.portada} enOscuro`}>
        <img
          src={modelo.hero}
          srcSet={modelo.heroSrcSet}
          sizes="100vw"
          alt={`Fachada del modelo ${modelo.nombre}`}
          className={s.portadaFoto}
          fetchPriority="high"
          decoding="async"
        />
        <div className={s.velo} />

        <Contenedor className={s.portadaContenido}>
          <Link to="/modelos" className={s.volver}>
            <Icono nombre="flechaIzq" tamano={16} />
            Todos los modelos
          </Link>

          <Etiqueta tono="oscuro" className={s.estilo}>
            {modelo.estilo} · {modelo.pisos === 1 ? 'un piso' : 'dos pisos'}
          </Etiqueta>

          <h1 className={s.titulo}>{modelo.nombre}</h1>
          <p className={s.resumen}>{modelo.resumen}</p>

          <dl className={s.ficha}>
            {ficha.map((f) => (
              <div key={f.rotulo} className={s.fichaItem}>
                <dt className={s.fichaRotulo}>
                  <Icono nombre={f.icono} tamano={16} />
                  {f.rotulo}
                </dt>
                <dd className={`${s.fichaValor} tabular`}>{f.valor}</dd>
              </div>
            ))}
            <div className={s.fichaItem}>
              <dt className={s.fichaRotulo}>Precio</dt>
              <dd className={`${s.fichaValor} tabular`}>{uf(modelo.uf)}</dd>
            </div>
          </dl>

          <div className={s.acciones}>
            <Boton
              href={whatsAppDirecto(`el modelo ${modelo.nombre} de Reserva Las Rastras`)}
              variante="primario"
              tamano="grande"
              icono="whatsapp"
              iconoAlInicio
            >
              Cotizar este modelo
            </Boton>
            <Boton href="#planta" variante="contornoClaro" tamano="grande">
              Ver la planta
            </Boton>
          </div>
        </Contenedor>
      </header>

      {/* --- Descripción y terminaciones --- */}
      <Seccion fondo="papel">
        <div className={s.detalle}>
          <Reveal className={s.descripcion}>
            <p className={`versalita ${s.versalita}`}>El modelo</p>
            <p className={s.texto}>{modelo.descripcion}</p>

            <ul className={s.destacados}>
              {modelo.destacados.map((d) => (
                <li key={d} className={s.destacado}>
                  <Icono nombre="check" tamano={18} className={s.check} />
                  {d}
                </li>
              ))}
            </ul>

            <p className={s.material}>
              <strong>Estructura:</strong> {modelo.material}.
            </p>

            {modelo.notaDato && (
              <p className={s.nota}>
                <Icono nombre="lupa" tamano={16} className={s.iconoNota} />
                {modelo.notaDato}
              </p>
            )}
          </Reveal>

          <Reveal className={s.terminaciones} retraso={100}>
            <h2 className={`versalita ${s.versalita}`}>Terminaciones</h2>
            <ul className={s.listaTerminaciones}>
              {modelo.terminaciones.map((t) => (
                <li key={t} className={s.terminacion}>
                  {t}
                </li>
              ))}
            </ul>

            <h2 className={`versalita ${s.versalita} ${s.versalitaExtra}`}>Obras adicionales</h2>
            <ul className={s.listaTerminaciones}>
              {modelo.adicionales.map((a) => (
                <li key={a} className={s.terminacion}>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Seccion>

      {/* --- Galería --- */}
      {modelo.galeriaImgs.length > 0 && (
        <Seccion
          fondo="blanco"
          versalita="Galería"
          titulo={`El ${modelo.nombre} por dentro`}
          bajada="Imágenes referenciales. Los interiores no incluyen muebles ni paisajismo terminado."
        >
          <Galeria imagenes={modelo.galeriaImgs} />
        </Seccion>
      )}

      {/* --- Plantas --- */}
      <Seccion
        id="planta"
        fondo="alterno"
        versalita="Planta"
        titulo={modelo.plantas.length > 1 ? 'Plantas por nivel' : 'Distribución'}
        bajada="Plantas, superficies e imágenes referenciales."
      >
        <div className={s.plantas} data-cantidad={modelo.plantasImgs.length}>
          {modelo.plantasImgs.map((p) => (
            <Reveal key={p.src} className={s.planta}>
              <img src={p.src} alt={p.alt} width={p.ancho} height={p.alto} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </div>

        <Reveal className={s.emplazamiento}>
          <h3 className={s.emplazamientoTitulo}>Emplazamiento en el barrio</h3>
          <img
            src={FOTOS.emplazamiento.src}
            alt="Plano de emplazamiento del barrio Reserva Las Rastras"
            width={FOTOS.emplazamiento.ancho}
            height={FOTOS.emplazamiento.alto}
            loading="lazy"
            decoding="async"
            className={s.emplazamientoImg}
          />
        </Reveal>
      </Seccion>

      {/* --- Otros modelos --- */}
      <Seccion
        fondo="papel"
        versalita="Otros modelos"
        titulo="Compara con el resto"
        acciones={
          <Boton a="/modelos" variante="enlace" icono="flecha">
            Ver los seis
          </Boton>
        }
      >
        <div className={s.otros}>
          {otros.map((m, i) => (
            <Reveal key={m.slug} retraso={i * 70}>
              <ModeloCard modelo={m} />
            </Reveal>
          ))}
        </div>
      </Seccion>

      <BloqueContacto
        interes={`el modelo ${modelo.nombre} de Reserva Las Rastras`}
        titulo={`Cotiza el ${modelo.nombre}`}
        bajada="Te enviamos el detalle de superficies, terminaciones y las condiciones de compra vigentes."
      />
    </>
  );
}
