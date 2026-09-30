(() => {
  const routes = [
    {
      id: "home",
      file: "/html/index.html",
      paths: ["/", "/html/", "/html/index.html", "/index.html"],
    },
    {
      id: "projects",
      file: "/html/projetos.html",
      paths: ["/html/projetos.html"],
    },
    {
      id: "registration",
      file: "/html/cadastro.html",
      paths: ["/html/cadastro.html"],
    },
  ];
  const routeByPath = new Map(
    routes.flatMap((route) => route.paths.map((path) => [path, route])),
  );
  const projects = [
    {
      title: "Espaço de leitura",
      category: "Educação",
      categoryClass: "badge--education",
      description:
        "Encontros de leitura e contação de histórias para crianças.",
      image: null,
      buttonText: "Quero participar",
    },
    {
      title: "Oficinas de aprendizagem",
      category: "Educação",
      categoryClass: "badge--education",
      description:
        "Atividades de apoio escolar, criatividade e troca de conhecimentos.",
      image: null,
      buttonText: "Quero participar",
    },
    {
      title: "Encontro comunitário",
      category: "Voluntariado",
      categoryClass: "badge--volunteer",
      description:
        "Rodas de conversa e atividades culturais para moradores.",
      image: null,
      buttonText: "Quero participar",
    },
  ];
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  const pageCache = new Map();
  const app = document.querySelector("#app");

  let renderedRouteId = null;
  let activeRenderId = 0;
  let cleanupCurrentPage = () => {};

  const routeForUrl = (url) => {
    const destination = new URL(url, window.location.href);
    return routeByPath.get(destination.pathname) ?? null;
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => htmlEscapes[character]);
  }

  function createProjectCard(project) {
    const imageMarkup = project.image
      ? `<img class="project-card__image" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || project.title)}" loading="lazy">`
      : "";

    return `
      <article class="project-card">
        ${imageMarkup}
        <div class="project-card__body">
          <span class="badge ${escapeHtml(project.categoryClass)}">${escapeHtml(project.category)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <a class="project-card__action" href="cadastro.html">${escapeHtml(project.buttonText)}</a>
        </div>
      </article>
    `;
  }

  function renderProjects(projectList, root = app) {
    if (!root) return;
    const container = root.querySelector("#projects-container");
    if (!container) return;

    container.innerHTML = projectList.map(createProjectCard).join("");
  }

  const setMenuOpen = (open) => {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".primary-navigation");
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Fechar menu principal" : "Abrir menu principal",
    );
    navigation.classList.toggle("is-open", open);
  };

  const setSubmenuOpen = (open) => {
    const submenuButton = document.querySelector(".submenu-toggle");
    const submenuItem = document.querySelector(".has-submenu");
    if (!submenuButton || !submenuItem) return;

    submenuButton.setAttribute("aria-expanded", String(open));
    submenuButton.setAttribute(
      "aria-label",
      open ? "Fechar submenu de Projetos" : "Abrir submenu de Projetos",
    );
    submenuItem.classList.toggle("is-submenu-open", open);
  };

  function initializePersistentNavigation() {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".primary-navigation");
    const submenuButton = document.querySelector(".submenu-toggle");
    const submenuItem = document.querySelector(".has-submenu");

    if (menuButton && navigation) {
      menuButton.addEventListener("click", () => {
        setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
      });

      document.addEventListener("click", (event) => {
        const target =
          event.target instanceof Element ? event.target : null;
        const clickedOutside =
          target &&
          !navigation.contains(target) &&
          !menuButton.contains(target);
        if (clickedOutside) {
          setMenuOpen(false);
          setSubmenuOpen(false);
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        if (menuButton.getAttribute("aria-expanded") === "true") {
          setMenuOpen(false);
          setSubmenuOpen(false);
          menuButton.focus();
        } else if (submenuButton?.getAttribute("aria-expanded") === "true") {
          setSubmenuOpen(false);
          submenuItem?.querySelector(":scope > a")?.focus();
        }
      });

      window.addEventListener("resize", () => {
        if (window.matchMedia("(min-width: 769px)").matches) {
          setMenuOpen(false);
          setSubmenuOpen(false);
        }
      });
    }

    if (submenuButton) {
      submenuButton.addEventListener("click", () => {
        setSubmenuOpen(submenuButton.getAttribute("aria-expanded") !== "true");
      });
    }
  }

  function initializePageInteractions(root) {
    const toast = root.querySelector("#demo-toast");
    const showToastButton = root.querySelector("#show-toast");
    const closeToastButton = root.querySelector("#close-toast");
    const dialog = root.querySelector("#info-modal");
    const openDialogButton = root.querySelector("#open-info-modal");
    let toastTimeout;
    let toastHideTimeout;

    const hideToast = () => {
      if (!toast) return;
      window.clearTimeout(toastTimeout);
      toast.classList.remove("is-visible");
      toastHideTimeout = window.setTimeout(() => {
        toast.hidden = true;
      }, 200);
    };

    if (toast && showToastButton && closeToastButton) {
      showToastButton.addEventListener("click", () => {
        window.clearTimeout(toastTimeout);
        window.clearTimeout(toastHideTimeout);
        toast.hidden = false;
        toast.classList.remove("is-visible");
        window.requestAnimationFrame(() => toast.classList.add("is-visible"));
        toastTimeout = window.setTimeout(hideToast, 7000);
      });
      closeToastButton.addEventListener("click", hideToast);
    }

    if (dialog && openDialogButton && typeof dialog.showModal === "function") {
      openDialogButton.addEventListener("click", () => dialog.showModal());
      root.querySelectorAll(".close-info-modal").forEach((button) => {
        button.addEventListener("click", () => dialog.close());
      });
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", () => openDialogButton.focus());
    }

    root.querySelectorAll("form").forEach((form) => {
      const feedback = form.querySelector(".form-feedback");
      const inputs = [...form.querySelectorAll("input")];
      const storageKey = `ong-form-${form.id || "cadastro"}`;

      const setFeedback = (message, state) => {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.dataset.state = state;
      };

      const restoreFormData = () => {
        const savedData = localStorage.getItem(storageKey);
        if (!savedData) return;

        try {
          const data = JSON.parse(savedData);

          inputs.forEach((input) => {
            if (!input.name || input.type === "password") return;
            if (Object.prototype.hasOwnProperty.call(data, input.name)) {
              input.value = data[input.name];
            }
          });
        } catch (error) {
          console.error("Não foi possível restaurar os dados do formulário:", error);
          localStorage.removeItem(storageKey);
        }
      };

      form.addEventListener(
        "invalid",
        (event) => {
          form.classList.add("was-validated");
          event.target.setAttribute("aria-invalid", "true");
          setFeedback(
            "Confira os campos destacados e as orientações do navegador antes de enviar.",
            "error",
          );
        },
        true,
      );

      inputs.forEach((input) => {
        const updateValidationState = () => {
          if (input.validity.valid) {
            input.removeAttribute("aria-invalid");
          } else if (form.classList.contains("was-validated")) {
            input.setAttribute("aria-invalid", "true");
          }

          if (form.classList.contains("was-validated")) {
            const hasInvalidInput = inputs.some(
              (field) => !field.validity.valid,
            );
            setFeedback(
              hasInvalidInput
                ? "Confira os campos destacados e as orientações do navegador antes de enviar."
                : "Todos os campos estão válidos. O envio continua sendo apenas demonstrativo.",
              hasInvalidInput ? "error" : "success",
            );
          }
        };

        input.addEventListener("input", updateValidationState);
        input.addEventListener("change", updateValidationState);
      });

      restoreFormData();

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        form.classList.add("was-validated");

        if (!form.reportValidity()) {
          setFeedback(
            "Confira os campos destacados e as orientações do navegador antes de enviar.",
            "error",
          );
          return;
        }

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
          const input = form.elements.namedItem(key);

          if (input?.type === "password") continue;

          data[key] = value;
        }

        localStorage.setItem(storageKey, JSON.stringify(data));

        inputs.forEach((input) => input.removeAttribute("aria-invalid"));

        setFeedback(
          "Dados válidos e salvos no navegador. Eles serão restaurados ao recarregar a página.",
          "success",
        );
      });
    });

    return () => {
      window.clearTimeout(toastTimeout);
      window.clearTimeout(toastHideTimeout);
      if (dialog?.open) dialog.close();
    };
  }

  async function loadPageDocument(route) {
    if (!pageCache.has(route.id)) {
      const pageRequest = (async () => {
        const response = await fetch(route.file);
        if (!response.ok) {
          throw new Error(`Falha ao carregar ${route.file}: ${response.status}`);
        }

        const markup = await response.text();
        const page = new DOMParser().parseFromString(markup, "text/html");
        if (!page.querySelector("main#app")) {
          throw new Error(`A página ${route.file} não contém main#app.`);
        }
        return page;
      })();

      pageCache.set(route.id, pageRequest);
      pageRequest.catch(() => pageCache.delete(route.id));
    }

    return pageCache.get(route.id);
  }

  function scrollToHash(hash) {
    if (!hash) return;
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // Mantém o valor original se o fragmento não estiver codificado corretamente.
    }

    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  async function render(url, { focusMain = true } = {}) {
    const destination = new URL(url, window.location.href);
    const route = routeForUrl(destination);
    if (!route || !app) return false;

    if (renderedRouteId === route.id) {
      if (destination.hash) scrollToHash(destination.hash);
      return true;
    }

    const renderId = ++activeRenderId;
    app.setAttribute("aria-busy", "true");

    try {
      const page = await loadPageDocument(route);
      if (renderId !== activeRenderId) return false;

      const sourceMain = page.querySelector("main#app");
      const sourceHeading = page.querySelector("header > h1");
      const sourceIntro = page.querySelector("header > p");
      const heading = document.querySelector("header > h1");
      const intro = document.querySelector("header > p");

      cleanupCurrentPage();
      app.innerHTML = sourceMain.innerHTML;
      if (heading && sourceHeading) heading.textContent = sourceHeading.textContent;
      if (intro && sourceIntro) intro.textContent = sourceIntro.textContent;
      if (page.title) document.title = page.title;

      renderedRouteId = route.id;
      if (route.id === "projects") renderProjects(projects, app);
      cleanupCurrentPage = initializePageInteractions(app);
      app.removeAttribute("aria-busy");
      setMenuOpen(false);
      setSubmenuOpen(false);

      if (destination.hash) {
        scrollToHash(destination.hash);
      } else {
        if (focusMain) app.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return true;
    } catch (error) {
      if (renderId === activeRenderId) {
        app.removeAttribute("aria-busy");
        const message = document.createElement("p");
        message.className = "alert alert-error";
        message.setAttribute("role", "alert");
        message.dataset.routeError = "true";
        message.textContent =
          "Não foi possível carregar esta área. Tente novamente.";
        app.prepend(message);
        console.error("Falha na navegação SPA:", error);
      }
      return false;
    }
  }

  async function navigate(url, { replace = false } = {}) {
    const destination = new URL(url, window.location.href);
    const route = routeForUrl(destination);
    if (!route) return false;

    const nextUrl = `${destination.pathname}${destination.search}${destination.hash}`;

    if (renderedRouteId === route.id) {
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== currentUrl) {
        window.history[replace ? "replaceState" : "pushState"](
          { route: route.id },
          "",
          nextUrl,
        );
      }
      if (destination.hash) {
        scrollToHash(destination.hash);
      } else if (
        destination.pathname !== window.location.pathname ||
        window.location.hash
      ) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return true;
    }

    const rendered = await render(destination);
    if (!rendered) return false;

    window.history[replace ? "replaceState" : "pushState"](
      { route: route.id },
      "",
      nextUrl,
    );
    return true;
  }

  function handleNavigationClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest("a[href]");
    if (!link || link.hasAttribute("download") || link.target === "_blank") return;

    if (link.closest(".primary-navigation")) {
      setMenuOpen(false);
      setSubmenuOpen(false);
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || !routeForUrl(destination)) {
      return;
    }

    event.preventDefault();
    void navigate(destination);
  }

  function handlePopState() {
    const route = routeForUrl(window.location.href);
    if (!route) {
      void navigate(routes[0].file, { replace: true });
      return;
    }
    void render(window.location.href, { focusMain: false });
  }

  function router() {
    if (!app) return;

    const initialRoute = routeForUrl(window.location.href);
    renderedRouteId = initialRoute?.id ?? null;
    initializePersistentNavigation();
    if (initialRoute?.id === "projects") renderProjects(projects, app);
    cleanupCurrentPage = initializePageInteractions(app);

    document.addEventListener("click", handleNavigationClick);
    window.addEventListener("popstate", handlePopState);

    if (!initialRoute) {
      void navigate(routes[0].file, { replace: true });
    } else if (window.location.hash) {
      scrollToHash(window.location.hash);
    }
  }

  router();
})();