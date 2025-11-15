export const Home = async (req, res) => {
  res.send(`

    <!DOCTYPE html>

    <html lang="es">

    <head>

      <meta charset="UTF-8" />

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>Bienvenido a la API</title>

      <style>

        body {

          font-family: Arial, sans-serif;

          background: linear-gradient(135deg, #4a90e2, #50e3c2);

          color: white;

          display: flex;

          justify-content: center;

          align-items: center;

          height: 100vh;

          margin: 0;

          text-align: center;

        }

        h1 {

          font-size: 3rem;

          margin-bottom: 0.5rem;

        }

        p {

          font-size: 1.5rem;

          opacity: 0.85;

        }

        img {
            width: 200px;       /* ancho */
            height: 200px;      /* alto */
            object-fit: cover;  /* evita deformaciones */
            border-radius: 10px; /* esquinas redondeadas */
            box-shadow: 0 4px 6px rgba(0,0,0,0.2); /* sombra */
            border: 1px solid #ccc; /* borde gris */
        }

      </style>

    </head>

    <body>

      <div>

        <img src="https://r-charts.com/es/miscelanea/procesamiento-imagenes-magick_files/figure-html/color-fondo-imagen-r.png" alt="Colibrí">

        <h1>¡Bienvenido a la API de Tópicos Avanzados de desarrollo Web!</h1>

        <p>Explora las funcionalidades y disfruta tu experiencia.</p>

      </div>

    </body>

    </html>

  `);
};
