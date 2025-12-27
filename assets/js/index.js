/*
  ===============================
  CÓDIGO BASE – NO MODIFICAR
  ===============================
*/

// API para obtener datos de un usuario
const obtenerUsuario = (id, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!id) {
      callback('Error: ID de usuario no proporcionado.', null);
      return;
    }
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
    const comentarios = [
      { id: 1, texto: '¡Excelente post!' },
      { id: 2, texto: 'Muy informativo, gracias.' }
    ];
    callback(null, comentarios);
  }, demora);
};

/*
  ===============================
  LÓGICA DEL EJERCICIO
  ===============================
*/

// DOM
const output = document.getElementById("output");
const progressBar = document.getElementById("progressBar");
const userIdInput = document.getElementById("userId");

// UI helpers
function resetUI() {
  output.textContent = "";
  progressBar.style.width = "0%";
}

function avanzarProgreso(porcentaje) {
  progressBar.style.width = porcentaje + "%";
}

function mostrarResultado(titulo, texto) {
  output.textContent = `${titulo}\n\n${texto}`;
}

/*
  ===============================
  PROMESAS (wrappers)
===============================
*/
const obtenerUsuarioPromise = (id) =>
  new Promise((resolve, reject) => {
    obtenerUsuario(id, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

const obtenerPostsPromise = (id) =>
  new Promise((resolve, reject) => {
    obtenerPosts(id, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

const obtenerComentariosPromise = (id) =>
  new Promise((resolve, reject) => {
    obtenerComentarios(id, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

/*
  ===============================
  CALLBACKS
  ===============================
*/
document.getElementById("btnCallbacks").addEventListener("click", () => {
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

/*
  ===============================
  PROMESAS
  ===============================
*/
document.getElementById("btnPromesas").addEventListener("click", () => {
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

/*
  ===============================
  ASYNC / AWAIT
  ===============================
*/
document.getElementById("btnAsync").addEventListener("click", async () => {
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
