const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "메뉴 열기");
      navigation.classList.remove("is-open");
    }
  });
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const contactForm = document.querySelector("#contact-form");
if (contactForm instanceof HTMLFormElement) {
  const contactFields = Array.from(contactForm.querySelectorAll("input, textarea"));
  const formStatus = contactForm.querySelector("#contact-form-status");

  const validateField = (field) => {
    const value = field.value.trim();
    let errorMessage = "";

    if (!value) {
      errorMessage = field.type === "email"
        ? "이메일을 입력해 주세요."
        : field.tagName === "TEXTAREA"
          ? "메시지를 입력해 주세요."
          : "이름을 입력해 주세요.";
    } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errorMessage = "올바른 이메일 주소를 입력해 주세요.";
    }

    field.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    const errorId = field.getAttribute("aria-describedby");
    const errorElement = errorId ? contactForm.querySelector(`#${errorId}`) : null;
    if (errorElement) {
      errorElement.textContent = errorMessage;
    }
    return !errorMessage;
  };

  contactFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
      if (formStatus) {
        formStatus.textContent = "";
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = contactFields.map(validateField).every(Boolean);

    if (formStatus) {
      formStatus.textContent = isValid
        ? "입력 내용이 확인되었습니다. (실제 메시지는 전송되지 않았습니다.)"
        : "입력 내용을 확인해 주세요.";
    }

    if (!isValid) {
      contactFields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
    }
  });
}
