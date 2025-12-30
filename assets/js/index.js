// API para obtener datos de un usuario
const obtenerUsuario = (id, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!id) {
      callback('Error: ID de usuario no proporcionado.', null);
      return;
    }
    console.log(`Buscando usuario con ID: ${id}...`);
    const usuario = { id: id, nombre: 'John Doe', email: 'john.doe@example.com' };
    callback(null, usuario);
  }, demora);
};

// API para obtener los posts de un usuario
const obtenerPosts = (userId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!userId) {
      callback('Error: ID de usuario no proporcionado para buscar posts.', null);
      return;
    }
    console.log(`Buscando posts del usuario con ID: ${userId}...`);
    const posts = [
      { id: 101, titulo: 'Mi primer post', contenido: '...' },
      { id: 102, titulo: 'Mi segundo post', contenido: '...' }
    ];
    callback(null, posts);
  }, demora);
};

// API para obtener los comentarios de un post
const obtenerComentarios = (postId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!postId) {
      callback('Error: ID de post no proporcionado para buscar comentarios.', null);
      return;
    }
    console.log(`Buscando comentarios del post con ID: ${postId}...`);
    const comentarios = [
      { id: 1, texto: '¡Excelente post!' },
      { id: 2, texto: 'Muy informativo, gracias.' }
    ];
    callback(null, comentarios);
  }, demora);
};

/* ==================================================
   PARTE 1 — CALLBACKS (Callback Hell)
================================================== */

document.getElementById("btnCallbacks").addEventListener("click", () => {
  console.clear();
  const id = userIdInput.value;
  resetUI();
  avanzarProgreso(30);

  obtenerUsuario(id, (errUsuario, usuario) => {
    if (errUsuario) {
      avanzarProgreso(100);
      mostrarResultado("Resultado — Callbacks", errUsuario);
      return;
    }

    avanzarProgreso(60);

    obtenerPosts(usuario.id, (errPosts, posts) => {
      if (errPosts) {
        avanzarProgreso(100);
        mostrarResultado("Resultado — Callbacks", errPosts);
        return;
      }

      avanzarProgreso(90);

      obtenerComentarios(posts[0].id, (errComentarios, comentarios) => {
        if (errComentarios) {
          avanzarProgreso(100);
          mostrarResultado("Resultado — Callbacks", errComentarios);
          return;
        }

        avanzarProgreso(100);
        mostrarResultado(
          "Resultado — Callbacks",
          `Usuario: ${usuario.nombre}\nPosts cargados\nComentarios: ${comentarios.length}`
        );
      });
    });
  });
});

/* ==================================================
   PARTE 2 — PROMESAS
================================================== */

document.getElementById("btnPromesas").addEventListener("click", () => {
  console.clear();
  const id = userIdInput.value;
  resetUI();
  avanzarProgreso(30);

  obtenerUsuarioPromise(id)
    .then(usuario => {
      avanzarProgreso(60);
      return obtenerPostsPromise(usuario.id);
    })
    .then(posts => {
      avanzarProgreso(90);
      return obtenerComentariosPromise(posts[0].id);
    })
    .then(comentarios => {
      avanzarProgreso(100);
      mostrarResultado(
        "Resultado — Promesas",
        `Usuario: John Doe\nPosts cargados\nComentarios: ${comentarios.length}`
      );
    })
    .catch(error => {
      avanzarProgreso(100);
      mostrarResultado("Resultado — Promesas", error);
    });
});

/* ==================================================
   PARTE 3 — ASYNC / AWAIT
================================================== */

document.getElementById("btnAsync").addEventListener("click", async () => {
  console.clear();
  const id = userIdInput.value;
  resetUI();

  try {
    avanzarProgreso(30);
    const usuario = await obtenerUsuarioPromise(id);

    avanzarProgreso(60);
    const posts = await obtenerPostsPromise(usuario.id);

    avanzarProgreso(90);
    const comentarios = await obtenerComentariosPromise(posts[0].id);

    avanzarProgreso(100);
    mostrarResultado(
      "Resultado — Async/Await",
      `Usuario: ${usuario.nombre}\nPosts cargados\nComentarios: ${comentarios.length}`
    );
  } catch (error) {
    avanzarProgreso(100);
    mostrarResultado("Resultado — Async/Await", error);
  }
});
