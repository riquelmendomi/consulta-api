/*
====================================================
E4-M4 — Simulación de Consulta a Múltiples APIs
====================================================
*/

/* ===================== APIs ===================== */

// Usuario
const obtenerUsuario = (id, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!id) {
      console.error("Error: ID de usuario no proporcionado.");
      callback("Error: ID de usuario no proporcionado.", null);
      return;
    }
    console.log(`Buscando usuario con ID: ${id}...`);
    callback(null, { id, nombre: "John Doe", email: "john.doe@example.com" });
  }, demora);
};

// Posts
const obtenerPosts = (userId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!userId) {
      console.error("Error: ID de usuario no proporcionado para buscar posts.");
      callback("Error: ID de usuario no proporcionado para buscar posts.", null);
      return;
    }
    console.log(`Buscando posts del usuario con ID: ${userId}...`);
    callback(null, [
      { id: 101, titulo: "Mi primer post", contenido: "..." },
      { id: 102, titulo: "Mi segundo post", contenido: "..." }
    ]);
  }, demora);
};

// Comentarios
const obtenerComentarios = (postId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!postId) {
      console.error("Error: ID de post no proporcionado para buscar comentarios.");
      callback("Error: ID de post no proporcionado para buscar comentarios.", null);
      return;
    }
    console.log(`Buscando comentarios del post con ID: ${postId}...`);
    callback(null, [
      { id: 1, texto: "¡Excelente post!" },
      { id: 2, texto: "Muy informativo, gracias." }
    ]);
  }, demora);
};

/* ===================== UI ===================== */

const output = document.getElementById("output");
const progressBar = document.getElementById("progressBar");
const userIdInput = document.getElementById("userId");

function resetUI() {
  output.textContent = "";
  progressBar.style.width = "0%";
}

function avanzarProgreso(p) {
  progressBar.style.width = p + "%";
}

function mostrarResultado(titulo, texto) {
  output.textContent = `${titulo}\n\n${texto}`;
}

/* ===================== PROMESAS ===================== */

const obtenerUsuarioPromise = id =>
  new Promise((resolve, reject) =>
    obtenerUsuario(id, (e, d) => (e ? reject(e) : resolve(d)))
  );

const obtenerPostsPromise = id =>
  new Promise((resolve, reject) =>
    obtenerPosts(id, (e, d) => (e ? reject(e) : resolve(d)))
  );

const obtenerComentariosPromise = id =>
  new Promise((resolve, reject) =>
    obtenerComentarios(id, (e, d) => (e ? reject(e) : resolve(d)))
  );

/* ===================== CALLBACKS ===================== */

document.getElementById("btnCallbacks").addEventListener("click", () => {
  console.clear();
  resetUI();
  avanzarProgreso(30);

  obtenerUsuario(userIdInput.value, (e, usuario) => {
    if (e) return mostrarResultado("Resultado — Callbacks", e);

    avanzarProgreso(60);
    obtenerPosts(usuario.id, (e, posts) => {
      if (e) return mostrarResultado("Resultado — Callbacks", e);

      avanzarProgreso(90);
      obtenerComentarios(posts[0].id, (e, comentarios) => {
        if (e) return mostrarResultado("Resultado — Callbacks", e);

        avanzarProgreso(100);
        mostrarResultado(
          "Resultado — Callbacks",
          `Usuario: ${usuario.nombre}\nComentarios: ${comentarios.length}`
        );
      });
    });
  });
});

/* ===================== PROMESAS ===================== */

document.getElementById("btnPromesas").addEventListener("click", () => {
  console.clear();
  resetUI();
  avanzarProgreso(30);

  obtenerUsuarioPromise(userIdInput.value)
    .then(u => {
      avanzarProgreso(60);
      return obtenerPostsPromise(u.id);
    })
    .then(p => {
      avanzarProgreso(90);
      return obtenerComentariosPromise(p[0].id);
    })
    .then(c => {
      avanzarProgreso(100);
      mostrarResultado("Resultado — Promesas", `Comentarios: ${c.length}`);
    })
    .catch(e => mostrarResultado("Resultado — Promesas", e));
});

/* ===================== ASYNC / AWAIT ===================== */

document.getElementById("btnAsync").addEventListener("click", async () => {
  console.clear();
  resetUI();

  try {
    avanzarProgreso(30);
    const u = await obtenerUsuarioPromise(userIdInput.value);

    avanzarProgreso(60);
    const p = await obtenerPostsPromise(u.id);

    avanzarProgreso(90);
    const c = await obtenerComentariosPromise(p[0].id);

    avanzarProgreso(100);
    mostrarResultado("Resultado — Async/Await", `Comentarios: ${c.length}`);
  } catch (e) {
    mostrarResultado("Resultado — Async/Await", e);
  }
});
