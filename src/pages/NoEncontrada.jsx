import { Anillos, Boton, Contenedor } from '../components/ui';
import s from './NoEncontrada.module.css';

export function NoEncontrada() {
  return (
    <section className={s.pagina}>
      <Anillos variante="claro" className={s.marcaAgua} />
      <Contenedor ancho="texto" className={s.contenido}>
        <p className={`versalita ${s.versalita}`}>Error 404</p>
        <h1 className={s.titulo}>Esta página no existe</h1>
        <p className={s.texto}>
          El enlace que seguiste apunta a algo que ya no está aquí. Puedes volver al inicio o ir
          directo a los modelos y a los sitios disponibles.
        </p>
        <div className={s.acciones}>
          <Boton a="/" variante="primario" tamano="grande">
            Volver al inicio
          </Boton>
          <Boton a="/modelos" variante="contorno" tamano="grande">
            Ver los modelos
          </Boton>
        </div>
      </Contenedor>
    </section>
  );
}
